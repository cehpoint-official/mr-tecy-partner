"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
    allowedRoles: UserRole[];
    redirectTo?: string;
    children: React.ReactNode;
}

/**
 * Client-side role guard component
 * Protects routes by checking if the user has one of the allowed roles
 * Redirects unauthorized users to the specified path
 */
export function RoleGuard({ allowedRoles, redirectTo = "/", children }: RoleGuardProps) {
    const { profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !profile) {
            // User not logged in
            router.push(redirectTo);
        } else if (!loading && profile && !allowedRoles.includes(profile.role)) {
            // User logged in but doesn't have required role
            router.push(redirectTo);
        }
    }, [profile, loading, router, allowedRoles, redirectTo]);

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    // If no profile or wrong role, show nothing (will redirect via useEffect)
    if (!profile || !allowedRoles.includes(profile.role)) {
        return null;
    }

    // User has the required role, render children
    return <>{children}</>;
}
