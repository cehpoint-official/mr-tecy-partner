import { useState, useEffect } from "react";
import { bookingService } from "@/services/booking.service";
import { Booking } from "@/types";

interface UseRealtimeBookingsOptions {
    customerId?: string;
    enabled?: boolean;
}

interface UseRealtimeBookingsReturn {
    bookings: Booking[];
    loading: boolean;
    error: Error | null;
}

export function useRealtimeBookings(
    options: UseRealtimeBookingsOptions = {}
): UseRealtimeBookingsReturn {
    const { customerId, enabled = true } = options;
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        // Subscribe to real-time updates
        const unsubscribe = customerId
            ? bookingService.subscribeToCustomerBookings(
                customerId,
                (data) => {
                    setBookings(data);
                    setLoading(false);
                },
                (err) => {
                    setError(err);
                    setLoading(false);
                }
            )
            : bookingService.subscribeToAllBookings(
                (data) => {
                    setBookings(data);
                    setLoading(false);
                },
                (err) => {
                    setError(err);
                    setLoading(false);
                }
            );

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [customerId, enabled]);

    return { bookings, loading, error };
}
