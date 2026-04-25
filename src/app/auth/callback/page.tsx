'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Procesando autenticación...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Esperar un momento para que la sesión se establezca
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Verificar si tenemos sesión
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (session) {
          setStatus('success')
          setMessage('¡Autenticación exitosa! Redirigiendo...')
          
          // Redirigir al dashboard después de un breve momento
          setTimeout(() => {
            window.location.href = 'https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/dashboard/test'
          }, 1500)
        } else {
          // Intentar obtener la sesión del URL hash
          const { data: { session: sessionFromHash }, error: hashError } = await supabase.auth.getSession()
          
          if (hashError) {
            throw hashError
          }
          
          if (sessionFromHash) {
            setStatus('success')
            setMessage('¡Autenticación exitosa! Redirigiendo...')
            
            setTimeout(() => {
              window.location.href = 'https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/dashboard/test'
            }, 1500)
          } else {
            throw new Error('No se pudo establecer la sesión')
          }
        }
      } catch (error: any) {
        console.error('Error en callback:', error)
        setStatus('error')
        setMessage(error.message || 'Error en la autenticación')
        
        // Redirigir al login después de un momento
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Procesando...
              </h2>
              <p className="text-slate-400">
                {message}
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                ¡Éxito!
              </h2>
              <p className="text-slate-400">
                {message}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Error
              </h2>
              <p className="text-slate-400">
                {message}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
