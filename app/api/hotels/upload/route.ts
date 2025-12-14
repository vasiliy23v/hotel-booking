import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { logActivity } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Получаем IP адрес и User-Agent из запроса
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    if (!file) {
      const duration = Date.now() - startTime;
      await logActivity({
        userId: undefined,
        userName: 'Система',
        userRole: undefined,
        action: 'hotel_upload',
        entity: 'hotel',
        details: {
          error: 'No file provided',
        },
        status: 'error',
        errorMessage: 'No file provided',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {});
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      const duration = Date.now() - startTime;
      await logActivity({
        userId: undefined,
        userName: 'Система',
        userRole: undefined,
        action: 'hotel_upload',
        entity: 'hotel',
        details: {
          error: 'File must be an image',
          fileType: file.type,
        },
        status: 'error',
        errorMessage: 'File must be an image',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {});
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Ограничение размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      const duration = Date.now() - startTime;
      await logActivity({
        userId: undefined,
        userName: 'Система',
        userRole: undefined,
        action: 'hotel_upload',
        entity: 'hotel',
        details: {
          error: 'File size must be less than 5MB',
          fileSize: file.size,
        },
        status: 'error',
        errorMessage: 'File size must be less than 5MB',
        ipAddress: ipAddress.split(',')[0].trim(),
        userAgent,
        duration,
      }).catch(() => {});
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Конвертируем файл в Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Сжимаем изображение в WebP с максимальным качеством
    // Ограничиваем размер до 800px по ширине для оптимизации
    const compressedImage = await sharp(buffer)
      .resize(800, null, { 
        withoutEnlargement: true, // Не увеличивать маленькие изображения
        fit: 'inside' 
      })
      .webp({ 
        quality: 85, // Хорошее качество с отличным сжатием
        effort: 6    // Максимальное сжатие (0-6)
      })
      .toBuffer();

    // Конвертируем в base64 для хранения в БД
    const base64Image = `data:image/webp;base64,${compressedImage.toString('base64')}`;
    
    console.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(compressedImage.length / 1024).toFixed(2)}KB`);

    // Логируем успешную загрузку
    const duration = Date.now() - startTime;
    await logActivity({
      userId: undefined, // Будет заполнено на клиенте
      userName: 'Система',
      userRole: undefined, // Будет заполнено на клиенте
      action: 'hotel_upload',
      entity: 'hotel',
      details: {
        fileName: file.name,
        fileType: file.type,
        originalSize: file.size,
        compressedSize: compressedImage.length,
        compressionRatio: ((1 - compressedImage.length / file.size) * 100).toFixed(2) + '%',
      },
      status: 'success',
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });

    // Возвращаем base64 строку
    return NextResponse.json({ path: base64Image });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    const duration = Date.now() - startTime;
    
    // Логируем ошибку загрузки
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await logActivity({
      userId: undefined,
      userName: 'Система',
      userRole: undefined,
      action: 'hotel_upload',
      entity: 'hotel',
      details: {
        error: errorMessage,
      },
      status: 'error',
      errorMessage,
      ipAddress: ipAddress.split(',')[0].trim(),
      userAgent,
      duration,
    }).catch(() => {
      // Тихо игнорируем ошибки логирования
    });
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}



