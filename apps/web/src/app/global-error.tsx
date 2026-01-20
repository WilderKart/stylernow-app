'use client'
 
import { useEffect } from 'react'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to reporting service
    console.error(error)
  }, [error])
 
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
            <h2 className="text-2xl font-bold mb-4 text-red-500">Critical System Failure</h2>
            <p className="mb-4 text-gray-400">Something went deeply wrong.</p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
            >
                Try again
            </button>
        </div>
      </body>
    </html>
  )
}
