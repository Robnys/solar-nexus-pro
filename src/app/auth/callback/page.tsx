'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Procesando autenticación...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Iniciando callback OAuth...')
        
        // Primero intentar obtener la sesión del hash (método más directo)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('📊 Sesión inicial:', session ? 'Encontrada' : 'No encontrada')
        console.log('❌ Error inicial:', error)
        
        if (session) {
          console.log('✅ Sesión establecida correctamente')
          setStatus('success')
          setMessage('¡Autenticación exitosa! Redirigiendo...')
          
          // Redirigir inmediatamente al dashboard
          setTimeout(() => {
            console.log('🚀 Redirigiendo al dashboard...')
            window.location.href = 'https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/dashboard'
          }, 1000)
          return
        }
        
        // Si no hay sesión, esperar y verificar de nuevo
        console.log('⏳ Esperando sesión...')
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Verificar de nuevo
        const { data: { session: sessionRetry }, error: retryError } = await supabase.auth.getSession()
        
        console.log('📊 Sesión después de espera:', sessionRetry ? 'Encontrada' : 'No encontrada')
        console.log('❌ Error después de espera:', retryError)
        
        if (sessionRetry) {
          console.log('✅ Sesión establecida después de espera')
          setStatus('success')
          setMessage('¡Autenticación exitosa! Redirigiendo...')
          
          setTimeout(() => {
            console.log('🚀 Redirigiendo al dashboard...')
            window.location.href = 'https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/dashboard'
          }, 1000)
        } else {
          console.log('❌ No se pudo establecer sesión')
          throw new Error('No se pudo establecer la sesión después de OAuth')
        }
      } catch (error: any) {
        console.error('💥 Error en callback:', error)
        setStatus('error')
        setMessage(error.message || 'Error en la autenticación')
        
        // Redirigir a la página de login en caso de error
        setTimeout(() => {
          console.log('🔙 Redirigiendo al login por error...')
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
