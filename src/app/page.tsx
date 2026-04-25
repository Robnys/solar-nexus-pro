import Link from "next/link";
import { Sun, Zap, Shield, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-slate-900 to-slate-900"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.emerald.500/10),transparent_70%)]"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-3xl mb-8">
            <Sun className="h-10 w-10 text-slate-950" />
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            SolarNexus <span className="text-emerald-500">Pro</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Plataforma profesional para instaladores solares. Gestiona auditorías, 
            calcula ahorros y transforma leads en clientes.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
              <Zap className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Auditorías Rápidas</h3>
              <p className="text-slate-400">Análisis instantáneos de consumo y potencial solar</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
              <Shield className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Datos Seguros</h3>
              <p className="text-slate-400">Tus datos privados con autenticación segura</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl">
              <Users className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Usuario</h3>
              <p className="text-slate-400">Cada instalador con su cuenta privada</p>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] group"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/dashboard/new"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl transition-all duration-200"
            >
              Dashboard Nuevo
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm">100% Privado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm">Sin Costes Ocultos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm">Soporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
