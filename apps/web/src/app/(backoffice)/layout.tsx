import Link from 'next/link'
import { ShieldAlert, Users, Database, Activity } from 'lucide-react'

export default function BackofficeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 fixed h-full z-20">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-red-600">
                        <ShieldAlert size={24} />
                        <h1 className="text-xl font-bold">BACKOFFICE</h1>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 pl-8">Internal Use Only</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Master</div>
                    <Link href="/backoffice/master" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                        <Activity size={18} />
                        <span className="text-sm font-medium">Global Stats</span>
                    </Link>
                    <Link href="/backoffice/admins" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                        <Users size={18} />
                        <span className="text-sm font-medium">Admins</span>
                    </Link>

                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Operations</div>
                    <Link href="/backoffice/ops" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors">
                        <Database size={18} />
                        <span className="text-sm font-medium">Data Management</span>
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
