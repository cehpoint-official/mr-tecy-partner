import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Booking } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Clock, CreditCard, User } from "lucide-react";

import { Timestamp } from "firebase/firestore";

interface BookingDetailsModalProps {
    booking: Booking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "N/A";
    return format(timestamp.toDate(), "MMM dd, yyyy");
};

const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return "N/A";
    return format(timestamp.toDate(), "hh:mm a");
};

const formatAddress = (location: any) => {
    if (!location) return "N/A";
    if (typeof location === 'string') return location;

    // Format with coordinates and city/area
    const city = location.city || location.street || '';
    const coords = location.geoPoint ?
        `${location.geoPoint.latitude.toFixed(4)}, ${location.geoPoint.longitude.toFixed(4)}` : '';

    if (coords && city) {
        return `${coords} - ${city}`;
    }

    // Fallback to original format
    return `${location.street || ''}, ${location.city || ''} ${location.zipCode || ''}`.trim();
};

export function BookingDetailsModal({
    booking,
    open,
    onOpenChange,
}: BookingDetailsModalProps) {
    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center justify-between">
                        <span>Booking Details</span>
                        <Badge variant="outline" className="ml-2">
                            {booking.id.slice(-8)}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        View detailed information about this booking
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status & Timing */}
                    <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-slate-50 rounded-lg border">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
                            <Badge className={`
                                ${booking.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                        booking.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' :
                                            booking.status === 'accepted' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                                'bg-amber-100 text-amber-700 hover:bg-amber-200'}
                                border-none px-3 py-1 text-sm font-bold
                            `}>
                                {booking.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date & Time</p>
                            <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(booking.scheduledTime)}</span>
                                <Clock className="w-4 h-4 ml-2" />
                                <span>{formatTime(booking.scheduledTime)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            Service Information
                        </h3>
                        <Card>
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Service Name</p>
                                    <p className="font-semibold text-lg text-slate-900">{booking.serviceName}</p>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Type</p>
                                        <Badge variant="secondary" className="uppercase">{booking.type}</Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500 mb-1">Price</p>
                                        <p className="font-bold text-lg text-slate-900">₹{booking.servicePrice}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customer Details */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Details
                        </h3>
                        <Card>
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Customer Name</p>
                                    <p className="font-semibold text-base text-slate-900">{booking.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Location</p>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <p className="font-medium text-slate-900">{formatAddress(booking.location)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Payment Information
                        </h3>
                        <Card>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Method</p>
                                    <p className="font-semibold uppercase text-slate-700">{booking.paymentMethod}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500 mb-1">Status</p>
                                    <Badge className={`
                                        ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                                        border-none
                                    `}>
                                        {booking.paymentStatus.toUpperCase()}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
