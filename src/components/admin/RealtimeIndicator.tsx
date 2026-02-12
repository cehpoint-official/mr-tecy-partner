"use client";

import { useEffect, useState } from "react";

interface RealtimeIndicatorProps {
    lastUpdated?: Date;
}

export function RealtimeIndicator({ lastUpdated }: RealtimeIndicatorProps) {
    const [timeAgo, setTimeAgo] = useState<string>("just now");

    useEffect(() => {
        if (!lastUpdated) return;

        const updateTimeAgo = () => {
            const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);

            if (seconds < 5) {
                setTimeAgo("just now");
            } else if (seconds < 60) {
                setTimeAgo(`${seconds}s ago`);
            } else if (seconds < 3600) {
                setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
            } else {
                setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
            }
        };

        updateTimeAgo();
        const interval = setInterval(updateTimeAgo, 1000);

        return () => clearInterval(interval);
    }, [lastUpdated]);

    return (
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
            </div>
            <span className="font-medium">Live</span>
            {lastUpdated && (
                <>
                    <span>•</span>
                    <span>Updated {timeAgo}</span>
                </>
            )}
        </div>
    );
}
