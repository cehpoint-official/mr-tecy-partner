import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Prevent execution on server-side
        if (typeof window === "undefined") return;

        const media = window.matchMedia(query);
        setMatches(media.matches);

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Modern browsers
        media.addEventListener("change", listener);

        // Fallback for older browsers
        return () => {
            media.removeEventListener("change", listener);
        };
    }, [query]);

    return matches;
}
