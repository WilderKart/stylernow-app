import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroCard() {
    return (
        <Card variant="dark" className="relative h-[220px] overflow-hidden flex flex-col justify-end items-start !p-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand/20 rounded-full blur-[60px] translate-x-12 -translate-y-12" />

            <div className="relative z-10 w-full">
                <div className="flex justify-between items-start mb-1">
                    <h2 className="text-3xl font-bold">Pack Premium</h2>
                    <span className="text-brand font-bold text-xl">35€</span>
                </div>

                <p className="text-gray-400 text-sm mb-6">Corte + Barba + Estilo<br />Exclusivo en App</p>

                <Link href="/booking">
                    <Button size="sm" className="w-[100px]">
                        Reservar
                    </Button>
                </Link>
            </div>

            <div className="absolute right-[-20px] top-4 w-40 h-full opacity-50 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-l from-gray-800 to-transparent transform rotate-12" />
            </div>
        </Card>
    )
}
