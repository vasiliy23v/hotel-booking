# Упрощение модели комнаты - убираем избыточные поля

## Проблема

Сейчас в модели комнаты есть избыточность:
- `capacity: string` - "1-2 чел." (текстовое описание)
- `maxCapacity: number` - 2 (реальное число)
- `beds: string[]` - ["1 двуспальная", "1 односпальная"]

Это создает путаницу и усложняет код.

## Решение

### Вариант 1: Минимальный (рекомендуется)
Оставить только:
- `maxCapacity: number` - максимальная вместимость (для логики бронирования)
- `description: string` - всё остальное (кровати, удобства и т.д.)

### Вариант 2: С разделением
- `maxCapacity: number` - для логики
- `beds: string` - одной строкой "2 двуспальные, 1 односпальная"
- `description: string` - общее описание

## Миграция БД (Вариант 1)

```sql
-- Шаг 1: Перенести данные из capacity и beds в description
UPDATE rooms 
SET description = CONCAT(
  COALESCE(description, ''),
  '\n',
  'Вместимость: ', capacity,
  '\nКровати: ', ARRAY_TO_STRING(beds::text[], ', ')
)
WHERE description IS NULL OR description = '';

-- Шаг 2: Удалить старые поля
ALTER TABLE rooms DROP COLUMN capacity;
ALTER TABLE rooms DROP COLUMN beds;
```

## Обновление Prisma Schema

```prisma
model Room {
  id          String      @id
  number      String      @db.VarChar(50)
  hotelId     String      @map("hotel_id")
  name        String?
  type        RoomType
  maxCapacity Int         @map("max_capacity")  // Только это для логики
  // capacity удалено
  // beds удалено
  floor       FloorType
  price       Decimal     @default(0) @db.Decimal(10, 2)
  description String?     // Сюда всё: кровати, удобства, особенности
  // ... остальные поля
}
```

## Обновление TypeScript типов

```typescript
export interface Room {
  id: string;
  number: string;
  hotelId: string;
  name?: string;
  type: 'FZ' | 'DZ' | 'EZ' | 'MZ' | 'App' | 'COMMON';
  maxCapacity: number;  // Только это
  // capacity: удалено
  // beds: удалено
  floor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG';
  price: number;
  description?: string; // Всё остальное сюда
  // ... остальные поля
}
```

## Обновление UI (RoomEditModal)

```typescript
const [formData, setFormData] = useState({
  number: room?.number || '',
  name: room?.name || '',
  type: room?.type || 'DZ',
  maxCapacity: room?.maxCapacity || 2,  // Простое число
  // capacity: удалено
  // beds: удалено
  price: room?.price || 0,
  description: room?.description || '', // Здесь описываем всё
  // ... остальные поля
});
```

UI форма:
```tsx
<div>
  <label>Вместимость (человек)</label>
  <input 
    type="number" 
    value={formData.maxCapacity}
    onChange={(e) => setFormData({...formData, maxCapacity: parseInt(e.target.value)})}
    min="1"
    max="20"
  />
</div>

<div>
  <label>Описание (кровати, удобства и т.д.)</label>
  <textarea
    value={formData.description}
    onChange={(e) => setFormData({...formData, description: e.target.value})}
    placeholder="Например: 1 двуспальная кровать, 1 диван, душ, туалет, телевизор"
    rows={4}
  />
</div>
```

## Преимущества

✅ **Проще код** - меньше полей, меньше путаницы  
✅ **Гибкость** - в description можно писать что угодно  
✅ **Понятнее** - maxCapacity для логики, description для людей  
✅ **Меньше ошибок** - не нужно синхронизировать capacity и maxCapacity  

## Недостатки

❌ **Нет структуры** для кроватей - но это нам и не нужно  
❌ **Нужна миграция** существующих данных  

## План внедрения

1. Создать резервную копию БД
2. Выполнить миграцию данных (перенести в description)
3. Обновить Prisma schema
4. Обновить TypeScript типы
5. Обновить UI компоненты
6. Обновить тесты
7. Проверить что всё работает
8. Удалить старые поля из БД

## Альтернатива (если не хотите трогать БД)

Просто игнорировать `capacity` и `beds`, использовать только:
- `maxCapacity` - для логики
- `description` - для всего остального

Оставить старые поля в БД как deprecated, но не использовать в коде.



