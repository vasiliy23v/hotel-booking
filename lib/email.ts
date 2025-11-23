/**
 * Утилита для отправки email через Nodemailer, Resend API или SendPulse
 */

import nodemailer from 'nodemailer';
import sendpulse from 'sendpulse-api';
import path from 'path';
import fs from 'fs';

// Конфигурация SMTP из переменных окружения
const getSmtpConfig = () => {
  // Если SMTP не настроен, возвращаем null (будет использован демо-режим)
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true для 465, false для других портов
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };
};

// Создание транспортера для отправки email
const createTransporter = () => {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    // В демо-режиме не создаем transporter
    return null;
  }

  return nodemailer.createTransport(smtpConfig);
};

/**
 * Отправка кода подтверждения на email
 * @param email - Email адрес получателя
 * @param code - Код подтверждения
 * @returns Promise с результатом отправки
 */
export async function sendVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string; demo?: boolean }> {
  try {
    // Проверяем, какой способ отправки использовать (приоритет: SendPulse > Resend > SMTP)
    const useSendPulse = isSendPulseConfigured();
    const useResend = isResendConfigured();
    const useSmtp = isSmtpConfigured();
    const isDemo = !useSendPulse && !useResend && !useSmtp;

    // Отправитель (из переменных окружения или дефолтный)
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@hotel.com';
    const fromName = process.env.SMTP_FROM_NAME || 'Hotel Booking System';

    // HTML шаблон письма
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Код подтверждения email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏨 Hotel Booking</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <h2 style="color: #333; margin-top: 0;">Подтверждение email адреса</h2>
            
            <p style="font-size: 16px;">Здравствуйте!</p>
            
            <p style="font-size: 16px;">
              Вы зарегистрировались в системе бронирования отелей. 
              Для завершения регистрации введите следующий код подтверждения:
            </p>
            
            <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${code}
              </div>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              ⏰ Код действителен в течение <strong>10 минут</strong>.
            </p>
            
            <p style="font-size: 14px; color: #666;">
              Если вы не регистрировались в нашей системе, просто проигнорируйте это письмо.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
              Это автоматическое письмо, пожалуйста, не отвечайте на него.
            </p>
          </div>
        </body>
      </html>
    `;

    // Текстовая версия письма
    const textTemplate = `
Hotel Booking - Подтверждение email адреса

Здравствуйте!

Вы зарегистрировались в системе бронирования отелей.
Для завершения регистрации введите следующий код подтверждения:

${code}

Код действителен в течение 10 минут.

Если вы не регистрировались в нашей системе, просто проигнорируйте это письмо.

---
Это автоматическое письмо, пожалуйста, не отвечайте на него.
    `;

    // Отправка письма
    if (isDemo) {
      // В демо-режиме не отправляем реальное письмо
      console.log('📧 ДЕМО-РЕЖИМ: Код подтверждения для', email, ':', code);
      console.log('⚠️ Для реальной отправки настройте SendPulse, Resend или SMTP в переменных окружения (.env.local)');
      
      return {
        success: true,
        demo: true,
      };
    }

    // Используем SendPulse, если настроен (приоритет)
    if (useSendPulse) {
      const result = await sendViaSendPulse(
        email,
        'Код подтверждения email - Hotel Booking',
        htmlTemplate,
        textTemplate
      );
      return { ...result, demo: false };
    }

    // Используем Resend, если настроен
    if (useResend) {
      const result = await sendViaResend(
        email,
        'Код подтверждения email - Hotel Booking',
        htmlTemplate,
        textTemplate
      );
      return { ...result, demo: false };
    }

    // Иначе используем SMTP
    const transporter = createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP не настроен' };
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Код подтверждения email - Hotel Booking',
      text: textTemplate,
      html: htmlTemplate,
    });

    console.log('✅ Email отправлен:', info.messageId);

    return {
      success: true,
      demo: false,
    };
  } catch (error: any) {
    console.error('❌ Ошибка отправки email:', error);
    return {
      success: false,
      error: error.message || 'Ошибка отправки email',
    };
  }
}

/**
 * Проверка, настроен ли SMTP
 */
export function isSmtpConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

/**
 * Проверка, настроен ли Resend API
 */
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Проверка, настроен ли SendPulse
 */
export function isSendPulseConfigured(): boolean {
  return !!(process.env.SENDPULSE_USER_ID && process.env.SENDPULSE_SECRET);
}

/**
 * Инициализация SendPulse (Promise-версия)
 */
function initSendPulse(): Promise<void> {
  return new Promise((resolve, reject) => {
    const userId = process.env.SENDPULSE_USER_ID;
    const secret = process.env.SENDPULSE_SECRET;
    
    if (!userId || !secret) {
      reject(new Error('SendPulse не настроен'));
      return;
    }

    // Создаем директорию для токенов, если её нет
    const tokenStorage = path.join(process.cwd(), '.sendpulse-tokens');
    if (!fs.existsSync(tokenStorage)) {
      fs.mkdirSync(tokenStorage, { recursive: true });
    }

    sendpulse.init(userId, secret, tokenStorage, (result: any) => {
      if (result && result.error) {
        reject(new Error(result.error));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Отправка email через SendPulse
 */
async function sendViaSendPulse(
  email: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Инициализируем SendPulse
    await initSendPulse();

    const fromEmail = process.env.SENDPULSE_FROM_EMAIL || process.env.SENDPULSE_USER_ID?.split('@')[0] + '@sendpulse.com' || 'noreply@hotel.com';
    const fromName = process.env.SENDPULSE_FROM_NAME || 'Hotel Booking System';

    const emailData = {
      html: html,
      text: text,
      subject: subject,
      from: {
        name: fromName,
        email: fromEmail
      },
      to: [
        {
          email: email
        }
      ]
    };

    return new Promise((resolve) => {
      sendpulse.smtpSendMail((result: any) => {
        if (result && result.error) {
          console.error('❌ Ошибка SendPulse:', result.error);
          resolve({
            success: false,
            error: result.error || 'Ошибка отправки через SendPulse',
          });
        } else {
          console.log('✅ Email отправлен через SendPulse');
          resolve({ success: true });
        }
      }, emailData);
    });
  } catch (error: any) {
    console.error('❌ Ошибка SendPulse:', error);
    return {
      success: false,
      error: error.message || 'Ошибка отправки через SendPulse',
    };
  }
}

/**
 * Отправка email через Resend API (проще, чем SMTP)
 * @param email - Email адрес получателя
 * @param subject - Тема письма
 * @param html - HTML содержимое
 * @param text - Текстовая версия
 */
async function sendViaResend(
  email: string,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Hotel Booking <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: html,
        text: text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Ошибка отправки через Resend',
      };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Ошибка отправки через Resend',
    };
  }
}

/**
 * Отправка произвольного email (для менеджера)
 * @param to - Email получателя
 * @param subject - Тема письма
 * @param message - Текст сообщения
 * @param html - HTML версия (опционально)
 */
export async function sendCustomEmail(
  to: string,
  subject: string,
  message: string,
  html?: string
): Promise<{ success: boolean; error?: string; demo?: boolean }> {
  try {
    // Проверяем, какой способ отправки использовать (приоритет: SendPulse > Resend > SMTP)
    const useSendPulse = isSendPulseConfigured();
    const useResend = isResendConfigured();
    const useSmtp = isSmtpConfigured();

    if (!useSendPulse && !useResend && !useSmtp) {
      // Демо-режим
      console.log('📧 ДЕМО-РЕЖИМ: Email для', to);
      console.log('Тема:', subject);
      console.log('Сообщение:', message);
      return { success: true, demo: true };
    }

    // HTML версия по умолчанию
    const htmlContent = html || `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏨 Hotel Booking</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
            <div style="white-space: pre-wrap; font-size: 16px;">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </body>
      </html>
    `;

    // Используем SendPulse, если настроен (приоритет)
    if (useSendPulse) {
      return await sendViaSendPulse(to, subject, htmlContent, message);
    }

    // Используем Resend, если настроен
    if (useResend) {
      return await sendViaResend(to, subject, htmlContent, message);
    }

    // Иначе используем SMTP
    const transporter = createTransporter();
    if (!transporter) {
      return { success: false, error: 'SMTP не настроен' };
    }

    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@hotel.com';
    const fromName = process.env.SMTP_FROM_NAME || 'Hotel Booking System';

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: to,
      subject: subject,
      text: message,
      html: htmlContent,
    });

    console.log('✅ Email отправлен:', info.messageId);
    return { success: true, demo: false };
  } catch (error: any) {
    console.error('❌ Ошибка отправки email:', error);
    return {
      success: false,
      error: error.message || 'Ошибка отправки email',
    };
  }
}

