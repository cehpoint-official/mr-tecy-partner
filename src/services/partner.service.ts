import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PartnerApplication, PartnerStatus, UserProfile } from "@/types";
import { userService } from "./user.service";

export const partnerApplicationService = {
    /**
     * Apply for partner role
     * Creates application and updates user role atomically
     */
    async applyForPartner(
        userId: string,
        applicationData: Omit<PartnerApplication, 'userId' | 'status' | 'createdAt' | 'updatedAt'>
    ): Promise<PartnerApplication> {
        try {
            const applicationRef = doc(db, "partnerApplications", userId);

            // Check if application already exists
            const existingApp = await getDoc(applicationRef);
            if (existingApp.exists()) {
                throw new Error("Application already exists");
            }

            // Create partner application
            const newApplication: Partial<PartnerApplication> = {
                userId,
                ...applicationData,
                status: 'pending',
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any
            };

            // Create application document using doc() with userId as document ID
            await setDoc(applicationRef, newApplication);

            return newApplication as PartnerApplication;
        } catch (error) {
            console.error("Error applying for partner:", error);
            throw error;
        }
    },

    /**
     * Get partner application status for a user
     */
    async getPartnerStatus(userId: string): Promise<PartnerApplication | null> {
        try {
            const applicationRef = doc(db, "partnerApplications", userId);
            const applicationSnap = await getDoc(applicationRef);

            if (applicationSnap.exists()) {
                return applicationSnap.data() as PartnerApplication;
            }
            return null;
        } catch (error) {
            console.error("Error getting partner status:", error);
            throw error;
        }
    },

    /**
     * Approve a partner application (Admin only)
     */
    async approvePartner(userId: string): Promise<void> {
        try {
            // Update application status to approved
            const applicationRef = doc(db, "partnerApplications", userId);
            await updateDoc(applicationRef, {
                status: 'approved',
                updatedAt: serverTimestamp()
            });

            // Update user role to partner
            const userRef = doc(db, "user", userId);
            await updateDoc(userRef, {
                role: 'partner',
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error approving partner:", error);
            throw error;
        }
    },

    /**
     * Reject a partner application (Admin only)
     */
    async rejectPartner(userId: string): Promise<void> {
        try {
            // Update application status to rejected
            const applicationRef = doc(db, "partnerApplications", userId);
            await updateDoc(applicationRef, {
                status: 'rejected',
                updatedAt: serverTimestamp()
            });

            // Reset user role back to customer
            const userRef = doc(db, "user", userId);
            await updateDoc(userRef, {
                role: 'customer',
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error rejecting partner:", error);
            throw error;
        }
    },

    /**
     * Get all pending partner applications (Admin only)
     */
    async getPendingApplications(): Promise<PartnerApplication[]> {
        try {
            const applicationsRef = collection(db, "partnerApplications");
            const q = query(applicationsRef, where("status", "==", "pending"));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                ...doc.data()
            } as PartnerApplication));
        } catch (error) {
            console.error("Error getting pending applications:", error);
            throw error;
        }
    },

    /**
     * Get all partner applications (Admin only)
     */
    async getAllApplications(): Promise<PartnerApplication[]> {
        try {
            const applicationsRef = collection(db, "partnerApplications");
            const snapshot = await getDocs(applicationsRef);

            return snapshot.docs.map(doc => ({
                ...doc.data()
            } as PartnerApplication));
        } catch (error) {
            console.error("Error getting all applications:", error);
            throw error;
        }
    },

    /**
     * Get all approved partner applications with user details (Admin only)
     */
    async getApprovedPartnersWithDetails(): Promise<Array<UserProfile & Partial<PartnerApplication>>> {
        try {
            // Get all users with role='partner'
            const partners = await userService.getUsersByRole('partner');

            // Fetch their applications
            const partnersWithApps = await Promise.all(
                partners.map(async (partner) => {
                    const app = await this.getPartnerStatus(partner.uid);
                    // Merge application data but preserve UserProfile's status field
                    // PartnerApplication has status: 'pending' | 'approved' | 'rejected'
                    // UserProfile has status: 'active' | 'suspended'
                    // We need UserProfile's status to take precedence
                    const { status: appStatus, ...appWithoutStatus } = app || {} as any;
                    return {
                        ...partner,
                        ...appWithoutStatus,
                        // Preserve UserProfile status (active/suspended) - do NOT overwrite with app status
                    } as any;
                })
            );

            return partnersWithApps;
        } catch (error) {
            console.error("Error getting approved partners with details:", error);
            throw error;
        }
    }
};
