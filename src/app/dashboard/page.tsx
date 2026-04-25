import { Sun, Zap, Euro, TrendingUp, Battery, Users, History } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <Sun className="h-6 w-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SolarNexus Pro</h1>
                <p className="text-xs text-slate-400">Panel de Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-slate-300">
                <Users className="h-4 w-4" />
                <span className="text-sm">Admin</span>
              </div>
              <Link 
                href="/dashboard/history"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <History className="h-4 w-4" />
                <span className="text-sm">Historial</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Instalaciones Activas */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Zap className="h-6 w-6 text-emerald-500" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Instalaciones Activas</h3>
            <p className="text-2xl font-bold text-white">247</p>
            <p className="text-xs text-emerald-500 mt-2">+12% este mes</p>
          </div>

          {/* Ahorro Total Clientes */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Euro className="h-6 w-6 text-emerald-500" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Ahorro Total Clientes (€)</h3>
            <p className="text-2xl font-bold text-white">€1,247,892</p>
            <p className="text-xs text-emerald-500 mt-2">+8.3% este mes</p>
          </div>

          {/* Potencia Instalada */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Battery className="h-6 w-6 text-emerald-500" />
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Potencia Instalada (kW)</h3>
            <p className="text-2xl font-bold text-white">3,847 kW</p>
            <p className="text-xs text-emerald-500 mt-2">+15% este mes</p>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Potencia tu Negocio Solar
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Utiliza nuestra IA avanzada para realizar auditorías solares precisas y 
              optimizar cada instalación al máximo rendimiento.
            </p>
          </div>
          
          <Link 
            href="/dashboard/audit"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            <div className="relative flex items-center space-x-3">
              <Sun className="h-5 w-5" />
              <span>Nueva Auditoría Solar con IA</span>
              <Zap className="h-4 w-4" />
            </div>
          </Link>
          
          <p className="text-xs text-slate-500 mt-4">
            Análisis inteligente en menos de 2 minutos
          </p>
        </div>
      </main>
    </div>
  )
}
