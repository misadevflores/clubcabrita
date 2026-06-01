-- Club Cabritas Database Schema
-- Migration: 001_initial_schema.sql
-- Created: 2026-06-01

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- ROUTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS routes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(100) NOT NULL,
    image TEXT,
    description TEXT,
    difficulty VARCHAR(50),
    distance DECIMAL(10, 2),
    duration VARCHAR(100),
    location VARCHAR(255),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id)
);

CREATE INDEX idx_routes_date ON routes(date);
CREATE INDEX idx_routes_type ON routes(type);
CREATE INDEX idx_routes_is_published ON routes(is_published);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id)
);

CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_gallery_is_published ON gallery(is_published);
CREATE INDEX idx_gallery_display_order ON gallery(display_order);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(setting_key);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_replied BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    image TEXT,
    capacity INTEGER,
    registered_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id)
);

CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_is_published ON events(is_published);

-- ============================================
-- EVENT REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    number_of_people INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON event_registrations(email);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, is_active)
VALUES ('admin', 'admin@clubcabritas.com', '$2a$10$YourHashedPasswordHere', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, description)
VALUES 
    ('site_name', 'Club Cabritas', 'Nombre del sitio'),
    ('site_description', 'Explora las mejores rutas de senderismo', 'Descripción del sitio'),
    ('contact_email', 'info@clubcabritas.com', 'Email de contacto'),
    ('phone', '+34 XXX XXX XXX', 'Teléfono de contacto'),
    ('address', 'Ubicación del club', 'Dirección'),
    ('facebook_url', '', 'URL de Facebook'),
    ('instagram_url', '', 'URL de Instagram'),
    ('twitter_url', '', 'URL de Twitter'),
    ('maintenance_mode', 'false', 'Modo mantenimiento')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Routes: Public can read published, only admins can write
CREATE POLICY "Routes are public readable" ON routes
    FOR SELECT USING (is_published = true);

CREATE POLICY "Routes admin write" ON routes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Gallery: Public can read published, only admins can write
CREATE POLICY "Gallery is public readable" ON gallery
    FOR SELECT USING (is_published = true);

CREATE POLICY "Gallery admin write" ON gallery
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Settings: Public can read, only admins can write
CREATE POLICY "Settings are public readable" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Settings admin write" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Contact messages: Anyone can insert, only admins can read
CREATE POLICY "Contact messages anyone can insert" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages admin can read" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

-- Events: Public can read published, only admins can write
CREATE POLICY "Events are public readable" ON events
    FOR SELECT USING (is_published = true);

CREATE POLICY "Events admin write" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Event registrations: Anyone can register, admins can read
CREATE POLICY "Event registrations anyone can insert" ON event_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Event registrations admin can read" ON event_registrations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Audit logs: Only admins can read
CREATE POLICY "Audit logs admin only" ON audit_logs
    FOR SELECT USING (auth.role() = 'authenticated');
