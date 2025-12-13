# 🗄️ Руководство по Backup базы данных

## 🎯 Быстрый старт

### Создать backup ПРЯМО СЕЙЧАС:

```bash
npm run backup create
```

**Это создаст:**
- ✅ JSON файл со всеми данными (всегда работает)
- ✅ SQL dump (если установлен PostgreSQL)
- 💡 Инструкцию для Neon snapshot

**Файлы сохраняются в:** `backups/backup_YYYY-MM-DD-HH-MM-SS.json`

## 📖 Команды

### 1. Создать backup

```bash
npm run backup create
```

**Что создается:**
- `backup_2024-01-13-15-30-00.json` - JSON со всеми данными
- `backup_2024-01-13-15-30-00.sql` - SQL dump (если pg_dump установлен)

**Что включено в backup:**
- ✅ Все пользователи (users)
- ✅ Все отели (hotels)
- ✅ Все комнаты (rooms)
- ✅ Все бронирования (bookings)
- ✅ Все лестницы (stairs)
- ✅ Все приглашения (invites)
- ✅ Все отзывы (feedback)
- ✅ Токены регистрации (registrationTokens)
- ✅ Диапазоны дат (bookingDateRanges)

### 2. Просмотреть список backups

```bash
npm run backup list
```

**Пример вывода:**
```
📋 Существующие backups:

   📄 backup_2024-01-13-15-30-00.json
      Тип: JSON
      Размер: 2.45 MB
      Дата: 13.01.2024, 15:30:00

   📄 backup_2024-01-12-10-15-00.sql
      Тип: SQL
      Размер: 5.67 MB
      Дата: 12.01.2024, 10:15:00

   Всего backups: 2
```

### 3. Восстановить из backup

```bash
npm run backup restore backup_2024-01-13-15-30-00.json
```

**⚠️ ВНИМАНИЕ:** Это удалит все текущие данные и заменит их из backup!

## 🔐 Безопасность backups

### ⚠️ ВАЖНО: НЕ коммитить backups в Git!

Backups содержат чувствительные данные:
- Email пользователей
- Телефоны
- Пароли (хэши)
- Личную информацию

**Backups уже добавлены в `.gitignore`:**
```
/backups/
*.sql
backup_*.json
```

### ✅ Где хранить backups:

1. **Локально (временно):**
   - `backups/` директория в проекте
   - Автоматически игнорируется Git

2. **Облако (рекомендуется):**
   - Google Drive (создайте папку "DB Backups")
   - Dropbox
   - AWS S3 / Yandex Object Storage
   - OneDrive

3. **Внешний диск:**
   - USB флешка
   - Внешний HDD

4. **Neon Snapshots:**
   - Автоматические snapshots в Neon
   - Хранятся на серверах Neon
   - Восстановление в 1 клик

## 📅 Когда создавать backup

### Обязательно:

✅ **ПЕРЕД миграцией данных**
```bash
npm run backup create
# Подождать завершения
# Скопировать backups/ в безопасное место
# Только потом запускать миграцию
```

✅ **ПЕРЕД удалением колонок**
```bash
npm run backup create
# Это последняя точка безопасного возврата
```

✅ **ПЕРЕД деплоем в production**
```bash
npm run backup create
```

### Регулярно:

📅 **Автоматически (рекомендуется):**
- Настройте CRON на сервере
- Или используйте Neon Auto-Backups
- Раз в день в 3:00 ночи

📅 **Вручную:**
- Раз в неделю
- После важных изменений
- Перед большими обновлениями

## 🔄 Типы backups

### 1. JSON Backup (через Prisma)

**Плюсы:**
- ✅ Всегда работает
- ✅ Не требует установки PostgreSQL
- ✅ Быстрый
- ✅ Легко читать и редактировать
- ✅ Кросс-платформенный

**Минусы:**
- ❌ Больше размер файла
- ❌ Не содержит структуру БД (только данные)

**Когда использовать:**
- Backup данных перед миграцией
- Перенос данных между окружениями
- Быстрый snapshot для отката

### 2. SQL Dump (через pg_dump)

**Плюсы:**
- ✅ Полный backup (структура + данные)
- ✅ Меньший размер (сжатие)
- ✅ Стандартный формат PostgreSQL
- ✅ Можно восстановить в любую PostgreSQL БД

**Минусы:**
- ❌ Требует установки PostgreSQL
- ❌ Специфичен для PostgreSQL
- ❌ Дольше создается

**Когда использовать:**
- Полный backup для production
- Перенос на другой сервер
- Долгосрочное хранение

**Установка pg_dump:**
- **Windows:** https://www.postgresql.org/download/windows/
- **Mac:** `brew install postgresql`
- **Linux:** `sudo apt install postgresql-client`

### 3. Neon Snapshots

**Плюсы:**
- ✅ Полный snapshot на уровне сервера
- ✅ Быстрое восстановление
- ✅ Автоматические ежедневные backups
- ✅ Point-in-time recovery

