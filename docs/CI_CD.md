# CI/CD Pipeline

## Обзор

Проект использует GitHub Actions для автоматизации тестирования и деплоя на Vercel.

## Workflow файлы

### 1. `.github/workflows/test.yml`

Отдельный workflow для запуска тестов при каждом push и pull request.

**Триггеры:**
- Push в `main`, `master`, `develop`
- Pull request в `main`, `master`, `develop`

**Шаги:**
1. Checkout кода
2. Установка Node.js 20
3. Установка зависимостей (`npm ci`)
4. Генерация Prisma Client
5. Запуск линтера (`npm run lint`)
6. Запуск тестов (`npm test`)

### 2. `.github/workflows/vercel-deploy.yml`

Основной пайплайн для тестирования, сборки и деплоя.

**Триггеры:**
- Push в `main`, `master`
- Pull request в `main`, `master`

**Jobs:**

#### `test` - Запуск тестов
- Линтер
- Unit тесты
- Должен пройти успешно перед сборкой

#### `build-and-deploy` - Сборка приложения
- Зависит от успешного выполнения `test`
- Проверка подключения к БД
- Сборка Next.js приложения
- Проверка артефактов сборки

#### `deploy` - Деплой на Vercel
- Зависит от успешного выполнения `build-and-deploy`
- Выполняется только для `main`/`master` веток
- Деплой в production на Vercel

## Порядок выполнения

```
Push/PR
  ↓
test (lint + tests)
  ↓ (если успешно)
build-and-deploy (check DB + build)
  ↓ (если успешно)
deploy (только для main/master)
```

## Настройка Secrets

Добавьте следующие secrets в GitHub репозиторий:

**Settings → Secrets and variables → Actions → New repository secret**

### Обязательные secrets:

1. **DATABASE_URL**
   - URL подключения к базе данных
   - Используется для генерации Prisma Client и проверки подключения

2. **VERCEL_TOKEN**
   - Токен для доступа к Vercel API
   - Получить: Vercel Dashboard → Settings → Tokens

3. **VERCEL_ORG_ID**
   - ID организации в Vercel
   - Найти в URL Vercel Dashboard

4. **VERCEL_PROJECT_ID**
   - ID проекта в Vercel
   - Найти в настройках проекта Vercel

### Опциональные secrets:

5. **TEST_DATABASE_URL**
   - URL тестовой базы данных
   - Используется для запуска тестов с БД (если настроено)

## Поведение тестов в CI/CD

### Безопасное поведение

В CI/CD окружении тесты работают безопасно:

1. **Тесты без БД:**
   - Запускаются всегда
   - Проверяют структуру кода и конфигурацию
   - Не требуют сервера или БД

2. **Тесты с БД:**
   - Пропускаются автоматически (без `ALLOW_DB_TESTS`)
   - Если `TEST_DATABASE_URL` установлен, тесты проверят конфигурацию
   - Сервер не запущен в CI/CD, поэтому тесты с БД будут пропущены

### Почему тесты с БД пропускаются?

- В CI/CD нет запущенного сервера Next.js
- Тесты требуют HTTP запросы к `http://localhost:3000`
- Это нормально - тесты проверяют конфигурацию без реального выполнения

## Локальный запуск пайплайна

Для проверки пайплайна локально используйте [act](https://github.com/nektos/act):

```bash
# Установка act
brew install act  # macOS
# или
choco install act-cli  # Windows

# Запуск тестового workflow
act -j test

# Запуск полного пайплайна
act -j build-and-deploy
```

## Мониторинг

### Просмотр статуса

1. Откройте репозиторий на GitHub
2. Перейдите в **Actions** вкладку
3. Выберите нужный workflow run
4. Просмотрите логи каждого шага

### Badge статуса

Добавьте badge в README.md:

```markdown
![Tests](https://github.com/your-username/hotel-nextjs/workflows/Tests/badge.svg)
![Deploy](https://github.com/your-username/hotel-nextjs/workflows/Vercel%20Deploy%20Pipeline/badge.svg)
```

## Troubleshooting

### Тесты падают в CI/CD

**Проблема:** Тесты не проходят в GitHub Actions

**Решение:**
1. Проверьте логи в GitHub Actions
2. Убедитесь, что все зависимости установлены
3. Проверьте, что Prisma Client сгенерирован
4. Убедитесь, что `DATABASE_URL` установлен в Secrets

### Деплой не происходит

**Проблема:** Деплой не запускается после успешной сборки

**Решение:**
1. Проверьте, что вы в ветке `main` или `master`
2. Убедитесь, что все secrets установлены
3. Проверьте логи job `deploy`
4. Убедитесь, что Vercel токены валидны

### Ошибки сборки

**Проблема:** Сборка падает с ошибками

**Решение:**
1. Проверьте логи job `build-and-deploy`
2. Убедитесь, что `DATABASE_URL` доступен
3. Проверьте, что миграции применены
4. Убедитесь, что все зависимости совместимы

## Отключение автоматического деплоя

Если нужно временно отключить автоматический деплой:

1. Откройте `.github/workflows/vercel-deploy.yml`
2. Закомментируйте job `deploy`:

```yaml
# deploy:
#   name: Deploy to Vercel
#   ...
```

Или добавьте условие:

```yaml
deploy:
  if: false  # Отключить деплой
```

## Ручной запуск workflow

Для ручного запуска workflow:

1. Откройте репозиторий на GitHub
2. Перейдите в **Actions**
3. Выберите нужный workflow
4. Нажмите **Run workflow**
5. Выберите ветку и нажмите **Run workflow**

## Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git)
- [Jest CI Configuration](https://jestjs.io/docs/ci)

