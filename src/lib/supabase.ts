import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AuditData {
  client_name: string
  monthly_consumption: number
  roof_surface: number
  created_at: string
}

export async function saveAuditData(data: Omit<AuditData, 'created_at'>) {
  try {
    const { data: result, error } = await supabase
      .from('audits')
      .insert([{
        ...data,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('Error saving audit data:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'Unexpected error occurred' }
  }
}
