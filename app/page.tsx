'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { serif } from '@/lib/fonts';
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
      if (user.role === 'manager' || user.role === 'developer') {
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
        if (user.role === 'manager' || user.role === 'developer') {
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
    <div className="min-h-screen bg-[#faf8f5] lg:flex">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden lg:w-[42%] lg:shrink-0">
        {/* Мягкое персиковое свечение */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#ffd9c2]/50 blur-3xl" aria-hidden="true" />

        {/* Иллюстрация сверху на телефоне */}
        <div className="relative h-52 w-full shrink-0 lg:hidden">
          <img src="/login-hero-v2.jpg" alt="" className="h-full w-full object-cover object-[30%_45%]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#faf8f5] to-transparent" />
        </div>

        {/* Форма входа */}
        <div className="relative flex w-full flex-1 items-center justify-center px-6 pb-12 pt-6 lg:px-14 lg:py-12">
          <div className="w-full max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand-hotel-v2.png"
              alt="Hotel Drei Bären"
              className="mx-auto mb-4 w-40"
            />

            <h1 className={`${serif.className} text-center text-4xl font-semibold tracking-tight text-[#2a1d15]`}>
              Рады вас видеть
            </h1>
            <p className="mt-3 mb-9 text-center text-lg text-[#6f625a]">
              Войдите, чтобы выбрать комнату
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

              <div className="text-right">
                <Link href="/forgot-password" className="text-base font-medium text-[#6b4a36] hover:underline">
                  Забыли пароль?
                </Link>
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

      {/* Фото на всю высоту (только на компьютере), ~60% ширины */}
      <div className="relative hidden lg:block lg:flex-1">
        <img
          src="/login-hero-v2.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[35%_50%]"
        />
        {/* Плавный переход от формы к иллюстрации */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#faf8f5] to-transparent" />
        {/* Тёплая подпись */}
        <div className="absolute bottom-10 left-16 max-w-sm rounded-3xl bg-white/55 px-7 py-5 backdrop-blur-md">
          <p className={`${serif.className} text-2xl font-semibold leading-snug text-[#3a281d]`}>
            Тепло, уют и тишина.
          </p>
          <p className="mt-1 text-base text-[#5d4c42]">Ждём вас на фестивале.</p>
        </div>
      </div>
    </div>
  );
}
