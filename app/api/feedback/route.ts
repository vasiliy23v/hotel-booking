import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createFeedback, getFeedbacks, deleteFeedback } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const comment = formData.get('comment') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;
    const userRole = formData.get('userRole') as string;
    const screenshot = formData.get('screenshot') as File | null;

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { error: 'Комментарий обязателен' },
        { status: 400 }
      );
    }

    let screenshotPath: string | null = null;

    // Обработка скриншота, если он есть
    if (screenshot && screenshot.size > 0) {
      // Проверка типа файла
      if (!screenshot.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Файл должен быть изображением' },
          { status: 400 }
        );
      }

      // Ограничение размера файла (5MB)
      if (screenshot.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Размер файла должен быть меньше 5MB' },
          { status: 400 }
        );
      }

      const bytes = await screenshot.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Создаем уникальное имя файла
      const timestamp = Date.now();
      const originalName = screenshot.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `feedback_${timestamp}_${originalName}`;
      
      // Путь для сохранения
      const uploadsDir = join(process.cwd(), 'public', 'feedback');
      
      // Создаем директорию, если её нет
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      // Возвращаем путь относительно public
      screenshotPath = `/feedback/${fileName}`;
    }

    // Сохраняем отзыв в файл (можно также отправить на email или сохранить в БД)
    const feedbackData = {
      comment: comment.trim(),
      userName,
      userEmail: userEmail || 'Не указан',
      userRole,
      screenshot: screenshotPath,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'Неизвестно',
    };

    // Сохраняем в базу данных Neon
    const savedFeedback = await createFeedback({
      userName,
      userEmail: userEmail || undefined,
      userRole,
      comment: comment.trim(),
      screenshot: screenshotPath || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // Также сохраняем в JSON файл для резервной копии
    const feedbackDir = join(process.cwd(), 'data', 'feedback');
    if (!existsSync(feedbackDir)) {
      await mkdir(feedbackDir, { recursive: true });
    }

    const feedbackFileName = `feedback_${Date.now()}.json`;
    const feedbackFilePath = join(feedbackDir, feedbackFileName);
    await writeFile(feedbackFilePath, JSON.stringify(feedbackData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Отзыв успешно отправлен',
      feedback: savedFeedback,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при отправке отзыва';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET /api/feedback - получить все отзывы
export async function GET() {
  try {
    const feedbacks = await getFeedbacks();
    return NextResponse.json(feedbacks);
  } catch (error: unknown) {
    console.error('Error in GET /api/feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при получении отзывов';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/feedback - удалить отзыв
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID отзыва обязателен' },
        { status: 400 }
      );
    }

    await deleteFeedback(id);

    return NextResponse.json({
      success: true,
      message: 'Отзыв успешно удален',
    });
  } catch (error: unknown) {
    console.error('Error in DELETE /api/feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении отзыва';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

