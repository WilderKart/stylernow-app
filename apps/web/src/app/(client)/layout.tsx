import Link from 'next/link'
import { Home, Search, Calendar, User } from 'lucide-react'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <main className="flex-1 pb-20">{children}</main>

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
                <Link href="/client/home" className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-orange transition-colors">
                    <Home size={24} />
                    <span className="text-[10px] font-medium">Inicio</span>
                </Link>
                <Link href="/client/search" className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-orange transition-colors">
                    <Search size={24} />
                    <span className="text-[10px] font-medium">Explorar</span>
                </Link>
                <Link href="/client/appointments" className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-orange transition-colors">
                    <Calendar size={24} />
                    <span className="text-[10px] font-medium">Citas</span>
                </Link>
                <Link href="/client/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-brand-orange transition-colors">
                    <User size={24} />
                    <span className="text-[10px] font-medium">Perfil</span>
                </Link>
            </nav>
        </div>
    )
}
