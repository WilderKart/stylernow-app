'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center w-full h-[60vh] text-center p-6">
            <h2 className="text-xl font-semibold mb-2 text-foreground">Something went wrong!</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
                We encountered an unexpected error processing your request.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 border border-border rounded text-sm hover:bg-muted transition-colors"
                >
                    Reload Page
                </button>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm hover:opacity-90 transition-opacity"
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
