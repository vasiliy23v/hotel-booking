-- Безопасная миграция APP -> App
-- Шаг 1: Добавляем новое значение в enum (если его еще нет)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'App' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'RoomType')
    ) THEN
        ALTER TYPE "RoomType" ADD VALUE 'App';
    END IF;
END $$;

-- Шаг 2: Обновляем все записи с APP на App
-- Используем временное преобразование через текст
UPDATE rooms 
SET type = 'App'::text::"RoomType"
WHERE type::text = 'APP';

-- Теперь можно безопасно удалить старое значение APP из enum
-- (но это нужно делать вручную через Prisma после проверки данных)


