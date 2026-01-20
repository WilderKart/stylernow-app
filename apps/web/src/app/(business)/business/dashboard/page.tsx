export default function BusinessDashboardPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Resumen del Negocio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium">Ingresos Totales</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">$ 0 COP</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium">Sedes Activas</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 text-sm font-medium">Staff Total</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
                </div>
            </div>
        </div>
    )
}
