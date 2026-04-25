'use client'

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard de Prueba</h1>
      <p className="text-xl">¡El dashboard está funcionando!</p>
      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">Estado del Sistema</h2>
        <p>✅ OAuth funcionando</p>
        <p>✅ Dashboard cargando</p>
        <p>✅ Todo conectado</p>
      </div>
    </div>
  )
}
