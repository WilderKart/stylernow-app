"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, TrendingUp, Settings } from "lucide-react";
import clsx from "clsx";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/barberia/dashboard", icon: LayoutDashboard },
        { name: "Equipo", href: "/barberia/team", icon: Users },
        { name: "Finanzas", href: "/barberia/finance", icon: TrendingUp },
        { name: "Ajustes", href: "/barberia/settings", icon: Settings },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>

            {/* Admin Bottom Nav - Dark/Corporate Theme */}
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-6 py-3 flex justify-around items-center z-50 safe-area-bottom">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center gap-1 w-16"
                        >
                            <item.icon
                                size={22}
                                strokeWidth={2}
                                className={clsx("transition-colors", isActive ? "text-brand" : "text-gray-400")}
                            />
                            <span
                                className={clsx(
                                    "text-[10px] font-medium transition-colors",
                                    isActive ? "text-white" : "text-gray-500"
                                )}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
