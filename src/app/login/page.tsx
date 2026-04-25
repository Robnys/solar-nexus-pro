'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sun, Globe, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GoogleLogin from './google-login'

export default function LoginPage() {
  const [showTraditional, setShowTraditional] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        router.push('/dashboard')
      }
    } catch (error: any) {
      setError(error.message || 'Error en el inicio de sesión')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Por favor, introduce tu email para restablecer la contraseña')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/login?reset=true`,
      })

      if (error) throw error

      setMessage('Email de restablecimiento enviado. Revisa tu bandeja de entrada.')
    } catch (error: any) {
      setError(error.message || 'Error al enviar email de restablecimiento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-slate-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.emerald.500/10),transparent_70%)]"></div>
      
      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
            <Sun className="h-8 w-8 text-slate-950" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SolarNexus Pro</h1>
          <p className="text-slate-400">
            {showTraditional 
              ? 'Inicia sesión con tu email' 
              : 'Accede rápidamente con Google'
            }
          </p>
        </div>

        {/* Confirmation Message */}
          {showTraditional && message && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-emerald-400 text-sm font-medium">{message}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Una vez confirmado, podrás iniciar sesión con tu email y contraseña.
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Primary Google OAuth Login */}
        {!showTraditional && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <GoogleLogin onSuccess={() => router.push('/dashboard')} />
            
            {/* Traditional Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                ¿Prefieres usar email y contraseña?{' '}
                <button
                  onClick={() => setShowTraditional(true)}
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                >
                  Usar login tradicional
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Traditional Login Form */}
        {showTraditional && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleTraditionalLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>
            </form>

            {/* Password Reset */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={loading || !email}
                className="text-slate-400 hover:text-emerald-400 text-sm transition-colors disabled:opacity-50"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Back to Google Login */}
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                ¿Prefieres un acceso más rápido?{' '}
                <button
                  onClick={() => setShowTraditional(false)}
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                >
                  Usar Google
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 SolarNexus Pro. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
