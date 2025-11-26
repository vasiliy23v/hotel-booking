# Система регистрации по приглашению

## 📋 Описание

Система регистрации по приглашению позволяет создавать аккаунты только по уникальным ссылкам-приглашениям. Прямая регистрация недоступна.

## 🏗️ Архитектура

### Компоненты системы

1. **Типы данных** (`types/index.ts`)
   - `Invite` - интерфейс приглашения

2. **Утилиты** (`lib/crypto.ts`)
   - Генерация токенов
   - Хэширование токенов
   - Проверка токенов

3. **API эндпоинты**
   - `POST /api/invites` - создание приглашения
   - `GET /api/invites` - получение списка приглашений
   - `GET /api/invites/verify?token=xxx` - проверка токена
   - `POST /api/users` - регистрация (требует токен)

4. **Страницы**
   - `/` - страница входа (регистрация удалена)
   - `/invite/[token]` - страница регистрации по приглашению

## 🔐 Безопасность

- Токены хэшируются перед сохранением в базу данных
- Использование `crypto.timingSafeEqual` для защиты от timing attacks
- Проверка срока действия приглашений
- Одноразовые токены (после использования помечаются как `used`)
- Возможность привязки приглашения к конкретному email

## 📝 Использование

### Создание приглашения

```typescript
import { api } from '@/lib/api';

// Создать приглашение без привязки к email
const invite = await api.createInvite(
  undefined, // email (необязательно)
  7, // срок действия в днях
  'admin-1' // ID создателя
);

console.log(invite.inviteUrl); // Ссылка для отправки пользователю
```

### Создание приглашения для конкретного email

```typescript
const invite = await api.createInvite(
  'user@example.com', // email
  7, // срок действия
  'admin-1' // ID создателя
);
```

### Регистрация по приглашению

Пользователь переходит по ссылке `/invite/[token]`, где:
- Токен автоматически проверяется
- Если токен валиден, показывается форма регистрации
- После регистрации токен помечается как использованный

## 🔧 API Reference

### POST /api/invites

Создает новое приглашение.

**Тело запроса:**
```json
{
  "email": "user@example.com", // необязательно
  "expiresInDays": 7, // необязательно, по умолчанию 7
  "createdBy": "admin-1" // обязательно
}
```

**Ответ:**
```json
{
  "id": "invite-1234567890",
  "token": "abc123...", // незахэшированный токен (только при создании)
  "inviteUrl": "http://localhost:3000/invite/abc123...",
  "expiresAt": "2024-01-15T12:00:00.000Z",
  "email": "user@example.com"
}
```

### GET /api/invites/verify?token=xxx

Проверяет валидность токена приглашения.

**Ответ (валидный токен):**
```json
{
  "valid": true,
  "invite": {
    "id": "invite-1234567890",
    "email": "user@example.com",
    "expiresAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Ответ (невалидный токен):**
```json
{
  "valid": false,
  "error": "Приглашение истекло"
}
```

### POST /api/users

Регистрирует нового пользователя. **Требует токен приглашения.**

**Тело запроса:**
```json
{
  "inviteToken": "abc123...", // обязательно
  "email": "user@example.com",
  "name": "Иван Иванов",
  "password": "password123",
  "phone": "+491234567890", // необязательно
  "role": "guest" // необязательно, по умолчанию "guest"
}
```

## 🧪 Тестирование

### 1. Создание приглашения

```bash
curl -X POST http://localhost:3000/api/invites \
  -H "Content-Type: application/json" \
  -d '{
    "createdBy": "admin-1",
    "expiresInDays": 7
  }'
```

### 2. Проверка токена

```bash
curl "http://localhost:3000/api/invites/verify?token=YOUR_TOKEN"
```

### 3. Регистрация по токену

Откройте в браузере: `http://localhost:3000/invite/YOUR_TOKEN`

## 🚀 Расширение системы

### Многоразовые токены

Для создания многоразовых токенов:

1. Добавьте поле `maxUses` в интерфейс `Invite`
2. Добавьте поле `useCount` для отслеживания использований
3. Обновите логику в `app/api/users/route.ts`:
   ```typescript
   if (invite.useCount >= invite.maxUses) {
     return NextResponse.json({ error: 'Достигнут лимит использований' }, { status: 400 });
   }
   invite.useCount++;
   ```

### Роли пользователей

Для назначения ролей через приглашение:

1. Добавьте поле `role` в интерфейс `Invite`
2. При регистрации используйте роль из приглашения:
   ```typescript
   const newUser: User = {
     ...userData,
     role: invite.role || 'guest'
   };
   ```

### Массовые приглашения

Для создания множества приглашений:

```typescript
async function createBulkInvites(emails: string[], createdBy: string) {
  const invites = await Promise.all(
    emails.map(email => api.createInvite(email, 7, createdBy))
  );
  return invites;
}
```

### Отправка приглашений по email

Интеграция с существующей системой email (`lib/email.ts`):

```typescript
import { sendEmail } from '@/lib/email';

const invite = await api.createInvite(email, 7, createdBy);
await sendEmail({
  to: email,
  subject: 'Приглашение в Hotel Booking',
  html: `
    <h1>Вы приглашены!</h1>
    <p>Перейдите по ссылке для регистрации:</p>
    <a href="${invite.inviteUrl}">${invite.inviteUrl}</a>
  `
});
```

## ⚙️ Конфигурация

### Переменные окружения

Добавьте в `.env.local`:

```env
INVITE_SECRET_KEY=your-secret-key-change-in-production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Важно:** В production используйте надежный секретный ключ!

## 📊 Структура данных

### Invite в базе данных

```json
{
  "id": "invite-1234567890",
  "token": "hashed_token_here",
  "createdBy": "admin-1",
  "createdAt": "2024-01-08T12:00:00.000Z",
  "expiresAt": "2024-01-15T12:00:00.000Z",
  "used": false,
  "email": "user@example.com",
  "usedBy": null,
  "usedAt": null
}
```

## 🔍 Отладка

### Проблемы и решения

1. **"Токен не найден"**
   - Проверьте, что токен передается корректно
   - Убедитесь, что приглашение было создано

2. **"Приглашение истекло"**
   - Создайте новое приглашение
   - Увеличьте срок действия при создании

3. **"Приглашение уже использовано"**
   - Каждый токен можно использовать только один раз
   - Создайте новое приглашение для нового пользователя

## 📚 Дополнительные ресурсы

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Node.js Crypto](https://nodejs.org/api/crypto.html)
