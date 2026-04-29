'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, 
  Calculator, 
  Leaf, 
  TrendingUp, 
  MessageCircle,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface Audit {
  id: string
  client_name: string
  company?: string
  monthly_bill: number
  roof_size: number
  email?: string
  phone?: string
  address?: string
  created_at: string
}

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [audit, setAudit] = useState<Audit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real engineering calculations
  const calculateROI = (monthly_bill: number, roof_size: number) => {
    const potencia_kW = roof_size * 0.15
    const produccion_anual = potencia_kW * 1500
    const ahorro_real = produccion_anual * 0.25
    const coste_instalacion = potencia_kW * 1100
    
    const ahorro_esperado = monthly_bill * 12 * 0.75
    const roi_anios = coste_instalacion / ahorro_esperado
    
    return {
      potencia_kW,
      produccion_anual,
      ahorro_real,
      coste_instalacion,
      ahorro_esperado,
      roi_anios,
      roi_meses: roi_anios * 12
    }
  }

  const calculateCO2Reduction = (roof_size: number) => {
    const potencia_kW = roof_size * 0.15
    const produccion_anual = potencia_kW * 1500
    // 0.5 kg CO2 por kWh evitado de la red eléctrica española
    return produccion_anual * 0.5
  }

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: auditData, error: fetchError } = await supabase
          .from('audits')
          .select('*')
          .eq('id', params.id)
          .single()

        if (fetchError) {
          console.error('Error fetching audit:', fetchError)
          setError('Auditoría no encontrada')
          return
        }

        if (!auditData) {
          setError('Auditoría no encontrada')
          return
        }

        setAudit(auditData)
      } catch (err: any) {
        console.error('Error:', err)
        setError('Error al cargar la auditoría')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAudit()
    }
  }, [params.id])

  const handleWhatsAppClick = () => {
    if (!audit) return

    const calculations = calculateROI(audit.monthly_bill, audit.roof_size)
    const co2_reduction = calculateCO2Reduction(audit.roof_size)
    
    const message = `Hola ${audit.client_name}, soy SolarNexus Pro. He analizado tu tejado de ${audit.roof_size}m2 y tengo buenas noticias: puedes ahorrar ${calculations.ahorro_esperado.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€ al año en luz. La instalación se paga sola en ${calculations.roi_anios.toFixed(1)} años. ¿Te envío el estudio completo?`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando auditoría...</p>
        </div>
      </div>
    )
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Auditoría No Encontrada</h1>
          <p className="text-slate-400 mb-8">La auditoría que buscas no existe o ha sido eliminada.</p>
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </button>
        </div>
      </div>
    )
  }

  const calculations = calculateROI(audit.monthly_bill, audit.roof_size)
  const co2_reduction = calculateCO2Reduction(audit.roof_size)
  const ahorro_25_anios = calculations.ahorro_esperado * 25

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Panel
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Banner Hook - Executive Report Style */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-3xl p-8 mb-12 shadow-2xl shadow-emerald-500/25">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              Propuesta de Ahorro para {audit.company || audit.client_name}
            </h1>
            <p className="text-emerald-100 text-lg">
              Análisis energético personalizado para tu instalación solar
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-white/20 rounded-full">
              <CheckCircle className="w-5 h-5 mr-2 text-white" />
              <span className="text-white font-medium">Estudio completado</span>
            </div>
          </div>
        </div>

        {/* Three Big Number Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* 25-Year Savings */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              €{ahorro_25_anios.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-slate-400 text-lg">Ahorro Total a 25 años</div>
            <div className="mt-4 text-emerald-400 text-sm font-medium">
              Ahorro anual: €{calculations.ahorro_esperado.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
            </div>
          </div>

          {/* ROI Months */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-blue-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {calculations.roi_meses.toFixed(0)} meses
            </div>
            <div className="text-slate-400 text-lg">Meses para Recuperar Inversión</div>
            <div className="mt-4 text-blue-400 text-sm font-medium">
              ROI: {calculations.roi_anios.toFixed(1)} años
            </div>
          </div>

          {/* CO2 Reduction */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:border-green-500/30 transition-all duration-300">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {(co2_reduction / 1000).toFixed(1)} ton
            </div>
            <div className="text-slate-400 text-lg">Reducción de CO₂ anual</div>
            <div className="mt-4 text-green-400 text-sm font-medium">
              {(co2_reduction * 25 / 1000).toFixed(1)} ton en 25 años
            </div>
          </div>
        </div>

        {/* Visual Comparison Chart */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Comparativa de Gastos a 10 años
          </h2>
          <div className="relative h-64 mb-4">
            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-around px-8">
              {/* Without Solar */}
              <div className="flex flex-col items-center flex-1 mx-4">
                <div 
                  className="w-full bg-red-500/20 border-2 border-red-500 rounded-t-lg transition-all duration-700"
                  style={{ height: '100%' }}
                >
                  <div className="text-red-400 font-bold text-lg p-4 text-center">
                    €{(audit.monthly_bill * 12 * 10).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="mt-4 text-red-400 font-medium">Sin Placas</div>
              </div>
              
              {/* With Solar */}
              <div className="flex flex-col items-center flex-1 mx-4">
                <div 
                  className="w-full bg-emerald-500/20 border-2 border-emerald-500 rounded-t-lg transition-all duration-700"
                  style={{ height: `${Math.min((calculations.coste_instalacion + (audit.monthly_bill * 12 * 0.25 * 10)) / (audit.monthly_bill * 12 * 10) * 100, 100)}%` }}
                >
                  <div className="text-emerald-400 font-bold text-lg p-4 text-center">
                    €{(calculations.coste_instalacion + (audit.monthly_bill * 12 * 0.25 * 10)).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="mt-4 text-emerald-400 font-medium">Con Placas</div>
              </div>
            </div>
          </div>
          <div className="text-center text-slate-400 text-sm">
            Ahorro total en 10 años: €{((audit.monthly_bill * 12 * 10) - (calculations.coste_instalacion + (audit.monthly_bill * 12 * 0.25 * 10))).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Magic WhatsApp Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xl rounded-2xl shadow-2xl shadow-green-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <MessageCircle className="w-8 h-8 mr-4" />
            Enviar Propuesta Irresistible
          </button>
          <p className="text-slate-400 mt-4">
            Click para abrir WhatsApp con mensaje pre-configurado
          </p>
        </div>

        {/* Client Details */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Detalles del Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-slate-400 text-sm mb-1">Cliente</div>
              <div className="text-white font-medium">{audit.company || audit.client_name}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Techo</div>
              <div className="text-white font-medium">{audit.roof_size}m²</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Factura mensual actual</div>
              <div className="text-white font-medium">€{audit.monthly_bill.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</div>
            </div>
            <div>
              <div className="text-slate-400 text-sm mb-1">Potencia instalada</div>
              <div className="text-white font-medium">{calculations.potencia_kW.toFixed(2)} kW</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
