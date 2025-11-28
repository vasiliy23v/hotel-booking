-- ============================================
-- SQL СХЕМА ДЛЯ NEON POSTGRESQL
-- Миграция с JSON файловой системы на PostgreSQL
-- ============================================

-- Создание расширений (если нужно)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS (Пользователи)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'guest')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- HOTELS (Отели)
-- ============================================
CREATE TABLE IF NOT EXISTS hotels (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  floors INTEGER,
  image VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROOMS (Комнаты)
-- ============================================
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(255) PRIMARY KEY,
  number VARCHAR(50) NOT NULL,
  hotel_id VARCHAR(255) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name VARCHAR(255),
  type VARCHAR(20) NOT NULL CHECK (type IN ('FZ', 'DZ', 'EZ', 'COMMON')),
  capacity VARCHAR(50) NOT NULL,
  max_capacity INTEGER NOT NULL,
  beds JSONB DEFAULT '[]'::jsonb,
  floor VARCHAR(10) NOT NULL CHECK (floor IN ('EG', '1OG', '2OG')),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
  width INTEGER,
  height INTEGER,
  is_common BOOLEAN DEFAULT FALSE,
  z_index INTEGER DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(type);

-- ============================================
-- BOOKINGS (Бронирования)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(255) PRIMARY KEY,
  room_id VARCHAR(255) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  booked_by VARCHAR(255) NOT NULL,
  booked_date TIMESTAMP WITH TIME ZONE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  -- Подтверждение бронирования
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_by VARCHAR(255),
  confirmed_date TIMESTAMP WITH TIME ZONE,
  -- Оплата
  is_paid BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'transfer')),
  payment_date TIMESTAMP WITH TIME ZONE,
  paid_by VARCHAR(255),
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_is_paid ON bookings(is_paid);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_method ON bookings(payment_method);

-- ============================================
-- STAIRS (Лестницы)
-- ============================================
CREATE TABLE IF NOT EXISTS stairs (
  id VARCHAR(255) PRIMARY KEY,
  hotel_id VARCHAR(255) NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  floor VARCHAR(10) NOT NULL CHECK (floor IN ('EG', '1OG', '2OG')),
  position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('up', 'down', 'both')),
  target_floor VARCHAR(10) CHECK (target_floor IN ('EG', '1OG', '2OG')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stairs_hotel_id ON stairs(hotel_id);
CREATE INDEX IF NOT EXISTS idx_stairs_floor ON stairs(floor);

-- ============================================
-- INVITES (Приглашения)
-- ============================================
CREATE TABLE IF NOT EXISTS invites (
  id VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  created_by VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  name VARCHAR(255) NOT NULL,
  used_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_invites_token ON invites(token);
CREATE INDEX IF NOT EXISTS idx_invites_created_by ON invites(created_by);
CREATE INDEX IF NOT EXISTS idx_invites_used ON invites(used);
CREATE INDEX IF NOT EXISTS idx_invites_expires_at ON invites(expires_at);

-- ============================================
-- ФУНКЦИИ ДЛЯ АВТОМАТИЧЕСКОГО ОБНОВЛЕНИЯ updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stairs_updated_at BEFORE UPDATE ON stairs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


