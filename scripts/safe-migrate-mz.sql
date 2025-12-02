-- Безопасная миграция: добавление MZ в enum RoomType
-- Этот скрипт безопасно добавляет новое значение MZ в enum RoomType
-- БЕЗ потери данных и БЕЗ сброса базы данных

-- Шаг 1: Добавляем новое значение MZ в enum (если его еще нет)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'MZ' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'RoomType')
    ) THEN
        ALTER TYPE "RoomType" ADD VALUE 'MZ';
        RAISE NOTICE 'Значение MZ успешно добавлено в enum RoomType';
    ELSE
        RAISE NOTICE 'Значение MZ уже существует в enum RoomType';
    END IF;
END $$;

-- Проверяем результат
SELECT enumlabel as "Типы комнат" 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'RoomType')
ORDER BY enumsortorder;


