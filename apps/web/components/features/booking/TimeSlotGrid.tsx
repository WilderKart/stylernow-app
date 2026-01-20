"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const morningSlots = ["10:00 AM", "11:00 AM"]
const afternoonSlots = ["3:00 PM", "4:00 PM", "5:00 PM"]

export function TimeSlotGrid() {
    const [selected, setSelected] = useState("11:00 AM")

    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-bold text-gray-400 mb-3 px-1">Huecos Disponibles</h4>
                <div className="grid grid-cols-3 gap-3">
                    {morningSlots.map(time => (
                        <Button
                            key={time}
                            variant={selected === time ? "default" : "outline"}
                            className={cn("rounded-2xl h-12", selected === time ? "bg-brand border-none" : "border-gray-200")}
                            onClick={() => setSelected(time)}
                        >
                            {time}
                        </Button>
                    ))}
                    <div className="text-gray-300 text-xs flex items-center justify-center">
                        Mañana
                    </div>
                </div>
            </div>

            <div>
                <div className="grid grid-cols-3 gap-3">
                    {afternoonSlots.map(time => (
                        <Button
                            key={time}
                            variant={selected === time ? "default" : "outline"}
                            className={cn("rounded-2xl h-12", selected === time ? "bg-brand border-none" : "border-gray-200")}
                            onClick={() => setSelected(time)}
                        >
                            {time}
                        </Button>
                    ))}
                    <div className="text-gray-300 text-xs flex items-center justify-center">
                        Tarde
                    </div>
                </div>
            </div>
        </div>
    )
}