**Минусы:**
- ❌ Только для Neon хостинга
- ❌ Требует платного плана для retention

**Как создать:**
1. Откройте https://console.neon.tech
2. Выберите ваш проект
3. Settings → Backups
4. "Create Snapshot"

## 🔧 Восстановление

### Из JSON backup:

```bash
npm run backup restore backup_2024-01-13.json
# Введите: yes для подтверждения
```

**Что произойдет:**
1. Все текущие данные удаляются
2. Данные из backup восстанавливаются
3. Показывается статистика

### Из SQL dump:

```bash
# Вариант 1: Через командную строку
psql $DATABASE_URL < backups/backup_2024-01-13.sql

# Вариант 2: Через Neon Dashboard
# 1. Откройте SQL Editor в Neon
# 2. Скопируйте содержимое .sql файла
# 3. Выполните
```

### Из Neon Snapshot:

1. Откройте Neon Console
2. Settings → Backups
3. Выберите snapshot
4. "Restore to branch" или "Restore to main"

## 🧪 Проверка backup

### Тест восстановления (рекомендуется):

```bash
# 1. Создайте backup
npm run backup create

# 2. Создайте тестовую БД
# (в Neon Dashboard создайте новую ветку)

# 3. Восстановите в тестовую БД
DATABASE_URL="postgresql://test-connection" npm run backup restore backup_*.json

# 4. Проверьте данные
DATABASE_URL="postgresql://test-connection" npm run check:db
```

## 📊 Размеры backups

Примерные размеры для разных объемов:

| Комнат | Бронирований | JSON | SQL | 
|--------|-------------|------|-----|
| 50     | 100         | 1 MB | 500 KB |
| 200    | 1000        | 5 MB | 2 MB |
| 500    | 5000        | 15 MB | 6 MB |
| 1000   | 10000       | 30 MB | 12 MB |

## 🗂️ Организация backups

### Рекомендуемая структура:

```
backups/
├── before_capacity_migration/
│   ├── backup_2024-01-13-14-00-00.json
│   └── backup_2024-01-13-14-00-00.sql
├── production/
│   ├── daily/
│   │   ├── backup_2024-01-13.json
│   │   ├── backup_2024-01-12.json
│   │   └── backup_2024-01-11.json
│   └── weekly/
│       ├── backup_2024-W02.json
│       └── backup_2024-W01.json
└── dev/
    └── backup_latest.json
```

### Создайте директории:

```bash
mkdir -p backups/before_capacity_migration
mkdir -p backups/production/daily
mkdir -p backups/production/weekly
mkdir -p backups/dev
```

### Автоматическая организация (bash):

```bash
#!/bin/bash
# save-backup.sh

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="backups/production/daily"

# Создать backup
npm run backup create

# Переместить в правильную папку
mv backups/backup_*.json "$BACKUP_DIR/backup_$DATE.json"

# Удалить старые (старше 7 дней)
find "$BACKUP_DIR" -name "backup_*.json" -mtime +7 -delete

echo "✅ Backup сохранен в $BACKUP_DIR/backup_$DATE.json"
```

## 🤖 Автоматизация

### CRON job (Linux/Mac):

```bash
# Редактировать crontab
crontab -e

# Добавить строку (каждый день в 3:00 AM)
0 3 * * * cd /path/to/project && npm run backup create && cp backups/backup_*.json /safe/location/
```

### GitHub Actions (опционально):

```yaml
# .github/workflows/backup.yml
name: Daily Backup

on:
  schedule:
    - cron: '0 3 * * *'  # 3:00 AM UTC
  workflow_dispatch:  # Ручной запуск

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run backup create
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      - uses: actions/upload-artifact@v3
        with:
          name: db-backup
          path: backups/
          retention-days: 30
```

## ❓ FAQ

**Q: Как часто делать backup?**  
A: Минимум раз в неделю. Перед миграциями - обязательно.

**Q: Сколько хранить backups?**  
A: 
- Ежедневные - 7 дней
- Еженедельные - 1 месяц
- Перед миграциями - навсегда

**Q: Можно ли восстановить частично?**  
A: Нет, только полное восстановление. Для частичного - редактируйте JSON вручную.

**Q: Backup содержит пароли?**  
A: Да, хэши паролей. Храните безопасно!

**Q: Что если backup файл поврежден?**  
A: Поэтому нужно несколько backups и проверка восстановления.

## ✅ Чеклист перед миграцией

- [ ] Создан backup: `npm run backup create`
- [ ] Backup файл проверен (открывается, не пустой)
- [ ] Backup скопирован в безопасное место (облако)
- [ ] Записан путь к backup файлу: _________________
- [ ] Протестировано восстановление (опционально)
- [ ] Готов к миграции! ✅

---

**Помните:** Backup - это страховка. Лучше иметь и не нужно, чем нужно и не иметь! 🛡️




