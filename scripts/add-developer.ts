/**
 * Скрипт для добавления роли разработчика пользователю
 * 
 * Использование:
 * npx tsx scripts/add-developer.ts <user-identifier>
 * 
 * Где user-identifier - это email, телефон или ID пользователя
 */

import { prisma } from '../lib/prisma';

async function addDeveloperRole(identifier: string) {
  try {
    // Сначала проверяем, существует ли значение 'developer' в enum
    console.log('Проверка enum UserRole...');
    
    // Ищем пользователя по email, телефону или ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { id: identifier }
        ]
      }
    });

    if (!user) {
      console.error(`Пользователь с идентификатором "${identifier}" не найден`);
      process.exit(1);
    }

    console.log(`Найден пользователь: ${user.name} (${user.email || user.phone})`);
    console.log(`Текущая роль: ${user.role}`);

    if (user.role === 'developer') {
      console.log('Пользователь уже имеет роль разработчика');
      process.exit(0);
    }

    // Обновляем роль на developer
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'developer' }
    });

    console.log('✅ Роль разработчика успешно добавлена!');
    console.log(`Пользователь ${user.name} теперь имеет роль разработчика`);
  } catch (error) {
    console.error('Ошибка при добавлении роли разработчика:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Получаем аргумент командной строки
const identifier = process.argv[2];

if (!identifier) {
  console.error('Использование: npx tsx scripts/add-developer.ts <user-identifier>');
  console.error('Где user-identifier - это email, телефон или ID пользователя');
  process.exit(1);
}

addDeveloperRole(identifier);



