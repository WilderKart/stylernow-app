import { Button } from "@/components/ui/button"
import { BookingCalendar } from "@/components/features/booking/BookingCalendar"
import { TimeSlotGrid } from "@/components/features/booking/TimeSlotGrid"
import { ChevronLeft, MapPin } from "lucide-react"
import Link from "next/link"

export default function BookingPage() {
    return (
        <main className="min-h-screen bg-app-bg relative pb-24">
            {/* Header */}
            <div className="p-6 pb-2 flex items-center justify-between">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-10 w-10 bg-white rounded-full">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold">Reservar</h1>
                <span className="px-3 py-1 bg-black text-white text-xs rounded-full font-medium">Corte</span>
            </div>

            {/* Specialist Profile */}
            <div className="px-6 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-stone-800 border-2 border-white shadow-lg overflow-hidden relative">
                        {/* Placeholder for Img */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black to-transparent" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Wade Warren</h2>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            Stylernow - Madrid
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="px-6">
                <BookingCalendar />
            </div>

            {/* Time Slots */}
            <div className="px-6 mt-8">
                <TimeSlotGrid />
            </div>

            {/* Sticky Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent md:absolute md:rounded-b-[3rem]">
                <Button className="w-full h-14 text-lg font-bold shadow-brand/30 shadow-xl">
                    Confirmar Estilo
                </Button>
            </div>
        </main>
    )
}
