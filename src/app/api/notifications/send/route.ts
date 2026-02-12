import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

// Force dynamic rendering - don't pre-render during build
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { userId, title, message, link } = await request.json();

        if (!userId || !title || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // 1. Get user's FCM tokens from Firestore
        const userDoc = await adminDb.collection("user").doc(userId).get();
        if (!userDoc.exists) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const userData = userDoc.data();
        const tokens = userData?.fcmTokens as string[] | undefined;

        if (!tokens || tokens.length === 0) {
            return NextResponse.json(
                { message: "No FCM tokens found for user, notification saved but not sent push." },
                { status: 200 }
            );
        }

        // 2. Send Multicast Message
        const messaging = getMessaging();
        const response = await messaging.sendEachForMulticast({
            tokens,
            notification: {
                title,
                body: message,
            },
            data: {
                url: link || "/",
            },
            webpush: {
                fcmOptions: {
                    link: link || "/"
                }
            }
        });

        // 3. Cleanup invalid tokens
        if (response.failureCount > 0) {
            const failedTokens: string[] = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                }
            });

            if (failedTokens.length > 0) {
                await adminDb.collection("user").doc(userId).update({
                    fcmTokens: userData?.fcmTokens.filter((t: string) => !failedTokens.includes(t))
                });
            }
        }

        return NextResponse.json({
            success: true,
            sentCount: response.successCount,
            failedCount: response.failureCount
        });

    } catch (error: any) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
