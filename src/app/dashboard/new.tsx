'use client'

export default function NewDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-500 mb-2">SolarNexus Pro Dashboard</h1>
          <p className="text-slate-400">Panel de control para instaladores solares</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Instalaciones</h3>
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-500">12</p>
            <p className="text-slate-400 text-sm mt-1">Este mes</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ahorro Total</h3>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-500">€24,500</p>
            <p className="text-slate-400 text-sm mt-1">Para clientes</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Potencia</h3>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔋</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-500">85 kW</p>
            <p className="text-slate-400 text-sm mt-1">Instalada</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Actividad Reciente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div>
                <p className="font-semibold">Auditoría Completa</p>
                <p className="text-slate-400 text-sm">Calle Sol 45 - Madrid</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-500 font-semibold">€8,500</p>
                <p className="text-slate-400 text-sm">Hace 2 horas</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div>
                <p className="font-semibold">Nueva Instalación</p>
                <p className="text-slate-400 text-sm">Avenida Luna 12 - Barcelona</p>
              </div>
              <div className="text-right">
                <p className="text-blue-500 font-semibold">6.5 kW</p>
                <p className="text-slate-400 text-sm">Hace 1 día</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
              <div>
                <p className="font-semibold">Mantenimiento</p>
                <p className="text-slate-400 text-sm">Plaza Mayor 8 - Valencia</p>
              </div>
              <div className="text-right">
                <p className="text-orange-500 font-semibold">Completado</p>
                <p className="text-slate-400 text-sm">Hace 3 días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
            Nueva Auditoría
          </button>
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
            Ver Clientes
          </button>
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
            Informes
          </button>
        </div>
      </div>
    </div>
  )
}
