import Link from 'next/link'
import { LayoutDashboard, CheckSquare, Wallet, Settings, LogOut } from 'lucide-react'

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-slate-800">Sede Manager</h1>
                    <p className="text-xs text-slate-500 mt-1">StylerNow</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/manager/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-brand-orange rounded-lg transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link href="/manager/approvals" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-brand-orange rounded-lg transition-colors">
                        <CheckSquare size={20} />
                        <span className="font-medium">Aprobaciones</span>
                    </Link>
                    <Link href="/manager/cashbox" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-brand-orange rounded-lg transition-colors">
                        <Wallet size={20} />
                        <span className="font-medium">Caja Chica</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 w-full px-4 py-2 transition-colors">
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-10">
                {children}
            </main>
        </div>
    )
}
