import Link from 'next/link'
import { CalendarDays, DollarSign, UserCheck, Menu } from 'lucide-react'

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-900 text-white">
            <main className="flex-1 pb-24 px-4 pt-6">{children}</main>

            {/* Staff Operational Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 px-6 py-4 flex justify-between items-center z-50 safe-area-bottom shadow-lg">
                <Link href="/staff/home" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-brand-gold transition-colors">
                    <CalendarDays size={24} />
                    <span className="text-[10px] font-medium">Agenda</span>
                </Link>
                <Link href="/staff/earnings" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-brand-gold transition-colors">
                    <DollarSign size={24} />
                    <span className="text-[10px] font-medium">Ganancias</span>
                </Link>
                {/* Center Action Button */}
                <div className="relative -top-6">
                    <button className="bg-brand-gold text-black p-4 rounded-full shadow-xl hover:scale-105 transition-transform">
                        <UserCheck size={28} />
                    </button>
                </div>
                <Link href="/staff/profile" className="flex flex-col items-center gap-1 text-zinc-400 hover:text-brand-gold transition-colors">
                    <Menu size={24} />
                    <span className="text-[10px] font-medium">Menú</span>
                </Link>
            </nav>
        </div>
    )
}
