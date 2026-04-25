'use client'

import { useState } from 'react'
import { signInWithGoogle, setGoogleUserPassword, signInWithEmail } from '@/lib/google-auth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Globe, Lock, Mail, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

interface GoogleLoginProps {
  onSuccess?: () => void
}

export default function GoogleLogin({ onSuccess }: GoogleLoginProps) {
  const [loading, setLoading] = useState(false)
  const [showPasswordSetup, setShowPasswordSetup] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await signInWithGoogle()
      
      if (result.success) {
        // El redirección se maneja automáticamente por Supabase
        setMessage('Redirigiendo a Google...')
      } else {
        setError(result.error || 'Error al iniciar sesión con Google')
      }
    } catch (error: any) {
      setError('Error inesperado. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    
    try {
      // Obtener el usuario actual
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setError('No se encontró la sesión. Por favor, inicia sesión de nuevo.')
        return
      }

      const result = await setGoogleUserPassword(session.user.id, password)
      
      if (result.success) {
        setMessage('¡Contraseña configurada correctamente!')
        setTimeout(() => {
          onSuccess?.()
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(result.error || 'Error al configurar la contraseña')
      }
    } catch (error: any) {
      setError('Error inesperado al configurar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar login con email para usuarios existentes
    // Esto es opcional, principalmente para usuarios que ya tenían contraseña
  }

  if (showPasswordSetup) {
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4">
            <Lock className="h-8 w-8 text-slate-950" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Configura tu Contraseña</h2>
          <p className="text-slate-400">
            Crea una contraseña para acceder rápidamente a tu cuenta
          </p>
        </div>

        <form onSubmit={handlePasswordSetup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-emerald-400 text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Configurando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Guardar Contraseña</span>
              </>
            )}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Google Sign In Button */}
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Conectando con Google...</span>
          </>
        ) : (
          <>
            <Globe className="h-5 w-5" />
            <span>Continuar con Google</span>
          </>
        )}
      </button>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <p className="text-emerald-400 text-sm">{message}</p>
        </div>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-950 text-slate-400">o</span>
        </div>
      </div>

      {/* Traditional Login (Optional) */}
      <div className="text-center">
        <p className="text-slate-400 text-sm">
          ¿Prefieres usar email y contraseña?{' '}
          <button
            onClick={() => setShowPasswordSetup(true)}
            className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
          >
            Configurar acceso tradicional
          </button>
        </p>
      </div>
    </div>
  )
}
