"use client";

import { useAuth } from "@/context/AuthContext";
import { reviewService } from "@/services/review.service";
import { Review } from "@/types";
import { useState, useEffect } from "react";
import { Loader2, Star, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnerReviewsPage() {
    const { profile } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile?.uid) return;

        setLoading(true);

        const unsubscribe = reviewService.subscribeToPartnerReviews(
            profile.uid,
            (data) => {
                setReviews(data);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching partner reviews:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [profile?.uid]);

    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        stars: rating,
        count: reviews.filter(r => r.rating === rating).length,
        percentage: reviews.length > 0
            ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
            : 0
    }));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50 pb-8">
            {/* Premium Background Gradient */}
            <div className="absolute top-0 left-0 right-0 h-[25vh] bg-gradient-to-b from-green-100/40 via-emerald-50/30 to-transparent pointer-events-none" />

            <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-6 pt-4 sm:pt-6">
                {/* Header */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                        Reviews & Ratings
                    </h1>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">See what customers say about your service.</p>
                </div>

                {/* Overall Rating Card */}
                <Card className="border-none shadow-md hover:shadow-xl bg-white/95 backdrop-blur-md transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg font-black text-slate-900">Overall Rating</CardTitle>
                        <CardDescription className="text-[11px] text-slate-500 font-medium">Your average rating across all reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left: Overall Rating */}
                            <div className="flex flex-col items-center justify-center text-center border-r border-slate-200">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 blur-3xl rounded-full" />
                                    <p className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent relative">
                                        {avgRating.toFixed(1)}
                                    </p>
                                </div>
                                <div className="flex items-center mt-3 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 font-bold">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                            </div>

                            {/* Right: Rating Distribution */}
                            <div className="space-y-3 py-4">
                                {ratingDistribution.map(({ stars, count, percentage }) => (
                                    <div key={stars} className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 w-16">
                                            <span className="text-sm font-bold text-slate-600">{stars}</span>
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        </div>
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-500 w-12 text-right font-semibold">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <Card className="border-none shadow-md hover:shadow-xl bg-white/95 backdrop-blur-md transition-all duration-300">
                            <CardContent className="p-12 text-center">
                                <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-slate-900 mb-2">No reviews yet</h3>
                                <p className="text-slate-500 font-medium">
                                    Complete your first booking to start receiving reviews from customers!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        reviews.map((review) => (
                            <Card
                                key={review.id}
                                className="border-none shadow-md hover:shadow-xl bg-white/95 backdrop-blur-md transition-all duration-300 group hover:scale-[1.01]"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="font-black text-slate-900 text-base">{review.customerName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {review.createdAt ? format(review.createdAt.toDate(), "MMMM dd, yyyy") : "Recent"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
                                            <p className="text-sm font-black text-amber-700">{review.rating}.0</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed font-medium">{review.feedback}</p>

                                    {/* Booking ID Reference */}
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-xs text-slate-400 font-medium">
                                            Booking ID: <span className="font-mono">{review.bookingId.slice(-8)}</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
