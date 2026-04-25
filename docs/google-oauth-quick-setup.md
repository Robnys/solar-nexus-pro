# Configuración Rápida de Google OAuth

## 🚀 Solución Inmediata

El error `"Unsupported provider: provider is not enabled"` significa que Google OAuth no está habilitado en Supabase.

## ⚡ Pasos para Arreglarlo

### 1. Habilitar Google en Supabase
1. Ve al dashboard de Supabase
2. Navega a **Authentication → Providers**
3. Busca **Google** y haz click en **Enable**
4. Configura las credenciales (puedes dejarlas vacías para testing inicial)

### 2. Obtener Credenciales de Google (Opcional para testing)
Si necesitas credenciales reales:

1. **Google Cloud Console** → **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth client ID**
3. **Application type**: Web application
4. **Authorized redirect URIs**:
   - `http://localhost:3000/auth/callback`
   - `https://[tu-proyecto].supabase.co/auth/v1/callback`

### 3. Variables de Entorno
Asegúrate de tener en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔥 Solución Temporal (Para Testing)

Puedes habilitar Google en Supabase **SIN** credenciales para testing:

1. Ve a **Authentication → Providers**
2. Habilita **Google**
3. Deja Client ID y Client Secret vacíos
4. Guarda

Esto permitirá que el flujo OAuth funcione en desarrollo.

## ⚠️ Nota Importante

- **Sin credenciales reales**: Solo funciona en desarrollo
- **Producción**: Necesitas credenciales reales de Google
- **Rate limiting**: No hay límites con OAuth (vs email)

## 🎯 Resultado Esperado

Una vez configurado, el botón "Continuar con Google" funcionará y mostrará:
- Selección de cuentas Google
- Acceso instantáneo sin verificación
- Redirección automática al dashboard
