"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Loader2, LucideIcon } from "lucide-react";
import { Logo } from "@/components/Logo";

interface LoginFormProps {
    mode: "customer" | "partner";
    redirectPath: string;
    title: string;
    description: string;
    icon?: LucideIcon;
    primaryColor?: string;
    gradientFrom?: string;
    gradientVia?: string;
}

export function LoginForm({
    mode,
    redirectPath,
    title,
    description,
    icon: Icon,
    primaryColor = "blue",
    gradientFrom = "#A1F6FB",
    gradientVia = "#DBFDFC",
}: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await authService.login(email, password);

            // For partner login, verify user has partner role
            if (mode === "partner") {
                // Wait for profile to load
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Re-fetch user profile to check role
                const { userService } = await import("@/services/user.service");
                const userProfile = await userService.getUserProfile(user.uid);

                if (!userProfile || userProfile.role !== "partner") {
                    // Not a partner - log out and show error
                    await authService.logout();
                    setError("Access Denied: This account is not registered as a partner. Please use the customer login or apply to become a partner.");
                    setLoading(false);
                    return;
                }
            }

            router.push(redirectPath);
        } catch (err: any) {
            if (err.message === "Email not verified") {
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const user = await authService.loginWithGoogle();

            // For partner login, verify user has partner role
            if (mode === "partner") {
                // Wait for profile to load
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Re-fetch user profile to check role
                const { userService } = await import("@/services/user.service");
                const userProfile = await userService.getUserProfile(user.uid);

                if (!userProfile || userProfile.role !== "partner") {
                    // Not a partner - log out and show error
                    await authService.logout();
                    setError("Access Denied: This account is not registered as a partner. Please use the customer login or apply to become a partner.");
                    setLoading(false);
                    return;
                }
            }

            router.push(redirectPath);
        } catch (err: any) {
            setError("Failed to login with Google");
            setLoading(false);
        }
    };

    const colorClasses = {
        blue: {
            button: "bg-blue-600 hover:bg-blue-700",
            link: "text-blue-600 hover:text-blue-500",
            border: "border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800",
        },
        green: {
            button: "bg-green-600 hover:bg-green-700",
            link: "text-green-600 hover:text-green-500",
            border: "border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800",
        },
    };

    const colors = colorClasses[primaryColor as keyof typeof colorClasses] || colorClasses.blue;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-50">
            {/* Background Gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b to-slate-50 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to bottom, ${gradientFrom}, ${gradientVia}, rgb(248 250 252))`
                }}
            />

            <div className="w-full max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center justify-center p-2">
                        <Logo className="scale-150 origin-center" />
                    </div>
                </div>

                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center pb-2">
                        {Icon && (
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className={`p-2 ${primaryColor === 'green' ? 'bg-green-100' : 'bg-blue-100'} rounded-full`}>
                                    <Icon className={`w-5 h-5 ${primaryColor === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
                                </div>
                            </div>
                        )}
                        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">{title}</CardTitle>
                        <CardDescription className="text-slate-500">
                            {description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm font-medium animate-in fade-in-50">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={mode === "partner" ? "partner@example.com" : "name@example.com"}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                                        className={`text-xs font-semibold ${colors.link} transition-colors`}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>
                            <Button
                                type="submit"
                                className={`w-full ${colors.button} text-white font-semibold py-5 rounded-xl shadow-md transition-all hover:shadow-lg active:scale-[0.98]`}
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === "partner" ? "Sign In as Partner" : "Sign In"}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            type="button"
                            className="w-full py-5 rounded-xl font-medium border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-[0.98]"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 4.6c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
                            Google
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center gap-3 pb-6">
                        {mode === "customer" ? (
                            <>
                                <p className="text-sm text-slate-500">
                                    Don't have an account?{" "}
                                    <Link href="/register" className={`font-semibold ${colors.link} hover:underline transition-all`}>
                                        Sign up
                                    </Link>
                                </p>
                                <div className="relative w-full">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500 font-medium">For Service Providers</span>
                                    </div>
                                </div>
                                <Link href="/login" className="w-full">
                                    <Button
                                        variant="outline"
                                        className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 font-semibold py-5 rounded-xl transition-all active:scale-[0.98]"
                                    >
                                        Login as Partner
                                    </Button>
                                </Link>
                            </>
                        ) : null}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
