/**
 * Пример создания приглашения
 * 
 * Этот файл демонстрирует, как создавать приглашения программно.
 * Можно использовать в админ-панели или консольных скриптах.
 */

import { api } from '@/lib/api';

// Пример 1: Создание приглашения без привязки к email
async function createOpenInvite(adminId: string) {
  try {
    const invite = await api.createInvite(
      undefined, // email не указан
      7, // срок действия 7 дней
      adminId // ID администратора
    );
    
    console.log('Приглашение создано:');
    console.log('URL:', invite.inviteUrl);
    console.log('Токен:', invite.token);
    console.log('Истекает:', invite.expiresAt);
    
    return invite;
  } catch (error) {
    console.error('Ошибка при создании приглашения:', error);
    throw error;
  }
}

// Пример 2: Создание приглашения для конкретного email
async function createEmailInvite(email: string, adminId: string) {
  try {
    const invite = await api.createInvite(
      email, // email привязан к приглашению
      14, // срок действия 14 дней
      adminId
    );
    
    console.log(`Приглашение для ${email} создано:`, invite.inviteUrl);
    
    // Здесь можно отправить email с приглашением
    // await sendInviteEmail(email, invite.inviteUrl);
    
    return invite;
  } catch (error) {
    console.error('Ошибка при создании приглашения:', error);
    throw error;
  }
}

// Пример 3: Массовое создание приглашений
async function createBulkInvites(emails: string[], adminId: string) {
  const invites = await Promise.all(
    emails.map(email => createEmailInvite(email, adminId))
  );
  
  console.log(`Создано ${invites.length} приглашений`);
  return invites;
}

// Пример использования в компоненте React
export function InviteGenerator() {
  const handleCreateInvite = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser.id) {
      alert('Необходимо войти в систему');
      return;
    }
    
    try {
      const invite = await api.createInvite(
        undefined,
        7,
        currentUser.id
      );
      
      // Показать модальное окно с ссылкой
      alert(`Приглашение создано!\nСсылка: ${invite.inviteUrl}`);
      
      // Или скопировать в буфер обмена
      navigator.clipboard.writeText(invite.inviteUrl);
      alert('Ссылка скопирована в буфер обмена!');
    } catch (error) {
      alert('Ошибка при создании приглашения');
      console.error(error);
    }
  };
  
  return (
    <button onClick={handleCreateInvite}>
      Создать приглашение
    </button>
  );
}






