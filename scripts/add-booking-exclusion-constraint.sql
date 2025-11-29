-- ============================================
-- EXCLUDE CONSTRAINT ДЛЯ ПРЕДОТВРАЩЕНИЯ ПЕРЕСЕЧЕНИЙ БРОНИРОВАНИЙ
-- Предотвращает создание бронирований с пересекающимися датами для одной комнаты
-- ============================================

-- Сначала создаем расширение btree_gist, если его еще нет
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Удаляем constraint, если он уже существует (для повторного запуска)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bookings_no_overlap'
    ) THEN
        ALTER TABLE bookings DROP CONSTRAINT bookings_no_overlap;
    END IF;
END $$;

-- Создаем EXCLUDE constraint, который предотвращает пересечения дат для одной комнаты
-- Используем оператор && для проверки пересечения диапазонов дат
ALTER TABLE bookings 
ADD CONSTRAINT bookings_no_overlap 
EXCLUDE USING gist (
    room_id WITH =,
    daterange(check_in, check_out, '[]') WITH &&
);

-- Комментарий к constraint
COMMENT ON CONSTRAINT bookings_no_overlap ON bookings IS 
'Предотвращает создание бронирований с пересекающимися датами для одной комнаты. Использует daterange для проверки пересечений.';

