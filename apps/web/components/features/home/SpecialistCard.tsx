import { Card } from "@/components/ui/card"
import { Star, ChevronRight } from "lucide-react"

interface SpecialistCardProps {
    name: string
    rating: number
    imageColor?: string
}

export function SpecialistCard({ name, rating, imageColor = "bg-gray-700" }: SpecialistCardProps) {
    return (
        <div className="relative w-[180px] h-[240px] flex-shrink-0">
            <Card className={`w-full h-full p-0 overflow-hidden border-none ${imageColor} relative group`}>
                {/* Image Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{name}</h3>
                    <div className="flex items-center text-brand text-sm font-semibold">
                        <Star className="w-3.5 h-3.5 fill-brand mr-1" />
                        {rating}
                    </div>
                </div>

                {/* Arrow Action */}
                <button className="absolute bottom-4 right-4 z-30 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </Card>
        </div>
    )
}
