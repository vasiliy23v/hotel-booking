-- ============================================
-- ИСПРАВЛЕНИЕ ENUM ТИПОВ В БАЗЕ ДАННЫХ
-- Преобразование VARCHAR с CHECK в настоящие enum типы
-- ============================================

-- Создаем enum типы
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('manager', 'guest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "RoomType" AS ENUM ('FZ', 'DZ', 'EZ', 'COMMON');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "FloorType" AS ENUM ('EG', '1OG', '2OG');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "StairsDirection" AS ENUM ('up', 'down', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Преобразуем колонки в enum типы
-- users.role
ALTER TABLE users 
  ALTER COLUMN role TYPE "UserRole" USING role::"UserRole";

-- rooms.type
ALTER TABLE rooms 
  ALTER COLUMN type TYPE "RoomType" USING type::"RoomType";

-- rooms.floor
ALTER TABLE rooms 
  ALTER COLUMN floor TYPE "FloorType" USING floor::"FloorType";

-- stairs.floor
ALTER TABLE stairs 
  ALTER COLUMN floor TYPE "FloorType" USING floor::"FloorType";

-- stairs.target_floor
ALTER TABLE stairs 
  ALTER COLUMN target_floor TYPE "FloorType" USING target_floor::"FloorType";

-- stairs.direction
ALTER TABLE stairs 
  ALTER COLUMN direction TYPE "StairsDirection" USING direction::"StairsDirection";

-- bookings.payment_method
ALTER TABLE bookings 
  ALTER COLUMN payment_method TYPE "PaymentMethod" USING payment_method::"PaymentMethod";



