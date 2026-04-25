// Configuración optimizada para evitar rate limiting
export const supabaseConfig = {
  // Configuración de reintentos y delays
  auth: {
    // Retrasos entre intentos para evitar rate limiting
    retryDelay: 2000, // 2 segundos
    maxRetries: 3,
    // Configuración de persistencia
    persistSession: true,
    autoRefreshToken: true,
  },
  
  // Configuración de emails
  email: {
    // Usar plantillas personalizadas para evitar límites
    templates: {
      signup: {
        subject: 'Bienvenido a SolarNexus Pro',
        redirectUrl: `https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/login?confirmed=true`,
      },
      reset: {
        subject: 'Recupera tu contraseña en SolarNexus Pro',
        redirectUrl: `https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/reset-password`,
      }
    }
  }
}

// Función para esperar y evitar rate limiting
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Función de reintentos con backoff exponencial
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Si es el último intento, lanzar el error
      if (i === maxRetries - 1) {
        throw lastError
      }
      
      // Esperar con backoff exponencial
      const waitTime = initialDelay * Math.pow(2, i)
      await delay(waitTime)
    }
  }
  
  throw lastError!
}
