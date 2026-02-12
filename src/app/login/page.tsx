"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { Wrench } from "lucide-react";

export default function PartnerLoginPage() {
    return (
        <LoginForm
            mode="partner"
            redirectPath="/dashboard"
            title="Partner Login"
            description="Access your partner dashboard and manage bookings"
            icon={Wrench}
            primaryColor="green"
            gradientFrom="#A1FBD0"
            gradientVia="#DBFDE8"
        />
    );
}
