'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setAuthError('');

    try {
      if (!identifier || !password) {
        setAuthError('Заполните все поля');
        setLoading(false);
        return;
      }

      // Только вход, регистрация недоступна
      const user = await api.login(identifier, password);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Проверяем, заполнен ли телефон (обязателен)
      if (!user.phone) {
        router.push('/complete-profile');
        return;
      }
      
      // Менеджеры перенаправляются на CMS, гости - на обычный dashboard
      if (user.role === 'manager') {
        router.push('/cms/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  // Проверка существующего пользователя
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        
        // Проверяем, заполнен ли телефон (обязателен)
        if (!user.phone) {
          router.push('/complete-profile');
          return;
        }
        
        // Менеджеры перенаправляются на CMS, гости - на обычный dashboard
        if (user.role === 'manager') {
          router.push('/cms/dashboard');
        } else {
          router.push('/dashboard');
        }
      } catch {
        // Если ошибка парсинга, просто редиректим на dashboard
        router.push('/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Форма входа: крупный текст, высокий контраст, большие поля и кнопки */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-700">
              <Building2 className="h-11 w-11 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Hotel Booking</h1>
            <p className="text-xl text-gray-700">Войдите, чтобы забронировать комнату</p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label htmlFor="login-identifier" className="block text-xl font-semibold mb-2 text-gray-900">
                Email или телефон
              </label>
              <input
                id="login-identifier"
                type="text"
                inputMode="email"
                autoComplete="username"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setAuthError('');
                }}
                placeholder="email@example.com или +49…"
                className="w-full h-16 px-5 text-xl border-2 border-gray-500 rounded-2xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xl font-semibold mb-2 text-gray-900">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Ваш пароль"
                  className="w-full h-16 pl-5 pr-32 text-xl border-2 border-gray-500 rounded-2xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-700 focus:ring-4 focus:ring-blue-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-12 items-center gap-2 rounded-xl px-3 text-lg font-semibold text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? <EyeOff className="h-6 w-6" aria-hidden="true" /> : <Eye className="h-6 w-6" aria-hidden="true" />}
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
            </div>

            {authError && (
              <div role="alert" className="rounded-2xl border-2 border-red-600 bg-red-50 px-5 py-4 text-lg font-medium text-red-800">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-blue-700 text-xl font-bold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
            >
              {loading ? 'Входим…' : 'Войти'}
            </button>

            <p className="border-t-2 border-gray-200 pt-6 text-center text-lg text-gray-700">
              Регистрация доступна только по приглашению
            </p>
          </form>
        </div>
      </div>

      {/* Правая часть - Фото (только на компьютере) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
