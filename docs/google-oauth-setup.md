# Configuración de Google OAuth para SolarNexus Pro

## Pasos para configurar en Supabase

### 1. Obtener Credenciales de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilítala
4. Crea credenciales OAuth 2.0:
   - Ve a "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Selecciona "Web application"
   - Agrega los siguientes URIs redireccionados:
     - `http://localhost:3000/auth/callback`
     - `https://[tu-dominio].supabase.co/auth/v1/callback`
   - Copia el Client ID y Client Secret

### 2. Configurar en Supabase

1. Ve al dashboard de Supabase
2. Navega a "Authentication" > "Providers"
3. Habilita el proveedor "Google"
4. Ingresa el Client ID y Client Secret de Google
5. Configura el Site URL: `http://localhost:3000` (para desarrollo)
6. Habilita "Skip email confirmation" para usuarios de Google

### 3. Ejecutar el Schema SQL

Ejecuta el archivo `database/google-auth-schema.sql` en el editor SQL de Supabase para crear:
- Tabla `user_profiles` para manejar usuarios de Google
- Triggers automáticos para crear perfiles
- Políticas RLS para seguridad

### 4. Variables de Entorno

Asegúrate de tener en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Flujo de Usuario

### Registro con Google
1. Usuario hace click en "Continuar con Google"
2. Redirección a Google para seleccionar cuenta
3. Google redirige de vuelta a la app
4. Si es usuario nuevo, se le pide configurar contraseña opcional
5. Acceso directo al dashboard

### Login Rápido
- Usuarios existentes con Google acceden directamente
- No requiere verificación de email
- Sesión persistente con refresh tokens

### Contraseña Opcional
- Usuarios de Google pueden configurar contraseña para acceso tradicional
- Permite login con email + contraseña como fallback
- Útil si no tienen acceso a la cuenta de Google

## Beneficios

✅ **Sin verificación de email** - Google verifica la identidad
✅ **Acceso rápido** - Un solo click para login
✅ **Seguro** - OAuth 2.0 estándar de la industria
✅ **Flexible** - Opción de contraseña como fallback
✅ **Profesional** - Como las grandes aplicaciones modernas
