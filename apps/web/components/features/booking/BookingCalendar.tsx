"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

// Mock Dates (Aug -> Ago)
const dates = [
    { day: "Lun", date: "27" },
    { day: "Mar", date: "28" },
    { day: "Mie", date: "29" },
    { day: "Jue", date: "30" },
    { day: "Vie", date: "31" },
    { day: "Sab", date: "1" },
    { day: "Dom", date: "2" },
]

export function BookingCalendar() {
    const [selected, setSelected] = useState("29")

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-lg">Elige una fecha</h3>
                <span className="text-sm text-gray-400">Esta Semana</span>
            </div>

            <div className="flex justify-between items-center bg-white rounded-3xl p-4 shadow-sm">
                {dates.map((item) => {
                    const isActive = item.date === selected
                    return (
                        <div
                            key={item.date}
                            onClick={() => setSelected(item.date)}
                            className="flex flex-col items-center gap-2 cursor-pointer transition-colors"
                        >
                            <span className={cn("text-xs font-medium text-gray-400", isActive && "text-gray-600")}>
                                {item.day}
                            </span>
                            <div className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all",
                                isActive ? "bg-black text-white shadow-lg scale-110" : "text-gray-900 hover:bg-gray-100"
                            )}>
                                {item.date}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
