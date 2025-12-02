-- Миграция типа комнат APP -> App
-- Обновляем существующие записи перед изменением enum

UPDATE rooms 
SET type = 'App' 
WHERE type = 'APP';

-- Теперь можно безопасно изменить enum в Prisma schema


