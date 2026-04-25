import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rulombxexbgibwysrqae.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bG9tYnhleGJpYnd5c3JxYWUiLCJpYXQiOjE3MTQwNjQ0MDAsImV4cCI6MjAyOTY0MDQwMH0.L-QKhOteksGOfg-sN3IUDA_LzbTsM6u'

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
