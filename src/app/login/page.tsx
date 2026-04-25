'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { delay, retryWithBackoff } from '@/lib/supabase-config'
import { Sun, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        // Sign up con retry para evitar rate limiting
        const { data, error } = await retryWithBackoff(async () => {
          await delay(1000) // Delay inicial para evitar rate limiting
          return await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
            }
          })
        }, 3, 1500)

        if (error) throw error

        if (data.user && !data.session) {
          // User created but email not confirmed
          setShowConfirmation(true)
          setMessage('¡Cuenta creada! Por favor, revisa tu email y haz clic en el enlace de confirmación.')
          setEmail('')
          setPassword('')
        } else if (data.session) {
          // User created and signed in
          router.push('/dashboard')
        }
      } else {
        // Sign in
        const { data, error } = await retryWithBackoff(async () => {
          await delay(500)
          return await supabase.auth.signInWithPassword({
            email,
            password,
          })
        }, 2, 1000)

        if (error) throw error

        if (data.session) {
          router.push('/dashboard')
        }
      }
    } catch (error: any) {
      // Manejo específico de rate limiting
      if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
        setError('Has excedido el límite de intentos. Por favor, espera unos minutos antes de intentar de nuevo.')
      } else if (error.message?.includes('email_conflict')) {
        setError('Este email ya está registrado. Intenta iniciar sesión o recupera tu contraseña.')
      } else {
        setError(error.message || 'Error en la autenticación')
      }
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
      const { error } = await retryWithBackoff(async () => {
        await delay(2000) // Delay mayor para evitar rate limiting
        return await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login?reset=true`,
        })
      }, 3, 2000)

      if (error) throw error

      setMessage('Email de restablecimiento enviado. Revisa tu bandeja de entrada y spam.')
    } catch (error: any) {
      if (error.message?.includes('rate limit') || error.message?.includes('too many requests')) {
        setError('Has excedido el límite de intentos. Por favor, espera 10 minutos antes de intentar de nuevo.')
      } else {
        setError(error.message || 'Error al enviar email de restablecimiento')
      }
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
            {showConfirmation 
              ? 'Confirma tu email' 
              : isSignUp 
                ? 'Crea tu cuenta para comenzar' 
                : 'Bienvenido de nuevo'
            }
          </p>
        </div>

        {/* Confirmation Message */}
          {showConfirmation && message && (
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

        {/* Login Form - Hide when showing confirmation */}
        {!showConfirmation && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleAuth} className="space-y-6">
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
                  className="w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                  className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                  <div>
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                    {error.includes('límite') && (
                      <p className="text-red-300 text-xs mt-1">
                        💡 Tip: Los límites de email se resetean cada 10 minutos. También puedes usar una cuenta de Gmail temporal.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {message && !showConfirmation && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-emerald-400 text-sm">{message}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</span>
              )}
            </button>
          </form>

          {/* Password Reset - Available in both modes */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={loading || !email}
              className="text-slate-400 hover:text-emerald-400 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSignUp ? '¿Ya tienes cuenta? Recupera tu contraseña' : '¿Olvidaste tu contraseña?'}
            </button>
          </div>

          {/* Toggle Sign In/Up */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setShowConfirmation(false)
                  setError(null)
                  setMessage(null)
                }}
                className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
              >
                {isSignUp ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>
        )}
        
        {/* Success Message Display */}
        {showConfirmation && message && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">¡Cuenta Creada!</h3>
              <p className="text-slate-400 mb-6">{message}</p>
              <button
                onClick={() => {
                  setShowConfirmation(false)
                  setIsSignUp(false)
                }}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg transition-colors"
              >
                Ir a Iniciar Sesión
              </button>
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
