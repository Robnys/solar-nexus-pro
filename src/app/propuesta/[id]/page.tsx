'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Sun, 
  TrendingDown, 
  Calculator, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Zap,
  Leaf,
  Home
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

export default function PublicProposalPage({ params }: { params: { id: string } }) {
  const [audit, setAudit] = useState<Audit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lossCounter, setLossCounter] = useState(0)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  // Real engineering calculations
  const calculateROI = (monthly_bill: number, roof_size: number) => {
    const pricePerKw = userSettings?.price_per_kw || 1100
    const potencia_kW = roof_size * 0.15
    const produccion_anual = potencia_kW * 1500
    const ahorro_real = produccion_anual * 0.25
    const coste_instalacion = potencia_kW * pricePerKw
    
    const ahorro_esperado = monthly_bill * 12 * 0.75
    const roi_anios = coste_instalacion / ahorro_esperado
    const perdida_mensual = ahorro_esperado / 12
    
    return {
      potencia_kW,
      produccion_anual,
      ahorro_real,
      coste_instalacion,
      ahorro_esperado,
      roi_anios,
      perdida_mensual
    }
  }

  useEffect(() => {
    fetchAudit()
    fetchUserSettings()
  }, [params.id])

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
        setError('Propuesta no encontrada')
        return
      }

      if (!auditData) {
        setError('Propuesta no encontrada')
        return
      }

      setAudit(auditData)
    } catch (err: any) {
      setError('Error al cargar la propuesta')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSettings = async () => {
    try {
      // Get user_id from audit first, then fetch settings
      if (!params.id) return
      
      const { data: auditData } = await supabase
        .from('audits')
        .select('user_id')
        .eq('id', params.id)
        .single()

      if (auditData?.user_id) {
        const { data: settings, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', auditData.user_id)
          .single()

        if (settings && !error) {
          setUserSettings(settings)
        }
      }
    } catch (err) {
      // Silently fail for settings
    }
  }

  // Animated loss counter (Hormozi fear of loss principle)
  useEffect(() => {
    if (!audit) return
    
    const calculations = calculateROI(audit.monthly_bill, audit.roof_size)
    const targetLoss = calculations.perdida_mensual
    
    let current = 0
    const increment = targetLoss / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= targetLoss) {
        current = targetLoss
        clearInterval(timer)
      }
      setLossCounter(current)
    }, 30)

    return () => clearInterval(timer)
  }, [audit])

  const handleAcceptProposal = () => {
    if (!audit) return

    const message = `¡Hola! He visto mi propuesta solar y estoy interesado en empezar. Mi referencia: ${audit.id}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 text-lg">Cargando su propuesta...</p>
        </div>
      </div>
    )
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Propuesta No Encontrada</h1>
          <p className="text-gray-600">La propuesta que busca no existe o ha expirado.</p>
        </div>
      </div>
    )
  }

  const calculations = calculateROI(audit.monthly_bill, audit.roof_size)
  const ahorro_25_anios = calculations.ahorro_esperado * 25

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="w-6 h-6 text-emerald-600" />
              <span className="text-gray-900 font-semibold">SolarNexus</span>
            </div>
            <div className="text-sm text-gray-500">
              Estudio de Viabilidad Fotovoltaica
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <Home className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Estudio de Viabilidad Fotovoltaica para su Hogar
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Propuesta personalizada para: {audit.company || audit.client_name}
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full">
            <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Análisis completado</span>
          </div>
        </div>

        {/* Loss Counter - Hormozi Fear of Loss */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              ¡Está perdiendo dinero cada mes!
            </h2>
            <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
              €{lossCounter.toFixed(2)}
            </div>
            <p className="text-red-700 text-lg">
              Ahorro mensual que NO está aprovechando sin placas solares
            </p>
            <div className="mt-4 text-red-600 text-sm">
              Total anual perdido: €{calculations.perdida_mensual * 12.toFixed(0)}
            </div>
          </div>
        </div>

        {/* ROI Visual Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comparativa de Gastos Anuales
          </h2>
          
          <div className="space-y-6">
            {/* Current Bill */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <TrendingDown className="w-6 h-6 text-red-600" />
                <div>
                  <div className="font-semibold text-red-900">Factura Actual</div>
                  <div className="text-sm text-red-700">Sin energía solar</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600">
                €{(audit.monthly_bill * 12).toLocaleString('es-ES')}
              </div>
            </div>

            {/* Future Bill */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-emerald-600" />
                <div>
                  <div className="font-semibold text-emerald-900">Factura Futura</div>
                  <div className="text-sm text-emerald-700">Con energía solar</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                €{(audit.monthly_bill * 12 * 0.25).toLocaleString('es-ES')}
              </div>
            </div>

            {/* Annual Savings */}
            <div className="text-center p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white">
              <div className="text-lg font-medium mb-2">Ahorro Anual Garantizado</div>
              <div className="text-3xl md:text-4xl font-bold">
                €{calculations.ahorro_esperado.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>

          {/* ROI Timeline */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Período de Recuperación</span>
              <span className="text-2xl font-bold text-emerald-600">
                {calculations.roi_anios.toFixed(1)} años
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((calculations.roi_anios / 10) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Año 0</span>
              <span>Año 5</span>
              <span>Año 10</span>
            </div>
          </div>
        </div>

        {/* Project Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">
              €{ahorro_25_anios.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-gray-600">Ahorro en 25 años</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {calculations.potencia_kW.toFixed(2)} kW
            </div>
            <div className="text-gray-600">Potencia instalada</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Leaf className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {(calculations.produccion_anual * 0.5 / 1000).toFixed(1)} ton
            </div>
            <div className="text-gray-600">CO₂ evitado al año</div>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Especificaciones Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Superficie disponible</span>
              <span className="font-semibold text-gray-900">{audit.roof_size} m²</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Producción anual estimada</span>
              <span className="font-semibold text-gray-900">{calculations.produccion_anual.toFixed(0)} kWh</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Factura mensual actual</span>
              <span className="font-semibold text-gray-900">€{audit.monthly_bill.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Inversión inicial</span>
              <span className="font-semibold text-gray-900">€{calculations.coste_instalacion.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¿Listo para empezar a ahorrar?
          </h2>
          <p className="text-emerald-100 text-lg mb-6">
            Acepte esta propuesta y contacte con nuestro instalador certificado
          </p>
          <button
            onClick={handleAcceptProposal}
            className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Aceptar Propuesta y Contactar con Instalador
          </button>
          <p className="text-emerald-100 text-sm mt-4">
            Será contactado en menos de 24 horas
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pb-8">
          <p>Propuesta generada por SolarNexus Pro</p>
          <p>Cálculos basados en datos reales de irradiación solar y tarifas eléctricas actuales</p>
        </div>
      </div>
    </div>
  )
}
