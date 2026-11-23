'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';
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
    <div className="min-h-screen flex bg-[#f4f4f6] lg:p-4 lg:gap-4">
      {/* Форма входа */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 lg:bg-white lg:rounded-[2rem]">
        <div className="w-full max-w-md">
          <Building2 className="h-9 w-9 text-gray-900 mb-10" strokeWidth={1.5} aria-hidden="true" />

          <h1 className="text-[2.5rem] leading-[1.1] font-semibold tracking-tight text-gray-900">
            Добро пожаловать
          </h1>
          <p className="mt-3 mb-10 text-lg text-gray-600">
            Войдите, чтобы забронировать комнату
          </p>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label htmlFor="login-identifier" className="block text-lg font-medium mb-2 text-gray-900">
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
                placeholder="email@example.com"
                className="w-full h-14 px-5 text-lg rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-lg font-medium mb-2 text-gray-900">
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
                  className="w-full h-14 pl-5 pr-28 text-lg rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-xl px-3 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
            </div>

            {authError && (
              <div role="alert" className="rounded-2xl bg-red-50 px-5 py-4 text-base text-red-800">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-14 rounded-full bg-gray-900 text-lg font-medium text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? 'Входим…' : 'Войти'}
            </button>
          </form>

          <p className="mt-8 text-center text-base text-gray-600">
            Регистрация доступна только по приглашению
          </p>
        </div>
      </div>

      {/* Фото (только на компьютере) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden rounded-[2rem]">
        <img
          src="https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=1200&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
