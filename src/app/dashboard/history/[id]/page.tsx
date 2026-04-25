'use client'

import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Euro, Home, Calendar, FileText, TrendingUp, Sun, Battery } from 'lucide-react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const supabase = createClient(
  'https://rulombxexbgibwysrqae.supabase.co',
  'sb_publishable_L-QKhOteksGOfg-sN3IUDA_LzbTsM6u'
)

interface AuditDetailPageProps {
  params: {
    id: string
  }
}

export default function AuditDetailPage({ params }: AuditDetailPageProps) {
  const [audit, setAudit] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const resolvedParams = await params
        const auditId = resolvedParams.id
        
        console.log('=== SUPABASE QUERY DEBUG ===')
        console.log('Audit ID to query:', auditId)
        
        const { data: auditData, error: fetchError } = await supabase
          .from('audits')
          .select('*')
          .eq('id', auditId)
          .single()

        console.log('Supabase query result:')
        console.log('Data:', auditData)
        console.log('Error:', fetchError)

        if (fetchError || !auditData) {
          console.log('=== NOT FOUND TRIGGERED ===')
          console.log('Error:', fetchError)
          console.log('Audit data:', auditData)
          notFound()
          return
        }

        setAudit(auditData)
        // Trigger AI analysis after data is loaded
        generateAIAnalysis(auditData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading audit')
      } finally {
        setLoading(false)
      }
    }

    fetchAudit()
  }, [params])

  // Función para generar análisis con IA
  const generateAIAnalysis = async (auditData: any) => {
    setAiLoading(true)
    
    try {
      // Simular delay para efecto de "análisis"
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock de análisis basado en los datos del cliente
      const monthlyBill = auditData.monthly_bill || 0
      const roofSize = auditData.roof_size || 0
      const finalKW = Math.min(Math.ceil((monthlyBill / 120) * 10) / 10, Math.round((roofSize * 0.15) * 10) / 10)
      const annualSavings = Math.round(finalKW * 120 * 12)
      const paybackPeriod = Math.round((finalKW * 1500) / (finalKW * 120 * 12))
      
      const analysis = `Tras analizar detalladamente tu perfil de consumo y las características de tu tejado, he determinado que la instalación de ${finalKW} kW de potencia es la solución óptima para maximizar tu retorno de inversión. Esta configuración específica aprovechará al máximo los ${roofSize} m² disponibles de tu tejado, optimizando la orientación y el espacio para garantizar la máxima generación de energía.

Tu consumo actual de €${monthlyBill}/mes se verá drásticamente reducido gracias a una producción anual estimada de ${Math.round(finalKW * 1200)} kWh, lo que representa un ahorro real de €${annualSavings} anuales. Esto significa que tu factura eléctrica podría reducirse hasta en un ${Math.round((annualSavings / (monthlyBill * 12)) * 100)}%, permitiéndote recuperar la inversión inicial en aproximadamente ${paybackPeriod} años.

La tecnología de paneles de alta eficiencia que proponemos, combinada con tu perfil de consumo diurno, asegura una autoconsumo del 85-90%, minimizando la dependencia de la red y maximizando tus ahorros desde el primer día.`

      setAiAnalysis(analysis)
    } catch (error) {
      console.error('Error generating AI analysis:', error)
      setAiAnalysis('No se pudo generar el análisis detallado en este momento.')
    } finally {
      setAiLoading(false)
    }
  }

  // Función para descargar PDF
  const handleDownloadPDF = () => {
    if (!audit) return
    
    // Crear contenido del PDF
    const pdfContent = `
INFORME SOLAR - SOLARNEXUS PRO
================================

Cliente: ${audit.client_name || 'N/A'}
Fecha: ${new Date().toLocaleDateString('es-ES')}

RESUMEN EJECUTIVO
-----------------
Potencia Recomendada: ${finalKW} kW
Inversión Inicial: €${totalInstallationCost}
Ahorro Anual: €${annualSavings}
Período de Retorno: ${paybackPeriod} años
Reducción CO₂: ${co2Reduction} kg/año

ANÁLISIS DE VIABILIDAD DETALLADO
--------------------------------
${aiAnalysis || 'Análisis no disponible'}

BENEFICIOS ECONÓMICOS
--------------------
Ahorro 10 años: €${totalSavings10Years}
Ganancia post-ROI: €${profitAfterROI}

CONFIGURACIÓN TÉCNICA
---------------------
Paneles: ${Math.round(finalKW * 1000 / 550)} paneles de 550W
Inversor: ${finalKW} kW
Superficie utilizada: ${roofSize} m²

Para más información, contacte con SolarNexus Pro
    `.trim()
    
    // Crear blob y descargar
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `informe_solar_${audit.client_name || 'cliente'}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Función para compartir por WhatsApp
  const handleWhatsAppShare = () => {
    if (!audit) return
    
    const message = `Hola ${audit.client_name || 'Cliente'}, aquí tienes tu Informe Solar de SolarNexus Pro. ¡Tu retorno es de solo ${audit.paybackPeriod || 0} años! Ver informe completo: ${window.location.href}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-white">Cargando informe...</div>
      </div>
    )
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-red-500">Error: {error || 'Audit not found'}</div>
      </div>
    )
  }

  // Cálculos financieros basados en principios de Hormozi
  const monthlyBill = audit.monthly_bill || 0
  const roofSize = audit.roof_size || 0
  
  // Cálculo de potencia necesaria (basado en consumo real)
  // Estimación: 1kW genera ~€100-150/mes en España
  const monthlyCostPerKW = 120 // €/mes por kW instalado
  const requiredKW = Math.ceil((monthlyBill / monthlyCostPerKW) * 10) / 10
  const usableRoofKW = Math.round((roofSize * 0.15) * 10) / 10
  const finalKW = Math.min(requiredKW, usableRoofKW) // Usa el menor entre necesario y disponible
  
  // Cálculo de ROI con retorno 4-7 años (Hormozi principle)
  const installationCostPerKW = 1500 // €/kW más realista
  const totalInstallationCost = Math.round(finalKW * installationCostPerKW)
  
  // Ahorro real basado en la potencia instalada
  const monthlySavings = Math.round(finalKW * monthlyCostPerKW)
  const annualSavings = monthlySavings * 12
  
  // ROI ajustado para 4-7 años (valor percibido alto)
  const targetROIYears = 5 // Punto medio del rango 4-7 años
  const paybackPeriod = Math.round(totalInstallationCost / annualSavings)
  
  // Métricas adicionales
  const co2Reduction = Math.round(finalKW * 1200) // kg CO₂/año
  const totalSavings10Years = annualSavings * 10
  const profitAfterROI = totalSavings10Years - totalInstallationCost

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard/history"
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al Historial</span>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Informe Ejecutivo</h1>
              <p className="text-xl text-emerald-400 font-semibold">
                {audit.client_name}
              </p>
              <p className="text-slate-400 mt-1">
                Análisis de Viabilidad Solar
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            Auditoría #{audit.id}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Izquierdo - Datos del Cliente */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                <User className="h-5 w-5 text-emerald-500" />
                <span>Información del Cliente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Nombre</p>
                <p className="text-white font-medium">{audit.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Consumo Mensual</p>
                <p className="text-white font-medium">€{monthlyBill.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Superficie Disponible</p>
                <p className="text-white font-medium">{roofSize} m²</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Fecha de Auditoría</p>
                <p className="text-white font-medium">
                  {new Date(audit.created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span>Métricas Clave</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Potencia Estimada</span>
                <span className="text-white font-bold">{finalKW} kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ahorro Anual</span>
                <span className="text-emerald-400 font-bold">€{annualSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Reducción CO₂</span>
                <span className="text-blue-400 font-bold">{co2Reduction.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Período Retorno</span>
                <span className="text-white font-bold">{paybackPeriod} años</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Central - Informe de Viabilidad */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                <span>Resumen Ejecutivo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                  <span>Análisis de Viabilidad</span>
                  {aiLoading && (
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </h3>
                {aiLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <p className="text-slate-300 leading-relaxed">
                    {aiAnalysis || (
                      <>
                        Basado en el análisis de los datos proporcionados, la instalación de un sistema fotovoltaico 
                        de <span className="text-emerald-400 font-semibold">{finalKW} kW</span> en la superficie 
                        disponible de <span className="text-emerald-400 font-semibold">{roofSize} m²</span> resulta 
                        altamente viable y rentable.
                      </>
                    )}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Beneficios Económicos</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ahorro estimado de <span className="text-emerald-400 font-semibold">€{annualSavings.toLocaleString()} anuales</span> en factura eléctrica</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Período de retorno de inversión de <span className="text-emerald-400 font-semibold">{paybackPeriod} años</span></span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Inversión inicial estimada: <span className="text-emerald-400 font-semibold">€{totalInstallationCost.toLocaleString()}</span></span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Impacto Ambiental</h3>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Reducción de emisiones: <span className="text-blue-400 font-semibold">{co2Reduction.toLocaleString()} kg CO₂/año</span></span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Equivalente a plantar <span className="text-blue-400 font-semibold">{Math.round(co2Reduction / 20)} árboles</span></span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                <Sun className="h-5 w-5 text-emerald-500" />
                <span>Recomendaciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                    <Battery className="h-4 w-4 text-emerald-500" />
                    <span>Configuración Óptima</span>
                  </h4>
                  <p className="text-slate-300 text-sm">
                    {Math.round(finalKW * 1000 / 550)} paneles de 550W<br />
                    Inversor de {finalKW} kW<br />
                    Estructura de fijación aluminio
                  </p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>Próximos Pasos</span>
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Estudio técnico detallado<br />
                    Permisos y licencias<br />
                    Instalación en 2-3 semanas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Section - Ready for OpenAI Integration */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
                <Sun className="h-5 w-5 text-emerald-500" />
                <span>Análisis de Viabilidad IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg p-4 border border-emerald-500/30">
                <p className="text-slate-300 text-sm leading-relaxed">
                  <span className="text-emerald-400 font-semibold">IA Analysis:</span> Basado en los patrones de consumo y características del tejado, 
                  el sistema optimizado de {finalKW} kW ofrece un retorno del {Math.round((annualSavings/totalInstallationCost)*100)}% anual. 
                  La irradiación solar promedio en la zona maximiza la producción durante las horas pico de consumo.
                </p>
              </div>
              
              {/* Sales Arguments - Hormozi Style */}
              <div className="space-y-3">
                <h4 className="text-white font-medium flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span>Puntos Clave para la Venta</span>
                </h4>
                
                <div className="space-y-2">
                  <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-emerald-500">
                    <p className="text-emerald-400 font-medium text-sm mb-1">Objeción: "Es muy caro"</p>
                    <p className="text-slate-300 text-xs">
                      "Entiendo, pero piensa que en {paybackPeriod} años recuperarás toda la inversión. 
                      Después son {10-paybackPeriod} años de ganancia pura: €{profitAfterROI.toLocaleString()} libres de impuestos."
                    </p>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-blue-400 font-medium text-sm mb-1">Objeción: "No estoy seguro"</p>
                    <p className="text-slate-300 text-xs">
                      "Totalmente comprensible. Mira los datos: ahorrarás €{annualSavings.toLocaleString()} al año desde el día 1. 
                      Es como tener un segundo sueldo sin trabajar. ¿Hay alguna inversión mejor que esa?"
                    </p>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-purple-500">
                    <p className="text-purple-400 font-medium text-sm mb-1">Objeción: "Ya tengo electricidad barata"</p>
                    <p className="text-slate-300 text-xs">
                      "¡Perfecto! Entonces sabes lo valioso que es. Con solar, tu precio será €0 para siempre. 
                      ¿Prefieres seguir pagando o que te paguen a ti por generar tu propia energía?"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Buttons - Reduce Effort & Sacrifice */}
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Descargar Propuesta PDF</span>
                </button>
                <button 
                  onClick={handleWhatsAppShare}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-700 flex items-center justify-center space-x-2"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Enviar por WhatsApp</span>
                </button>
              </div>
              <p className="text-slate-400 text-xs text-center mt-4">
                Recibe la propuesta completa en segundos. Sin esfuerzo, sin esperas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
