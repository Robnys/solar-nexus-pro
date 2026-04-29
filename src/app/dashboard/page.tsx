'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Building,
  Calendar,
  Target,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react'

interface Lead {
  id: string
  company_name: string
  email: string
  phone: string
  address: string
  roof_size: number
  estimated_savings: number
  roi_years: number
  status: 'new' | 'contacted' | 'proposal_sent' | 'closed'
  created_at: string
  priority_score: number
}

interface KPICards {
  pipeline_value: number
  hot_leads: number
  conversion_rate: number
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [kpis, setKpis] = useState<KPICards>({
    pipeline_value: 0,
    hot_leads: 0,
    conversion_rate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch leads from Supabase
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (leadsError) throw leadsError

      // Calculate KPIs
      const pipelineValue = leadsData?.reduce((sum, lead) => sum + (lead.estimated_savings || 0), 0) || 0
      const hotLeads = leadsData?.filter(lead => lead.roi_years && lead.roi_years <= 6).length || 0
      const closedLeads = leadsData?.filter(lead => lead.status === 'closed').length || 0
      const conversionRate = leadsData?.length > 0 ? (closedLeads / leadsData.length) * 100 : 0

      // Sort leads by priority score (ROI-based)
      const sortedLeads = leadsData?.map(lead => ({
        ...lead,
        priority_score: calculatePriorityScore(lead)
      })).sort((a, b) => b.priority_score - a.priority_score) || []

      setLeads(sortedLeads)
      setKpis({
        pipeline_value: pipelineValue,
        hot_leads: hotLeads,
        conversion_rate: conversionRate
      })
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const calculatePriorityScore = (lead: Lead): number => {
    let score = 0
    
    // ROI priority (higher score for better ROI)
    if (lead.roi_years && lead.roi_years <= 3) score += 100
    else if (lead.roi_years && lead.roi_years <= 6) score += 60
    else if (lead.roi_years && lead.roi_years <= 10) score += 30
    
    // Estimated savings priority
    if (lead.estimated_savings >= 50000) score += 50
    else if (lead.estimated_savings >= 30000) score += 30
    else if (lead.estimated_savings >= 15000) score += 15
    
    // Status priority (new leads get higher score)
    if (lead.status === 'new') score += 40
    else if (lead.status === 'contacted') score += 20
    else if (lead.status === 'proposal_sent') score += 10
    
    // Recency priority (more recent = higher score)
    const daysSinceCreation = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceCreation <= 7) score += 30
    else if (daysSinceCreation <= 30) score += 15
    
    return score
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'contacted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'proposal_sent': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'closed': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nuevo'
      case 'contacted': return 'Contactado'
      case 'proposal_sent': return 'Propuesta Enviada'
      case 'closed': return 'Cerrado'
      default: return status
    }
  }

  const getPriorityBadge = (score: number) => {
    if (score >= 150) return { text: 'ALTA', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
    if (score >= 80) return { text: 'MEDIA', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
    return { text: 'BAJA', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl animate-pulse"></div>
                  <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
                </div>
                <div className="w-24 h-8 bg-slate-800 rounded-lg animate-pulse mb-2"></div>
                <div className="w-32 h-4 bg-slate-800 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <div className="w-48 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
            <div className="p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-slate-800 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-lg animate-pulse"></div>
                    <div>
                      <div className="w-32 h-4 bg-slate-800 rounded-lg animate-pulse mb-2"></div>
                      <div className="w-24 h-3 bg-slate-800 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-6 bg-slate-800 rounded-lg animate-pulse"></div>
                    <div className="w-16 h-6 bg-slate-800 rounded-lg animate-pulse"></div>
                    <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">Error al cargar el dashboard</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <Loader2 className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 -z-10"></div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">SolarNexus Pro</h1>
                <p className="text-slate-400">Panel de Control de Instaladores Solares</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Pipeline Value */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center text-emerald-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {formatCurrency(kpis.pipeline_value)}
              </div>
              <div className="text-slate-400 text-sm">Valor del Pipeline</div>
            </div>

            {/* Hot Leads */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {kpis.hot_leads}
              </div>
              <div className="text-slate-400 text-sm">Leads Calientes (ROI ≤ 6 años)</div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center text-purple-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3.2%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {kpis.conversion_rate.toFixed(1)}%
              </div>
              <div className="text-slate-400 text-sm">Tasa de Conversión</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Potencial de Conversión</h3>
              <span className="text-emerald-400 font-medium">{kpis.conversion_rate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(kpis.conversion_rate, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-500">0%</span>
              <span className="text-xs text-slate-500">25%</span>
              <span className="text-xs text-slate-500">50%</span>
              <span className="text-xs text-slate-500">75%</span>
              <span className="text-xs text-slate-500">100%</span>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  Leads Inteligentes
                </h3>
                <span className="text-sm text-slate-400">
                  Ordenados por prioridad de cierre
                </span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Empresa</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Contacto</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Valor</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">ROI</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Estado</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Prioridad</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const priority = getPriorityBadge(lead.priority_score)
                    return (
                      <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-slate-400 mr-2" />
                            <div>
                              <div className="text-white font-medium">{lead.company_name}</div>
                              <div className="text-slate-500 text-sm">{lead.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="text-white text-sm">{lead.email}</div>
                            <div className="text-slate-500 text-sm">{lead.phone}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-emerald-400 font-medium">
                            {formatCurrency(lead.estimated_savings)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-slate-400 mr-1" />
                            <span className="text-white">{lead.roi_years} años</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                            {getStatusText(lead.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priority.color}`}>
                            {priority.text}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors">
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {leads.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No hay leads aún</h3>
                <p className="text-slate-400">Los leads aparecerán aquí cuando los generes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
