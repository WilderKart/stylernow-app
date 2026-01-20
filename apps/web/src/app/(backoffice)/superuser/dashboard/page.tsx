"use client";

import { useEffect, useState } from "react";
import { getSuperUserKPIs, SuperUserKPIs } from "@/lib/mock-api";
import { TrendingUp, Users, Store, Activity } from "lucide-react";

export default function SuperUserDashboard() {
    const [data, setData] = useState<SuperUserKPIs | null>(null);

    useEffect(() => {
        getSuperUserKPIs().then(setData);
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Global Ecosystem Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><TrendingUp size={24} /></div>
                        <span className="text-xs font-mono text-emerald-400">+15% vs LM</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-white">${data?.monthly_revenue_global ? (data.monthly_revenue_global / 1000000).toFixed(1) : '...'}M</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Store size={24} /></div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Active Barberías</p>
                    <p className="text-2xl font-bold text-white">{data?.active_barberias ?? '...'}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg"><Users size={24} /></div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-white">{data?.total_users ? (data.total_users / 1000).toFixed(1) : '...'}k</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-orange-500/10 text-orange-500 rounded-lg"><Activity size={24} /></div>
                        <span className="text-xs font-mono text-red-400">Churn {data?.churn_rate}%</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Conv. Rate</p>
                    <p className="text-2xl font-bold text-white">{data?.conversion_rate ?? '...'}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Top Performing Barberías</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800" />
                                    <div>
                                        <p className="text-sm font-medium text-white">Mustache Club {i}</p>
                                        <p className="text-xs text-slate-500">Bogotá, CO</p>
                                    </div>
                                </div>
                                <span className="text-sm font-mono text-emerald-400">$12.5M</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
