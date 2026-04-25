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
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-emerald-400 mb-2">Instalaciones Completadas</h2>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-emerald-400 mb-2">Ahorro Total Generado</h2>
            <p className="text-3xl font-bold">€24,500</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-emerald-400 mb-2">Potencia Instalada</h2>
            <p className="text-3xl font-bold">85 kW</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">Actividad Reciente</h2>
            <ul>
              <li className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <span>Auditoría completada para Cliente A</span>
                <span className="text-slate-500 text-sm">Hace 2 horas</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <span>Nueva instalación en Calle del Sol, 10</span>
                <span className="text-slate-500 text-sm">Ayer</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                <span>Mantenimiento programado para Cliente B</span>
                <span className="text-slate-500 text-sm">Hace 3 días</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">Acciones Rápidas</h2>
            <div className="flex flex-col space-y-4">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                Crear Nueva Auditoría
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                Ver Clientes
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                Generar Informes
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Métricas Clave</h2>
          <p className="text-slate-400">Gráficos de rendimiento y proyecciones futuras (próximamente).</p>
        </div>
      </div>
    </div>
  )
}
