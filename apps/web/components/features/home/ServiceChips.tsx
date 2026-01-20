"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

const services = ["Corte", "Peinado", "Tinte", "Afeitado", "Facial"]

export function ServiceChips() {
    const [active, setActive] = useState("Corte")

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2">
            <div className="flex gap-3 px-1">
                {services.map((service) => (
                    <button
                        key={service}
                        onClick={() => setActive(service)}
                        className={cn(
                            "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                            active === service
                                ? "bg-black text-white shadow-lg"
                                : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100"
                        )}
                    >
                        {service}
                    </button>
                ))}
            </div>
        </div>
    )
}
