'use server'

import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Euro, Home, Calendar, FileText, TrendingUp, Sun, Battery } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuditDetailPageProps {
  params: {
    id: string
  }
}

export default async function AuditDetailPage({ params }: AuditDetailPageProps) {
  const { data: audit, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !audit) {
    notFound()
  }

  // Cálculos para el informe de viabilidad
  const monthlyConsumption = audit.monthly_bill || 0
  const roofSize = audit.roof_size || 0
  
  // Estimaciones básicas (estas pueden ser refinadas con IA más adelante)
  const estimatedKW = Math.round((roofSize * 0.15) * 10) / 10 // 150W/m²
  const annualSavings = Math.round(monthlyConsumption * 12 * 0.7) // 70% de ahorro estimado
  const co2Reduction = Math.round(estimatedKW * 1200) // kg CO₂/año
  const installationCost = Math.round(estimatedKW * 1200) // €1200/kW
  const paybackPeriod = Math.round(installationCost / (monthlyConsumption * 12 * 0.7))

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
              <h1 className="text-3xl font-bold text-white mb-2">Informe de Viabilidad Solar</h1>
              <p className="text-slate-400">
                Análisis completo para {audit.client_name}
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
                <p className="text-white font-medium">€{monthlyConsumption.toLocaleString()}</p>
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
                <span className="text-white font-bold">{estimatedKW} kW</span>
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
                  de <span className="text-emerald-400 font-semibold">{estimatedKW} kW</span> en la superficie 
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
                    <span>Inversión inicial estimada: <span className="text-emerald-400 font-semibold">€{installationCost.toLocaleString()}</span></span>
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
        </div>
      </div>
    </div>
  )
}
