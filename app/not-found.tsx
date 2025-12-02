import Link from 'next/link';
import { Building2, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Иконка отеля */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex items-center justify-center flex-col">
            <span className="text-[100px] font-bold text-black">404</span>
          </div>
        </div>

        {/* Заголовок */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Страница не найдена
        </h1>

        {/* Описание */}
        <p className="text-lg light:text-gray-600 dark:text-gray-600 mb-2">
          К сожалению, запрашиваемая страница не существует
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Возможно, она была перемещена или удалена
        </p>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Home className="w-5 h-5" />
            На главную
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Search className="w-5 h-5" />
            В кабинет
          </Link>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Если вы считаете, что это ошибка, пожалуйста, свяжитесь с поддержкой
          </p>
        </div>
      </div>
    </div>
  );
}

