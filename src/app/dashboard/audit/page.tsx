'use client'

import { useState } from 'react'
import { ArrowLeft, Sun, User, Zap, Home, Brain } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuditPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    clientName: '',
    monthlyConsumption: '',
    roofSurface: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Prepare data for Supabase
      const auditData = {
        client_name: formData.clientName,
        monthly_consumption: parseFloat(formData.monthlyConsumption),
        roof_surface: parseFloat(formData.roofSurface)
      }
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('audits')
        .insert([auditData])
        .select()
      
      if (error) {
        console.error('=== SUPABASE ERROR DETAILS ===')
        console.error('Error object:', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        console.error('Error code:', error.code)
        console.error('=============================')
        alert(`Error al guardar auditoría: ${error.message}`)
        return
      }
      
      // Success
      console.log('Audit saved:', data)
      alert('¡Datos guardados en la base de datos!')
      
      // Clear form
      setFormData({
        clientName: '',
        monthlyConsumption: '',
        roofSurface: ''
      })
      
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Error inesperado. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard"
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <Sun className="h-6 w-6 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">SolarNexus Pro</h1>
                  <p className="text-xs text-slate-400">Auditoría Solar con IA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Auditoría Solar Rápida
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Introduce los datos básicos del cliente y nuestra IA analizará el potencial solar 
            para generar un informe completo en segundos.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-8">
            {/* Client Name */}
            <div className="mb-6">
              <label htmlFor="clientName" className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-emerald-500" />
                  <span>Nombre del Cliente</span>
                </div>
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Ej: Juan Pérez González"
                required
              />
            </div>

            {/* Monthly Consumption */}
            <div className="mb-6">
              <label htmlFor="monthlyConsumption" className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <span>Consumo Mensual Medio (€)</span>
                </div>
              </label>
              <input
                type="number"
                id="monthlyConsumption"
                name="monthlyConsumption"
                value={formData.monthlyConsumption}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Ej: 150"
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Importe medio de la factura eléctrica mensual
              </p>
            </div>

            {/* Roof Surface */}
            <div className="mb-8">
              <label htmlFor="roofSurface" className="block text-sm font-medium text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-emerald-500" />
                  <span>Superficie de Tejado Disponible (m²)</span>
                </div>
              </label>
              <input
                type="number"
                id="roofSurface"
                name="roofSurface"
                value={formData.roofSurface}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Ej: 120"
                min="0"
                step="0.1"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Área total disponible para paneles solares
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full group relative inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="relative flex items-center space-x-3">
                <Brain className="h-5 w-5" />
                <span>Generar Informe con IA</span>
                <Sun className="h-5 w-5" />
              </div>
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Brain className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Análisis Inteligente</h3>
              <p className="text-slate-400 text-sm">
                Nuestra IA analizará patrones de consumo, orientación solar, 
                radiación local y rentabilidad para proporcionar un informe 
                detallado con recomendaciones personalizadas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
