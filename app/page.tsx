'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff, Mail, Phone } from 'lucide-react';
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
      } catch (error) {
        // Если ошибка парсинга, просто редиректим на dashboard
        router.push('/dashboard');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - Форма */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white dark:bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 mx-auto text-gray-700 dark:text-foreground mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">Hotel Booking</h1>
            <p className="text-gray-600 dark:text-muted-foreground">Войдите в систему</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-foreground">
                <Mail className="w-4 h-4 inline mr-1" />
                Email или телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setAuthError('');
                }}
                placeholder="email@example.com или +79991234567"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-foreground">
                Пароль <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-900 dark:focus:border-ring focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="bg-red-50 dark:bg-destructive/20 border border-red-200 dark:border-destructive/50 text-red-700 dark:text-destructive-foreground px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/90 text-white dark:text-primary-foreground py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-muted-foreground pt-4 border-t border-gray-200 dark:border-border">
              <p>Регистрация доступна только по приглашению</p>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть - Фото */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=1200&q=80"
          alt="Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 dark:from-black/0 dark:to-black/10"></div>
      </div>

    </div>
  );
}
