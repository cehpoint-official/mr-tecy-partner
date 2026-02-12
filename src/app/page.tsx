"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to partner login page
        router.replace("/login");
    }, [router]);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-green-900">Mr Tecy Partner</h1>
                <p className="text-green-700 mt-2">Redirecting to login...</p>
            </div>
        </div>
    );
}
