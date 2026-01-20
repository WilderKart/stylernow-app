import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "dark"
    size?: "default" | "sm" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    // Base styles
                    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-medium ring-offset-white transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    // Variants
                    {
                        "bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20": variant === "default",
                        "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900": variant === "outline",
                        "hover:bg-gray-100 text-gray-900": variant === "ghost",
                        "bg-dark text-white hover:bg-black": variant === "dark",
                    },
                    // Sizes
                    {
                        "h-12 px-6 py-2": size === "default",
                        "h-9 px-4 text-sm": size === "sm",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
