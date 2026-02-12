"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { userService } from "@/services/user.service";
import { UserProfile } from "@/types";

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    logout: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Check if profile exists, if not create it (e.g. first login)
                    let userProfile = await userService.getUserProfile(firebaseUser.uid);

                    if (!userProfile && firebaseUser.email) {
                        // Create default profile for new users
                        await userService.ensureUserProfile(
                            firebaseUser.uid,
                            firebaseUser.email,
                            firebaseUser.displayName || "User"
                        );
                        userProfile = await userService.getUserProfile(firebaseUser.uid);
                    }

                    setProfile(userProfile);
                    setUser(firebaseUser);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Still set user but maybe null profile
                    setUser(firebaseUser);
                    setProfile(null);
                }
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await auth.signOut();
            setUser(null);
            setProfile(null);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    const refreshProfile = async () => {
        if (!user) return;
        try {
            const userProfile = await userService.getUserProfile(user.uid);
            setProfile(userProfile);
        } catch (error) {
            console.error("Error refreshing profile:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
