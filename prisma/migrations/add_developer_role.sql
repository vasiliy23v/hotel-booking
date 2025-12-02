-- Добавление роли 'developer' в enum UserRole
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'developer';


