import { createClient } from '@supabase/supabase-js'

// Test with environment variables first
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rulombxexbgibwysrqae.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_L-QKhOteksGOfg-sN3IUDA_LzbTsM6u'

// Remove any /rest/v1/ suffix that might be causing duplication
const cleanSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/$/, '')


// Create client with auth configuration
export const supabase = createClient(cleanSupabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Create a separate client for middleware (server-side)
export const supabaseServer = createClient(cleanSupabaseUrl, supabaseAnonKey)

export interface AuditData {
  id?: number
  client_name: string
  monthly_bill: number
  roof_size: number
  created_at?: string
}

export async function saveAuditData(data: Omit<AuditData, 'created_at'>) {
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session?.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { data: result, error } = await supabase
      .from('audits')
      .insert([{
        ...data,
        user_id: session.user.id,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Unexpected error occurred' }
  }
}
