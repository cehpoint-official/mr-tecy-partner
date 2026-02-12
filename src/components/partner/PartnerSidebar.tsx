"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Star,
    LogOut,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

interface PartnerSidebarProps {
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function PartnerSidebar({ className, isOpen, onClose }: PartnerSidebarProps) {
    const pathname = usePathname();
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuth();

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/bookings", label: "My Bookings", icon: Calendar },
        { href: "/dashboard/reviews", label: "Reviews", icon: Star },
    ];

    // Mobile Sidebar
    if (!isDesktop) {
        return (
            <>
                {/* Backdrop */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}

                {/* Mobile Drawer */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
                        isOpen ? "translate-x-0" : "-translate-x-full",
                        className
                    )}
                >
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Logo showText={false} />
                                    <div>
                                        <span className="font-bold text-lg text-[#1e40af] tracking-tight leading-none block">mrtecy</span>
                                        <p className="text-xs text-slate-500 font-medium">Partner Panel</p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                            {menuItems.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-slate-100 text-slate-900 font-bold"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <link.icon className="h-5 w-5 flex-shrink-0" />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout Button */}
                        <div className="p-3 border-t">
                            <Button
                                onClick={logout}
                                variant="ghost"
                                className="w-full flex items-center justify-start gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                            >
                                <LogOut className="h-5 w-5 flex-shrink-0" />
                                <span>Logout</span>
                            </Button>
                        </div>

                    </div>
                </aside>
            </>
        );
    }

    // Desktop Sidebar
    return (
        <aside
            className={cn(
                "hidden lg:flex bg-white border-r h-screen flex-col transition-all duration-300 sticky top-0",
                collapsed ? "w-16" : "w-64",
                className
            )}
        >
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <Logo showText={false} />
                            <div>
                                <span className="font-bold text-lg text-[#1e40af] tracking-tight leading-none block">mrtecy</span>
                                <p className="text-xs text-slate-500 font-medium">Partner Panel</p>
                            </div>
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-8 w-8 p-0"
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {menuItems.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-slate-100 text-slate-900 font-bold"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                            title={collapsed ? link.label : undefined}
                        >
                            <link.icon className="h-5 w-5 flex-shrink-0" />
                            {!collapsed && <span>{link.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-t">
                <Button
                    onClick={logout}
                    variant="ghost"
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200",
                        collapsed ? "justify-center" : "justify-start"
                    )}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </Button>
            </div>

        </aside>
    );
}
