'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { api } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setAuthError('');

    try {
      if (isLogin) {
        // Вход
        const user = await api.login(email, password);
        localStorage.setItem('currentUser', JSON.stringify(user));
        router.push('/dashboard');
      } else {
        // Регистрация
        if (!email || !password || !name) {
          setAuthError('Заполните все обязательные поля');
          setLoading(false);
          return;
        }

        // Создаем пользователя напрямую
        const newUser = await api.createUser({
          email,
          name,
          phone: phone || undefined,
          password,
          role: 'guest'
        });
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : 'Ошибка аутентификации');
    } finally {
      setLoading(false);
    }
  };

  // Проверка существующего пользователя
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - Форма */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Booking</h1>
            <p className="text-gray-600">
              {isLogin ? 'Войдите в систему' : 'Создайте аккаунт'}
          </p>
        </div>

        <div className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <Mail className="w-4 h-4 inline mr-1" />
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthError('');
              }}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <Phone className="w-4 h-4 inline mr-1" />
                Телефон
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+491234567890"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
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
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {authError}
            </div>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>

          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setAuthError('');
            }}
            className="w-full text-gray-700 hover:text-gray-900 font-semibold text-sm"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
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
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10"></div>
      </div>

    </div>
  );
}
