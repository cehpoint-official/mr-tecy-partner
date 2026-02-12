"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, User, Menu, X } from "lucide-react";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { Button } from "@/components/ui/button";

export default function PartnerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { profile, loading, logout } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!profile || profile.role !== 'partner')) {
            router.replace('/');
        }
    }, [loading, profile, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    if (!profile || profile.role !== 'partner') {
        return null;
    }

    // Check if partner is suspended
    if (profile.status === 'suspended') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-slate-50 flex items-center justify-center p-4">
                {/* Premium Background Gradient */}
                <div className="absolute top-0 left-0 right-0 h-[35vh] bg-gradient-to-b from-red-100/40 via-rose-50/30 to-transparent pointer-events-none" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-200/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-40 right-1/4 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-red-100 p-8 sm:p-12 text-center">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
                        Account Suspended
                    </h1>

                    {/* Message */}
                    <p className="text-slate-600 text-base sm:text-lg mb-6 leading-relaxed">
                        Your partner account has been temporarily suspended by the administrator.
                        You currently do not have access to the partner dashboard and its features.
                    </p>

                    {/* Info Box */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
                        <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            What does this mean?
                        </h3>
                        <ul className="text-sm text-amber-800 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">•</span>
                                <span>You cannot access your partner dashboard or manage bookings</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">•</span>
                                <span>Customers cannot book your services</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600 font-bold">•</span>
                                <span>This may be due to policy violations or pending review</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <p className="text-sm text-slate-500 mb-4">
                            If you believe this is a mistake or would like to request reactivation, please contact our support team.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/')}
                                className="font-bold"
                            >
                                Go to Homepage
                            </Button>
                            <Button
                                onClick={logout}
                                variant="destructive"
                                className="font-bold"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-xs text-slate-400">
                            For assistance, contact: <a href="mailto:support@mrtecy.com" className="text-green-600 hover:underline font-semibold">support@mrtecy.com</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <PartnerSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header - Mobile Optimized */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden p-0 h-9 w-9 rounded-full hover:bg-green-100"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? (
                                    <X className="h-5 w-5 text-slate-700" />
                                ) : (
                                    <Menu className="h-5 w-5 text-slate-700" />
                                )}
                            </Button>
                            <div>
                                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">Partner Panel</h1>
                                <p className="text-xs text-slate-500 hidden sm:block font-medium">Manage your services and bookings</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* User Profile Display - No Dropdown */}
                            <div className="h-9 w-9 sm:h-auto sm:w-auto rounded-full sm:rounded-xl flex items-center sm:gap-2">
                                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-green-100">
                                    {profile?.photoURL ? (
                                        <img
                                            src={profile.photoURL}
                                            alt={profile.displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-bold">{profile.displayName}</p>
                                    <p className="text-xs text-slate-500">Service Provider</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
