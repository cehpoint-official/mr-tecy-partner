"use client";

import { useState } from "react";
import { LocationMap } from "@/components/LocationMap";
import { LocationDialog } from "@/components/LocationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Loader2, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/useToast";

export function PartnerLocationManager() {
    const { profile, refreshProfile } = useAuth();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Default to existing location or India center
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
        profile?.location ? { lat: profile.location.lat, lng: profile.location.lng } : null
    );

    const [hasChanged, setHasChanged] = useState(false);

    const handleLocationSelect = (newLocation: { lat: number; lng: number }) => {
        setLocation(newLocation);
        setHasChanged(true);
    };

    const handleDialogSave = (newLocation: { lat: number; lng: number }) => {
        setLocation(newLocation);
        setHasChanged(true);
        setIsDialogOpen(false);
    };

    const handleSaveLocation = async () => {
        if (!profile?.uid || !location) return;

        setLoading(true);
        try {
            const userRef = doc(db, "user", profile.uid);

            // Reverse geocode to get address string using internal proxy
            let addressString = "";
            try {
                const response = await fetch(
                    `/api/geocode?lat=${location.lat}&lon=${location.lng}`
                );
                if (response.ok) {
                    const data = await response.json();
                    addressString = data.display_name || "";
                }
            } catch (err) {
                console.warn("Failed to fetch address details:", err);
            }

            await setDoc(userRef, {
                location: {
                    lat: location.lat,
                    lng: location.lng,
                    address: addressString
                }
            }, { merge: true });

            // Refresh profile to update context immediately
            await refreshProfile();

            success("Location Updated", "Your service location has been saved successfully.");
            setHasChanged(false);
        } catch (err) {
            console.error("Error saving location:", err);
            error("Error", "Failed to save location. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-md bg-white/95 backdrop-blur-md">
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            Service Location
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 font-medium">
                            Set your base location for distance-based bookings
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsDialogOpen(true)}
                            className="font-bold border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            Change Location
                        </Button>
                        {hasChanged && (
                            <Button
                                onClick={handleSaveLocation}
                                disabled={loading}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 font-bold"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative group">
                    <LocationMap
                        initialPosition={location || { lat: 20.5937, lng: 78.9629 }}
                        onLocationSelect={handleLocationSelect}
                        height="300px"
                        className="rounded-xl overflow-hidden border border-slate-200 pointer-events-none group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 cursor-pointer" onClick={() => setIsDialogOpen(true)}>
                        <Button variant="secondary" className="shadow-lg font-bold pointer-events-none">
                            Click to Edit
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                    Customers will see how far you are from them. Accurate location helps you get more relevant bookings.
                </p>

                <LocationDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSave={handleDialogSave}
                    initialLocation={location || undefined}
                />
            </CardContent>
        </Card>
    );
}
