'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  MoreVertical,
  Eye,
  ArrowRight,
  UserX,
  Zap,
  FileText,
  MessageCircle
} from 'lucide-react'

interface Audit {
  id: string
  client_name: string
  monthly_bill: number
  roof_size: number
  created_at: string
  priority_score: number
  roi_years?: number
  status?: string
  email?: string
  phone?: string
  address?: string
  needs_review?: boolean
  company?: string
  estimated_power_kw?: number
}

interface KPICards {
  pipeline_value: number
  hot_leads: number
  conversion_rate: number
}

interface UserSettings {
  id: string
  user_id: string
  company_name: string
  whatsapp: string
  logo_url: string
  price_per_kw: number
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const router = useRouter()
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    fetchDashboardData()
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (settings && !error) {
        setUserSettings(settings)
      }
    } catch (err) {
      // Silently fail for settings
    }
  }

  // Calculate ROI for each audit (CTO SaaS Standard)
  const calculateROI = (monthly_bill: number, roof_size: number) => {
    const pricePerKw = userSettings?.price_per_kw || 1100
    const potencia_kW = roof_size * 0.15 // 150W por m2 (paneles estándar)
    const produccion_anual = potencia_kW * 1500 // horas sol media España
    const ahorro_real = produccion_anual * 0.25 // €0.25/kWh precio medio
    const coste_instalacion = potencia_kW * pricePerKw
    
    // Validación de datos
    const ahorro_esperado = monthly_bill * 12 * 0.75
    const diferencia = Math.abs(ahorro_real - ahorro_esperado) / ahorro_esperado
    
    if (diferencia > 0.3) {
      // Datos inconsistentes (>30% diferencia)
      return { roi: coste_instalacion / ahorro_esperado, warning: true }
    }
    
    return { roi: coste_instalacion / ahorro_real, warning: false }
  }

  // Calculate estimated power from roof size (simplified: 1m² = 0.15kW)
  const calculatePower = (roof_size: number) => {
    return roof_size * 0.15
  }

  // Calculate lead value (estimated revenue for installer)
  const calculateLeadValue = (roof_size: number) => {
    const power_kw = calculatePower(roof_size)
    return power_kw * 1200 // €1200 per kW installed
  }

  // Get ROI badge and color
  const getROIBadge = (monthly_bill: number, roof_size: number) => {
    const roiResult = calculateROI(monthly_bill, roof_size)
    const roi = roiResult.roi
    if (roi > 12) {
      return { text: 'Revisar', color: 'bg-orange-500 text-white' }
    } else if (roi < 6) {
      return { text: 'OPORTUNIDAD', color: 'bg-green-500 text-white' }
    }
    return null
  }

  // Calculate 25-year total savings (emotional big numbers)
  const calculate25YearSavings = (monthly_bill: number) => {
    const annual_savings = monthly_bill * 12 * 0.8
    return annual_savings * 25
  }

  // Calculate priority score based on ROI
  const calculatePriorityScore = (audit: Audit) => {
    const monthlyBill = safeNumber(audit.monthly_bill)
    const roofSize = safeNumber(audit.roof_size)
    const roiResult = calculateROI(monthlyBill, roofSize)
    const roi = roiResult.roi
    const monthly_bill_score = monthlyBill > 100 ? 30 : 10
    const roof_size_score = roofSize > 50 ? 20 : 10
    return Math.min(100, monthly_bill_score + roof_size_score + (roi < 10 ? 40 : 0))
  }

  // Clean data display functions (Hormozi Gold Standard)
  const getDisplayName = (client_name: string, company?: string) => {
    if (company && company.trim() !== '') {
      return company
    }
    return client_name && client_name.trim() !== '' ? client_name : 'Residencial'
  }

  const getContactDisplay = (client_name: string, email?: string, phone?: string) => {
    if (email || phone) {
      return email || phone
    }
    // If no contact info, show client name with user icon
    return client_name || 'Particular'
  }

  // Safe price formatting helper function
  const formatPrice = (amount: any): string => {
    const num = Number(amount) || 0
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(num)
  }

  // Safe number conversion helper
  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value)
    return isNaN(num) || !isFinite(num) ? defaultValue : num
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all audits from Supabase
      const { data: auditsData, error: auditsError } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false })

      if (auditsError) {
        throw auditsError
      }

      // Process audits with ROI calculations
      const processedAudits = auditsData?.map((audit: any) => {
        const monthlyBill = safeNumber(audit.monthly_bill)
        const roofSize = safeNumber(audit.roof_size)
        return {
          ...audit,
          monthly_bill: monthlyBill,
          roof_size: roofSize,
          roi_years: calculateROI(monthlyBill, roofSize),
          roi_badge: getROIBadge(monthlyBill, roofSize),
          lead_value: calculateLeadValue(roofSize),
          value_25_years: calculate25YearSavings(monthlyBill)
        }
      }) || []

      // Sort audits by priority score (ROI-based)
      const sortedAudits = processedAudits.map((audit: any) => ({
        ...audit,
        priority_score: calculatePriorityScore(audit)
      })).sort((a: any, b: any) => b.priority_score - a.priority_score) || []

      setAudits(sortedAudits)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
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

  // Calculate KPIs and processing variables before JSX
  const auditsWithROI = audits.map((audit: any) => {
    const monthlyBill = safeNumber(audit.monthly_bill)
    const roofSize = safeNumber(audit.roof_size)
    const roiResult = calculateROI(monthlyBill, roofSize)
    const pricePerKw = userSettings?.price_per_kw || 1100
    const potencia_kW = roofSize * 0.15
    const coste_instalacion = potencia_kW * pricePerKw
    const comision_estimada = coste_instalacion * 0.10 // 10% comisión para el instalador
    
    return {
      ...audit,
      monthly_bill: monthlyBill,
      roof_size: roofSize,
      roi_years: safeNumber(audit.roi_years, roiResult.roi),
      roi_warning: roiResult.warning,
      roi_badge: audit.roi_badge || getROIBadge(monthlyBill, roofSize),
      lead_value: safeNumber(audit.lead_value, calculateLeadValue(roofSize)),
      comision_estimada: safeNumber(audit.comision_estimada, comision_estimada),
      value_25_years: safeNumber(audit.value_25_years, calculate25YearSavings(monthlyBill))
    }
  })

  // Calculate KPIs dynamically from real data (Hormozi Gold Standard)
  const pricePerKw = userSettings?.price_per_kw || 1100
  const pipelineValue = auditsWithROI.reduce((sum: number, audit: any) => {
    return sum + (safeNumber(audit.roof_size) * 0.15 * pricePerKw) // Real installation cost
  }, 0)

  const hotAudits = auditsWithROI.filter((audit: any) => safeNumber(audit.roi_years) < 6).length // ROI < 6 years = hot lead
  const positiveROILeads = auditsWithROI.filter((audit: any) => safeNumber(audit.roi_years) < 12).length // ROI < 12 years = positive
  const conversionRate = auditsWithROI.length > 0 ? (positiveROILeads / auditsWithROI.length) * 100 : 0

  // Define kpis object with safety and default values
  const kpis = {
    pipeline_value: safeNumber(pipelineValue, 0),
    hot_leads: safeNumber(hotAudits, 0),
    conversion_rate: safeNumber(conversionRate, 0)
  }

  // Handle opening audit details
  const handleOpenAudit = (auditId: string) => {
    router.push(`/auditoria/${auditId}`)
  }

  // Calculate potential percentage (leads with ROI < 10 years)
  const goodROILeads = auditsWithROI.filter((audit: any) => safeNumber(audit.roi_years) < 10).length
  const potentialPercentage = auditsWithROI.length > 0 ? (goodROILeads / auditsWithROI.length) * 100 : 0

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
                <h1 className="text-4xl font-bold text-white mb-2">
                  {userSettings?.company_name || 'SolarNexus Pro'}
                </h1>
                <p className="text-slate-400">Panel de Control de Instaladores Solares</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.push('/audit-form')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Nuevo Análisis Solar
                </button>
                <button 
                  onClick={() => router.push('/settings')}
                  className="inline-flex items-center px-4 py-2 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 rounded-lg transition-colors duration-200"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Configuración
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
                {formatPrice(kpis.pipeline_value)}
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
                {hotAudits}
              </div>
              <div className="text-slate-400 text-sm">Oportunidades Directas (ROI &lt; 6 años)</div>
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
                {safeNumber(conversionRate).toFixed(1)}%
              </div>
              <div className="text-slate-400 text-sm">Tasa de Conversión ROI Positivo</div>
            </div>
          </div>

          {/* Progress Bar - Emerald Gradient based on positive ROI */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-emerald-400" />
                Potencial de Conversión
              </h3>
              <span className="text-emerald-400 font-bold">{safeNumber(potentialPercentage).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 h-4 rounded-full transition-all duration-700 ease-out shadow-lg shadow-emerald-500/25"
                style={{ width: `${Math.min(potentialPercentage, 100)}%` }}
              >
                <div className="h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-xs text-slate-500">0%</span>
              <span className="text-xs text-slate-500">25%</span>
              <span className="text-xs text-slate-500">50%</span>
              <span className="text-xs text-slate-500">75%</span>
              <span className="text-xs text-slate-500">100%</span>
            </div>
            <div className="mt-3 text-sm text-slate-400">
              {goodROILeads} de {auditsWithROI.length} leads con ROI excelente (&lt;10 años)
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
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Comisión Estimada</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">ROI</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Estado</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Prioridad</th>
                    <th className="text-left p-4 text-slate-400 font-medium text-sm">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-emerald-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            Bienvenido a SolarNexus Pro
                          </h3>
                          <p className="text-slate-400 mb-6">
                            Crea tu primera auditoría para ver el potencial de ingresos y empezar a generar leads solares de alta conversión.
                          </p>
                          <button
                            onClick={() => router.push('/audit-form')}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105 mx-auto"
                          >
                            <Target className="w-5 h-5 mr-2" />
                            Crear Primera Auditoría
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    audits.map((audit) => {
                      const priority = getPriorityBadge(audit.priority_score)
                      return (
                      <tr key={audit.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-slate-400 mr-2" />
                            <div>
                              <div className="text-white font-medium">{getDisplayName(audit.client_name, audit.company)}</div>
                              <div className="text-slate-500 text-sm">{audit.address || 'Sin dirección'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            {audit.email || audit.phone ? (
                              <div>
                                <div className="text-white text-sm">{audit.email || audit.phone}</div>
                                <div className="text-slate-500 text-sm">{audit.phone && audit.email ? audit.phone : ''}</div>
                              </div>
                            ) : (
                              <div className="flex items-center text-slate-400">
                                <UserX className="w-4 h-4 mr-2" />
                                <span className="text-sm">{audit.client_name || 'Sin contacto'}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-yellow-400 font-bold text-lg">
                            {formatPrice(safeNumber(audit.comision_estimada) || safeNumber(audit.lead_value))}
                          </div>
                          <div className="text-slate-500 text-xs">Comisión (10%)</div>
                          {safeNumber(audit.roi_years) < 5 && (
                            <div className="flex items-center mt-1 text-orange-400">
                              <span className="text-sm mr-1">🔥</span>
                              <span className="text-xs font-medium">Cierre Inmediato</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 text-slate-400 mr-1" />
                              <span className="text-white">{safeNumber(audit.roi_years).toFixed(1)} años</span>
                            </div>
                            {audit.roi_badge && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${audit.roi_badge.color}`}>
                                {audit.roi_badge.text}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(audit.status || 'new')}`}>
                            {getStatusText(audit.status || 'new')}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priority.color}`}>
                            {priority.text}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleOpenAudit(audit.id)}
                            className="inline-flex items-center px-3 py-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg font-medium text-sm transition-all duration-200"
                          >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Abrir Auditoría
                          </button>
                        </td>
                      </tr>
                    )
                  })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Herramientas de Cierre - Bonus Module */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Herramientas de Cierre
              </h3>
              <span className="text-yellow-400 text-sm font-medium">Aumenta tu valor percibido</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-105">
                <FileText className="w-5 h-5 mr-2" />
                Generar PDF de Venta
              </button>
              <button className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all duration-200 transform hover:scale-105">
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar por WhatsApp
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-400 text-center">
              El software hace el trabajo duro por ti - Cierra más ventas en menos tiempo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
