import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Ограничение размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
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

    // Возвращаем base64 строку
    return NextResponse.json({ path: base64Image });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}



