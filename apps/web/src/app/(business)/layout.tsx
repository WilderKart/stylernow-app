import Link from 'next/link'
import { Store, TrendingUp, CreditCard, Users, Settings } from 'lucide-react'

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold font-heading text-brand-gold">BUSINESS</h1>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Owner Portal</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/business/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <TrendingUp size={20} />
                        <span className="font-medium">Métricas</span>
                    </Link>
                    <Link href="/business/sedes" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Store size={20} />
                        <span className="font-medium">Sedes</span>
                    </Link>
                    <Link href="/business/billing" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <CreditCard size={20} />
                        <span className="font-medium">Facturación</span>
                    </Link>
                    <Link href="/business/team" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Users size={20} />
                        <span className="font-medium">Equipo Global</span>
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 md:ml-64 p-6">
                {children}
            </main>
        </div>
    )
}
