'use server'

import { createClient } from '@supabase/supabase-js'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Euro, Home, Eye } from 'lucide-react'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function HistoryPage() {
  // Server component - instant data loading
  const { data: audits, error } = await supabase
    .from('audits')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audits:', error)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error al cargar historial</h1>
          <p className="text-slate-400">Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Historial de Auditorías</h1>
            <p className="text-slate-400">
              Todos los leads y auditorías realizadas en SolarNexus Pro
            </p>
          </div>
          <Link 
            href="/dashboard"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Leads
            </CardTitle>
            <User className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {audits?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Potencia Total
            </CardTitle>
            <Home className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {audits?.reduce((sum, audit) => sum + (audit.roof_size || 0), 0).toLocaleString()} m²
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Consumo Promedio
            </CardTitle>
            <Euro className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              €{audits?.length > 0 
                ? Math.round(audits.reduce((sum, audit) => sum + (audit.monthly_bill || 0), 0) / audits.length).toLocaleString()
                : '0'
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Última Auditoría
            </CardTitle>
            <Calendar className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-white">
              {audits?.length > 0 
                ? new Date(audits[0].created_at).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : 'Sin auditorías'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            Leads Registrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {audits && audits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-400">Cliente</TableHead>
                  <TableHead className="text-slate-400">Consumo Mensual</TableHead>
                  <TableHead className="text-slate-400">Superficie</TableHead>
                  <TableHead className="text-slate-400">Fecha</TableHead>
                  <TableHead className="text-slate-400">Estado</TableHead>
                  <TableHead className="text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audits.map((audit) => (
                  <TableRow key={audit.id} className="border-slate-800">
                    <TableCell className="text-white font-medium">
                      {audit.client_name}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      €{audit.monthly_bill?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {audit.roof_size} m²
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(audit.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        Nuevo Lead
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/dashboard/history/${audit.id}`}
                        className="inline-flex items-center space-x-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium rounded-lg transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Ver Análisis</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                No hay auditorías registradas aún
              </p>
              <Link 
                href="/dashboard/audit"
                className="inline-block mt-4 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg transition-colors"
              >
                Crear Primera Auditoría
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
