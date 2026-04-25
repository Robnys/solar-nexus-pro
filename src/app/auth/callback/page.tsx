'use client'

import { useEffect } from 'react'

export default function AuthCallback() {
  useEffect(() => {
    // Forzar redirect inmediato al dashboard
    window.location.href = 'https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/dashboard'
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Redirigiendo al dashboard...</div>
    </div>
  )
}
