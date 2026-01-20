"use client";

import { MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

export default function InternalAdminDashboard() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Operator Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">12</p>
                        <p className="text-sm text-slate-400">Open Tickets</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">5</p>
                        <p className="text-sm text-slate-400">Unread Messages</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">142</p>
                        <p className="text-sm text-slate-400">Resolved Today</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">Support Queue (Live)</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                <div>
                                    <p className="text-sm font-medium text-white">Issue #{1000 + i}: Cannot sync calendar</p>
                                    <p className="text-xs text-slate-500">Mustache Club • 12 mins ago</p>
                                </div>
                            </div>
                            <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full transition-colors">
                                Take
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
