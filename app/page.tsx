'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { Lora } from 'next/font/google';
import { api } from '@/lib/api';

const serif = Lora({ subsets: ['latin', 'cyrillic'], weight: ['500', '600'] });

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
    <div className="min-h-screen bg-[#faf8f5] lg:bg-[#efe7df] lg:flex lg:items-center lg:justify-center lg:p-8">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl lg:min-h-0 lg:rounded-[2rem] lg:bg-white lg:p-3 lg:shadow-[0_20px_60px_-20px_rgba(74,52,38,0.25)]">
        {/* Фото (только на компьютере) */}
        <div className="relative hidden lg:block lg:w-1/2 overflow-hidden rounded-[1.5rem]">
          <img
            src="https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=1200&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* Форма входа */}
        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-sm">
            <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd9c2]">
              <Building2 className="h-7 w-7 text-[#6b4a36]" strokeWidth={1.75} aria-hidden="true" />
            </div>

            <h1 className={`${serif.className} text-center text-4xl font-semibold tracking-tight text-[#2a1d15]`}>
              Добро пожаловать
            </h1>
            <p className="mt-3 mb-10 text-center text-lg text-[#6f625a]">
              Войдите, чтобы забронировать комнату
            </p>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div>
                <label htmlFor="login-identifier" className="sr-only">
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
                  placeholder="Email или телефон"
                  className="h-14 w-full rounded-full bg-[#f1ece6] px-6 text-lg text-[#2a1d15] placeholder:text-[#7d7068] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b4a36]"
                />
              </div>

              <div className="relative">
                <label htmlFor="login-password" className="sr-only">
                  Пароль
                </label>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Пароль"
                  className="h-14 w-full rounded-full bg-[#f1ece6] pl-6 pr-28 text-lg text-[#2a1d15] placeholder:text-[#7d7068] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b4a36]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 h-10 -translate-y-1/2 rounded-full px-4 text-base font-medium text-[#6b4a36] hover:bg-[#e8dfd6] focus:outline-none focus:ring-2 focus:ring-[#6b4a36]"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>

              {authError && (
                <div role="alert" className="rounded-2xl bg-[#fde8e4] px-5 py-3 text-base text-[#9b2c1f]">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-14 w-full rounded-full bg-[#6b4a36] text-lg font-medium text-white transition-colors hover:bg-[#573b2b] focus:outline-none focus:ring-2 focus:ring-[#6b4a36] focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? 'Входим…' : 'Войти'}
              </button>
            </form>

            <p className="mt-8 text-center text-base text-[#6f625a]">
              Регистрация доступна только по приглашению
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
