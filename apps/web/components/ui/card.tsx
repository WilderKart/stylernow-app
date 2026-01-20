import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "dark" | "glass"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-3xl p-5 transition-all",
                    {
                        "bg-white shadow-sm border border-gray-100": variant === "default",
                        "bg-dark text-white shadow-xl shadow-black/10": variant === "dark",
                        "bg-white/80 backdrop-blur-md border border-white/20 shadow-sm": variant === "glass",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

export { Card }
