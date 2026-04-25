'use server'

import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Euro, Home, Calendar, FileText, TrendingUp, Sun, Battery } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  'https://rulombxexbgibwysrqae.supabase.co',
  'sb_publishable_L-QKhOteksGOfg-sN3IUDA_LzbTsM6u'
)

interface AuditDetailPageProps {
  params: {
    id: string
  }
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  // Await params in Next.js 15
  const resolvedParams = await params
  
  console.log('=== DETAIL PAGE DEBUG ===')
  console.log('Params received:', resolvedParams)
  console.log('Audit ID from params:', resolvedParams.id)
  console.log('Type of ID:', typeof resolvedParams.id)
  
  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  console.log('Supabase query result:')
  console.log('Data:', audit)
  console.log('Error:', error)

  if (error || !audit) {
    console.log('=== NOT FOUND TRIGGERED ===')
    console.log('Error:', error)
    console.log('Audit data:', audit)
    notFound()
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
                <h3 className="text-white font-semibold mb-3">Análisis de Viabilidad</h3>
                <p className="text-slate-300 leading-relaxed">
                  Basado en el análisis de los datos proporcionados, la instalación de un sistema fotovoltaico 
                  de <span className="text-emerald-400 font-semibold">{finalKW} kW</span> en la superficie 
                  disponible de <span className="text-emerald-400 font-semibold">{roofSize} m²</span> resulta 
                  altamente viable y rentable.
                </p>
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
                    {Math.round(estimatedKW * 1000 / 550)} paneles de 550W<br />
                    Inversor de {estimatedKW} kW<br />
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
                  <span>Argumentario de Venta (Hormozi)</span>
                </h4>
                
                <div className="space-y-2">
                  <div className="bg-slate-800 rounded-lg p-3 border-l-4 border-emerald-500">
                    <p className="text-emerald-400 font-medium text-sm mb-1">Objeción: "Es muy caro"</p>
                    <p className="text-slate-300 text-xs">
                      "Entiendo, pero piensa que en {paybackPeriod} años recuperarás toda la inversión. 
                      Después son {10-paybackPeriod} años de ganancia pura: €{totalSavings10Years-totalInstallationCost.toLocaleString()} libres de impuestos."
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
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Descargar Propuesta PDF</span>
                </button>
                <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-700 flex items-center justify-center space-x-2">
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
