# Настройка Dev окружения на Vercel

## Обзор

Эта документация описывает как настроить отдельное окружение для разработки (dev) на Vercel, чтобы тестировать изменения перед деплоем в продакшн.

## Git Flow стратегия

### Структура веток

```
main (production) ← слияние только через Pull Request
  ↑
develop (staging/dev) ← основная ветка для разработки
  ↑
feature/* ← ветки для новых функций
hotfix/* ← срочные исправления
```

### Рабочий процесс

1. **Разработка новой функции:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature-name
   # ... делаем изменения ...
   git add .
   git commit -m "feat: добавлена новая функция"
   git push origin feature/new-feature-name
   ```

2. **Создание Pull Request:**
   - Создайте PR из `feature/new-feature-name` в `develop`
   - Дождитесь автоматического деплоя preview на Vercel
   - Протестируйте на preview окружении

3. **Слияние в develop:**
   - После проверки слейте PR в `develop`
   - Vercel автоматически задеплоит на dev окружение

4. **Деплой в production:**
   - Создайте PR из `develop` в `main`
   - Проведите финальное тестирование
   - После approve слейте в `main`

## Настройка на Vercel

### Шаг 1: Создание dev окружения

1. Откройте ваш проект на [vercel.com](https://vercel.com)
2. Перейдите в **Settings** → **Domains**
3. Добавьте отдельный домен для dev окружения (например, `dev-hotel.vercel.app`)

### Шаг 2: Настройка веток для деплоя

1. Перейдите в **Settings** → **Git**
2. В разделе **Production Branch** установите: `main`
3. В разделе **Deploy Hooks** создайте хук для ветки `develop`

### Шаг 3: Переменные окружения

Создайте отдельные переменные для каждого окружения:

#### Production (main)
```env
DATABASE_URL=postgresql://prod-connection-string
NEXT_PUBLIC_API_URL=https://hotel-production.vercel.app
NODE_ENV=production
```

#### Development (develop)
```env
DATABASE_URL=postgresql://dev-connection-string
NEXT_PUBLIC_API_URL=https://dev-hotel.vercel.app
NODE_ENV=development
```

**Важно:** В Vercel Settings → Environment Variables можно указать для каких веток действует каждая переменная.

### Шаг 4: Настройка отдельной БД для dev

Рекомендуется использовать отдельную БД для dev окружения:

1. В [Neon](https://neon.tech) создайте новый проект или отдельную ветку БД
2. Скопируйте connection string
3. Добавьте в переменные окружения для ветки `develop`

### Шаг 5: Автоматические деплои

Vercel автоматически деплоит:
- **Production**: при push/merge в ветку `main`
- **Preview**: при создании Pull Request
- **Development**: при push в ветку `develop` (если настроен Deploy Hook)

## Миграции БД

### Для dev окружения:

```bash
# Локально переключитесь на dev БД
DATABASE_URL="postgresql://dev-connection" npx prisma migrate dev

# Или через Vercel CLI
vercel env pull .env.development
npx prisma migrate dev
```

### Для production:

```bash
# Используйте Prisma migrate deploy в production
DATABASE_URL="postgresql://prod-connection" npx prisma migrate deploy
```

**Важно:** Никогда не используйте `prisma migrate dev` в production!

## Тестирование перед деплоем

### Чек-лист перед мержем в main:

- [ ] Код протестирован локально
- [ ] Все тесты проходят (`npm test`)
- [ ] Код прошел линтер (`npm run lint`)
- [ ] Протестировано на dev окружении Vercel
- [ ] Миграции БД протестированы на dev БД
- [ ] Проверена работа с медленным интернетом
- [ ] Нет критических ошибок в логах Vercel
- [ ] Протестированы основные user flow:
  - Создание/обновление комнаты
  - Создание бронирования
  - Отмена бронирования

## Мониторинг и логи

### Просмотр логов Vercel

1. В панели Vercel перейдите в **Deployments**
2. Выберите нужный деплой
3. Откройте **Function Logs** или **Build Logs**

### Встроенная система логирования

В проекте реализована система логирования действий пользователей:

```typescript
import { logActivity } from '@/lib/logger';

await logActivity({
  userId: user.id,
  userName: user.name,
  action: 'room_created',
  entity: 'room',
  entityId: room.id,
  status: 'success',
});
```

Просмотр логов: `/cms/logs` (только для менеджеров и разработчиков)

## Rollback (откат изменений)

Если что-то пошло не так:

1. В Vercel откройте **Deployments**
2. Найдите предыдущий рабочий деплой
3. Нажмите **⋯** → **Promote to Production**

Или через Git:
```bash
git revert <commit-hash>
git push origin main
```

## CI/CD с GitHub Actions (опционально)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Полезные команды

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Деплой в production
vercel --prod

# Деплой в preview
vercel

# Просмотр логов
vercel logs <deployment-url>

# Загрузка переменных окружения
vercel env pull

# Список деплоев
vercel ls
```

## Troubleshooting

### Проблема: База данных не синхронизирована

```bash
# Проверьте какая БД используется
echo $DATABASE_URL

# Примените миграции
npx prisma migrate deploy
npx prisma generate
```

### Проблема: Разные версии Node.js

Добавьте в `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Проблема: Медленные запросы к БД

- Используйте connection pooling (уже настроено в проекте)
- Проверьте индексы в БД
- Используйте `prisma.$queryRaw` для сложных запросов
- Включите логи медленных запросов в Neon

## Рекомендации

1. **Всегда тестируйте на dev окружении** перед деплоем в production
2. **Используйте preview деплои** для review кода в Pull Request
3. **Мониторьте логи** регулярно через `/cms/logs`
4. **Делайте резервные копии БД** перед большими миграциями
5. **Используйте feature flags** для постепенного раскатывания новых функций
6. **Настройте алерты** в Vercel для критических ошибок

## Контакты

При возникновении проблем:
- Проверьте логи на `/cms/logs`
- Посмотрите Function Logs в Vercel Dashboard
- Создайте issue в репозитории



