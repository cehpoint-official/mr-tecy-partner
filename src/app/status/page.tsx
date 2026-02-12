"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { partnerApplicationService } from "@/services/partner.service";
import { PartnerApplication } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PartnerStatusPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [application, setApplication] = useState<PartnerApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchApplication() {
            if (!user || authLoading) return;

            try {
                const app = await partnerApplicationService.getPartnerStatus(user.uid);
                if (!app) {
                    // No application found, redirect to apply page
                    router.push("/apply");
                    return;
                }
                setApplication(app);
            } catch (err: any) {
                console.error("Error fetching application:", err);
                setError(err.message || "Failed to load application status");
            } finally {
                setLoading(false);
            }
        }

        fetchApplication();
    }, [user, authLoading, router]);

    // Redirect non-authenticated users
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !application) {
        return null; // Will redirect in useEffect
    }

    // Render different UI based on status
    const getStatusContent = () => {
        switch (application.status) {
            case "pending":
                return {
                    icon: <Clock className="h-16 w-16 text-yellow-500" />,
                    badge: <Badge className="bg-yellow-500 text-white">Pending Review</Badge>,
                    title: "Application Under Review",
                    description: "Your partner application has been submitted and is currently being reviewed by our team. We'll notify you once a decision has been made.",
                    color: "border-yellow-200 bg-yellow-50"
                };
            case "approved":
                return {
                    icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
                    badge: <Badge className="bg-green-500 text-white">Approved</Badge>,
                    title: "Congratulations! You're Approved",
                    description: "You are now an approved partner! You can start accepting service requests and earning with our platform.",
                    color: "border-green-200 bg-green-50"
                };
            case "rejected":
                return {
                    icon: <XCircle className="h-16 w-16 text-red-500" />,
                    badge: <Badge className="bg-red-500 text-white">Rejected</Badge>,
                    title: "Application Not Approved",
                    description: "Unfortunately, your partner application was not approved at this time. Please contact our admin team for more information or to reapply.",
                    color: "border-red-200 bg-red-50"
                };
            default:
                return null;
        }
    };

    const statusContent = getStatusContent();

    if (!statusContent) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Invalid application status</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link href="/profile">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Profile
                    </Button>
                </Link>

                <Card className={`shadow-xl border-2 ${statusContent.color}`}>
                    <CardHeader className="text-center space-y-4 pb-8">
                        <div className="flex justify-center">
                            {statusContent.icon}
                        </div>
                        <div className="flex justify-center">
                            {statusContent.badge}
                        </div>
                        <CardTitle className="text-3xl font-bold">
                            {statusContent.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {statusContent.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Application Details */}
                        <div className="bg-white rounded-lg p-6 space-y-4 border">
                            <h3 className="font-semibold text-lg mb-4">Application Details</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium">{application.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{application.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Service Area</p>
                                    <p className="font-medium">{application.serviceArea}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Experience</p>
                                    <p className="font-medium">{application.experience} years</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {application.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Admin for Rejected */}
                        {application.status === "rejected" && (
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/profile")}
                                >
                                    Contact Admin
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
