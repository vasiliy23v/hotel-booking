import { Lora } from 'next/font/google';

// Единый шрифт для заголовков — подключается один раз на весь проект
export const serif = Lora({ subsets: ['latin', 'cyrillic'], weight: ['500', '600'] });
