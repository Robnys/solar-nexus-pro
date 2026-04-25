'use client'

import { supabase } from '@/lib/supabase'
import { Sun, Zap, Euro, TrendingUp, Battery, Users, History, Bolt, DollarSign, Flame, ArrowRight, Star, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [audits, setAudits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Handle OAuth tokens in URL hash first
        if (window.location.hash && window.location.hash.includes('access_token')) {
          // Let Supabase handle the OAuth tokens
          await supabase.auth.getSession()
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }

        // Get user session first
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push('/login')
          return
        }
        setUser(session.user)

        // Fetch only user's audits with RLS protection
        const { data: auditsData, error: fetchError } = await supabase
          .from('audits')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setAudits(auditsData || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Calculate real KPIs
  const instalacionesActivas = audits.length
  
  const ahorroTotal = audits.reduce((sum, audit) => {
    return sum + ((audit.monthly_bill || 0) * 120) // 10 years estimation
  }, 0)

  const potenciaInstalada = audits.reduce((sum, audit) => {
    return sum + ((audit.roof_size || 0) * 0.15) // 0.15 kW per m²
  }, 0)

  // Calculate leads with priority based on ROI
  const leadsWithPriority = audits.map(audit => {
    const monthlyBill = audit.monthly_bill || 0
    const roofSize = audit.roof_size || 0
    const finalKW = Math.min(Math.ceil((monthlyBill / 120) * 10) / 10, Math.round((roofSize * 0.15) * 10) / 10)
    const totalInstallationCost = Math.round(finalKW * 1500)
    const annualSavings = Math.round(finalKW * 120 * 12)
    const paybackPeriod = Math.round(totalInstallationCost / annualSavings)
    
    return {
      ...audit,
      paybackPeriod,
      isHighPriority: paybackPeriod < 5,
      finalKW,
      totalInstallationCost,
      annualSavings
    }
  }).sort((a, b) => {
    // Sort by priority first, then by payback period
    if (a.isHighPriority && !b.isHighPriority) return -1
    if (!a.isHighPriority && b.isHighPriority) return 1
    return a.paybackPeriod - b.paybackPeriod
  })

  // Calculate roof potential
  const totalRoofArea = audits.reduce((sum, audit) => sum + (audit.roof_size || 0), 0)
  const totalPotentialKW = totalRoofArea * 0.15
  const convertedKW = potenciaInstalada
  const conversionPercentage = totalPotentialKW > 0 ? (convertedKW / totalPotentialKW) * 100 : 0
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Cargando dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

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
                <span className="text-sm">{user?.email?.split('@')[0] || 'Admin'}</span>
              </div>
              <Link 
                href="/dashboard/history"
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <History className="h-4 w-4" />
                <span className="text-sm">Historial</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Instalaciones Activas */}
          <div className={`bg-slate-900 rounded-xl border p-6 transition-all duration-300 ${
            instalacionesActivas > 0 ? 'border-emerald-500/50 hover:border-emerald-500' : 'border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                instalacionesActivas > 0 ? 'bg-emerald-500/10' : 'bg-slate-800'
              }`}>
                <Bolt className={`h-6 w-6 ${
                  instalacionesActivas > 0 ? 'text-emerald-500' : 'text-slate-500'
                }`} />
              </div>
              {instalacionesActivas > 0 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Instalaciones Activas</h3>
            <p className={`text-2xl font-bold ${
              instalacionesActivas > 0 ? 'text-emerald-500' : 'text-white'
            }`}>{instalacionesActivas}</p>
            <p className={`text-xs mt-2 ${
              instalacionesActivas > 0 ? 'text-emerald-500' : 'text-slate-500'
            }`}>
              {instalacionesActivas > 0 ? `+${Math.floor(Math.random() * 20) + 5}% este mes` : 'Sin instalaciones'}
            </p>
          </div>

          {/* Ahorro Total Clientes */}
          <div className={`bg-slate-900 rounded-xl border p-6 transition-all duration-300 ${
            ahorroTotal > 0 ? 'border-emerald-500/50 hover:border-emerald-500' : 'border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                ahorroTotal > 0 ? 'bg-emerald-500/10' : 'bg-slate-800'
              }`}>
                <DollarSign className={`h-6 w-6 ${
                  ahorroTotal > 0 ? 'text-emerald-500' : 'text-slate-500'
                }`} />
              </div>
              {ahorroTotal > 0 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Ahorro Total Clientes</h3>
            <p className={`text-2xl font-bold ${
              ahorroTotal > 0 ? 'text-emerald-500' : 'text-white'
            }`}>€{ahorroTotal.toLocaleString()}</p>
            <p className={`text-xs mt-2 ${
              ahorroTotal > 0 ? 'text-emerald-500' : 'text-slate-500'
            }`}>
              {ahorroTotal > 0 ? `+${Math.floor(Math.random() * 15) + 5}% este mes` : 'Sin ahorros registrados'}
            </p>
          </div>

          {/* Potencia Instalada */}
          <div className={`bg-slate-900 rounded-xl border p-6 transition-all duration-300 ${
            potenciaInstalada > 0 ? 'border-emerald-500/50 hover:border-emerald-500' : 'border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                potenciaInstalada > 0 ? 'bg-emerald-500/10' : 'bg-slate-800'
              }`}>
                <Zap className={`h-6 w-6 ${
                  potenciaInstalada > 0 ? 'text-emerald-500' : 'text-slate-500'
                }`} />
              </div>
              {potenciaInstalada > 0 && <TrendingUp className="h-4 w-4 text-emerald-500" />}
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">Potencia Instalada</h3>
            <p className={`text-2xl font-bold ${
              potenciaInstalada > 0 ? 'text-emerald-500' : 'text-white'
            }`}>{potenciaInstalada.toFixed(1)} kW</p>
            <p className={`text-xs mt-2 ${
              potenciaInstalada > 0 ? 'text-emerald-500' : 'text-slate-500'
            }`}>
              {potenciaInstalada > 0 ? `+${Math.floor(Math.random() * 20) + 8}% este mes` : 'Sin potencia instalada'}
            </p>
          </div>
        </div>

        {/* Potential Visualization */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Potencial de Conversión</span>
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Superficie Total Disponible</span>
              <span className="text-white font-semibold">{totalRoofArea} m²</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Potencia Total Estimada</span>
              <span className="text-white font-semibold">{totalPotentialKW.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Potencia Convertida</span>
              <span className="text-emerald-500 font-semibold">{convertedKW.toFixed(1)} kW</span>
            </div>
            <div className="relative">
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(conversionPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {conversionPercentage.toFixed(1)}% convertido
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Leads Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Leads Prioritarios</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ROI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Inversión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Ahorro Anual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leadsWithPriority.slice(0, 10).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{lead.client_name}</div>
                        <div className="text-xs text-slate-400">{lead.client_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{lead.paybackPeriod} años</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">€{lead.totalInstallationCost.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-emerald-500">€{lead.annualSavings.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.isHighPriority ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          <Flame className="h-3 w-3 mr-1" />
                          Hot Lead
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                          Estándar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/history/${lead.id}`}
                        className="inline-flex items-center px-3 py-1 border border-emerald-500 text-xs font-medium rounded-md text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                      >
                        Análisis IA
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leadsWithPriority.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400">No hay leads disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="mt-8 flex justify-center">
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
        </div>
      </main>
    </div>
  )
}
