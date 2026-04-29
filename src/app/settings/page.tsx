'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Building, 
  MessageCircle, 
  Image, 
  Calculator, 
  Save, 
  Crown,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

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

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    company_name: '',
    whatsapp: '',
    logo_url: '',
    price_per_kw: 1100
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: existingSettings, error: fetchError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          setError('Error al cargar configuración')
          return
        }

        if (existingSettings) {
          setSettings(existingSettings)
          setFormData({
            company_name: existingSettings.company_name || '',
            whatsapp: existingSettings.whatsapp || '',
            logo_url: existingSettings.logo_url || '',
            price_per_kw: existingSettings.price_per_kw || 1100
          })
        }
      } catch (err) {
        setError('Error al cargar configuración')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price_per_kw' ? parseFloat(value) || 1100 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('Usuario no autenticado')
        return
      }

      const settingsData = {
        user_id: user.id,
        company_name: formData.company_name,
        whatsapp: formData.whatsapp,
        logo_url: formData.logo_url,
        price_per_kw: formData.price_per_kw,
        updated_at: new Date().toISOString()
      }

      let result
      if (settings) {
        // Update existing settings
        result = await supabase
          .from('user_settings')
          .update(settingsData)
          .eq('id', settings.id)
          .select()
          .single()
      } else {
        // Create new settings
        result = await supabase
          .from('user_settings')
          .insert({
            ...settingsData,
            created_at: new Date().toISOString()
          })
          .select()
          .single()
      }

      if (result.error) {
        setError('Error al guardar configuración')
        return
      }

      setSettings(result.data)
      setSuccess('Configuración guardada exitosamente')
    } catch (err) {
      setError('Error al guardar configuración')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Configuración</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Volver al Panel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-8">
        {/* Plan Pro Activo Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 shadow-2xl shadow-amber-500/25">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Plan Pro Activo</h2>
                <p className="text-amber-100">Estás utilizando la herramienta premium de generación de leads solares</p>
              </div>
            </div>
            <div className="text-amber-100 text-sm">
              Estado: <span className="font-semibold text-white">Activo</span>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6">Configuración de Identidad</h3>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Nombre Comercial / Empresa
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Mi Empresa Solar S.L."
              />
              <p className="text-slate-400 text-sm mt-2">Este nombre aparecerá en las propuestas enviadas a clientes</p>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MessageCircle className="w-4 h-4 inline mr-2" />
                WhatsApp de Contacto
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="+34 600 000 000"
              />
              <p className="text-slate-400 text-sm mt-2">Los clientes podrán contactarte directamente por WhatsApp</p>
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Image className="w-4 h-4 inline mr-2" />
                Logo URL
              </label>
              <input
                type="url"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="https://ejemplo.com/logo.png"
              />
              <p className="text-slate-400 text-sm mt-2">URL de tu logo para personalizar las propuestas</p>
            </div>

            {/* Price per kW */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Calculator className="w-4 h-4 inline mr-2" />
                Precio por kW (€)
              </label>
              <input
                type="number"
                name="price_per_kw"
                value={formData.price_per_kw}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="1100"
              />
              <p className="text-slate-400 text-sm mt-2">Precio de instalación por kW para cálculos de ROI personalizados</p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Integration Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Integración Automática</h4>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Dashboard: Tu empresa aparecerá en el panel principal</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Propuestas: Tu logo y nombre en las páginas públicas</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>WhatsApp: Los clientes te contactarán directamente</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Cálculos: ROI basado en tus precios reales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
