// Suppress harmless pointer capture errors from drag-and-drop libraries
if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('releasePointerCapture')
        ) {
            // Suppress this specific error as it's harmless
            return;
        }
        originalError.apply(console, args);
    };
}

export { };
