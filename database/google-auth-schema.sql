-- Tabla para perfiles de usuarios con Google OAuth
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  auth_provider VARCHAR(50) DEFAULT 'email',
  password_set BOOLEAN DEFAULT false,
  google_email VARCHAR(255),
  google_name VARCHAR(255),
  google_avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean su propio perfil
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios solo inserten su propio perfil
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios solo actualicen su propio perfil
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para crear perfil automáticamente cuando se registra con Google
CREATE OR REPLACE FUNCTION create_google_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo crear si es un nuevo usuario de Google
    IF NEW.raw_user_meta_data->>'provider' = 'google' THEN
        INSERT INTO user_profiles (user_id, auth_provider, google_email, google_name, google_avatar_url, password_set)
        VALUES (
            NEW.id,
            'google',
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
            NEW.raw_user_meta_data->>'avatar_url',
            false
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_google_user_profile();

-- Desactivar verificación de email para usuarios de Google
-- Esto se manejará en el código cliente
