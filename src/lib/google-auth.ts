import { supabase } from './supabase'

// Configuración de Google OAuth
export const googleAuthConfig = {
  provider: 'google',
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
    scopes: [
      'email',
      'profile',
      'openid'
    ]
  }
}

// Función principal de login con Google
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://opulent-garbanzo-qv6j5grj75qhqwj-3000.app.github.dev/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('Error en Google OAuth:', error)
    return { success: false, error: error.message }
  }
}

// Función para manejar el callback de Google
export async function handleGoogleCallback() {
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    if (data.session) {
      // Verificar si es un usuario nuevo y necesita configurar contraseña
      const isNewUser = await checkIfNewUser(data.session.user.id)
      
      return { 
        success: true, 
        session: data.session,
        isNewUser,
        needsPasswordSetup: isNewUser
      }
    }
    
    return { success: false, error: 'No se encontró sesión' }
  } catch (error: any) {
    console.error('Error en callback:', error)
    return { success: false, error: error.message }
  }
}

// Verificar si es un usuario nuevo
async function checkIfNewUser(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('password_set')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    // Si no existe perfil o no tiene contraseña, es nuevo
    return !data || !data.password_set
  } catch (error) {
    console.error('Error verificando usuario:', error)
    return true // Asumir que es nuevo por seguridad
  }
}

// Guardar contraseña para usuario de Google
export async function setGoogleUserPassword(userId: string, password: string) {
  try {
    // Actualizar en Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({
      password: password
    })
    
    if (authError) throw authError
    
    // Marcar en el perfil que ya tiene contraseña
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        password_set: true,
        auth_provider: 'google',
        created_at: new Date().toISOString()
      })
    
    if (profileError) throw profileError
    
    return { success: true }
  } catch (error: any) {
    console.error('Error estableciendo contraseña:', error)
    return { success: false, error: error.message }
  }
}

// Login con email y contraseña (para usuarios que ya tienen contraseña)
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    console.error('Error en login con email:', error)
    return { success: false, error: error.message }
  }
}
