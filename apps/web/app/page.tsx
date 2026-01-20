import { Button } from "@/components/ui/button"
import { HeroCard } from "@/components/features/home/HeroCard"
import { ServiceChips } from "@/components/features/home/ServiceChips"
import { SpecialistCard } from "@/components/features/home/SpecialistCard"
import { Bell, Edit2, MapPin } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen pb-20 p-6 flex flex-col gap-8">
      {/* Header */}
      <header className="flex justify-between items-start mt-2">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-1 tracking-tight">
            Hola, Alex!
          </h1>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>Stylernow - Madrid</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full bg-white border border-gray-100 h-12 w-12 text-gray-900">
          <Edit2 className="w-5 h-5" />
        </Button>
      </header>

      {/* Hero Section */}
      <section>
        <HeroCard />
      </section>

      {/* Services Filter */}
      <section className="-mx-2">
        <div className="flex justify-between items-center px-2 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Servicios</h2>
        </div>
        <ServiceChips />
      </section>

      {/* Specialists Carousel */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Especialistas</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
          <SpecialistCard name="Wade Warren" rating={5.0} imageColor="bg-stone-800" />
          <SpecialistCard name="Darrell Steward" rating={5.0} imageColor="bg-neutral-700" />
          <SpecialistCard name="Jane Cooper" rating={4.9} imageColor="bg-slate-800" />
        </div>
      </section>
    </main>
  );
}
