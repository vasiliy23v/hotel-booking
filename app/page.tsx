'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff, Mail, Phone, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';

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
  
  // Подтверждение email
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [pendingUserData, setPendingUserData] = useState<any>(null);

  const handleSendVerificationCode = async () => {
    if (!email) {
      setVerificationError('Email обязателен');
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setVerificationError(data.error || 'Ошибка отправки кода');
        return;
      }

      // Показываем код только в демо-режиме
      if (data.demo && data.code) {
        setGeneratedCode(data.code);
      }
      setShowVerificationModal(true);
    } catch (error: any) {
      setVerificationError('Ошибка отправки кода подтверждения');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError('Введите 6-значный код');
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      });

      const data = await response.json();

      if (!response.ok) {
        setVerificationError(data.error || 'Неверный код');
        return;
      }

      // Код подтвержден, завершаем регистрацию
      await completeRegistration();
    } catch (error: any) {
      setVerificationError('Ошибка проверки кода');
    } finally {
      setVerificationLoading(false);
    }
  };

  const completeRegistration = async () => {
    try {
      const newUser = await api.createUser(pendingUserData);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setShowVerificationModal(false);
      router.push('/dashboard');
    } catch (error: any) {
      setAuthError(error.message || 'Ошибка регистрации');
      setShowVerificationModal(false);
    }
  };

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

        // Сохраняем данные для регистрации
        setPendingUserData({
          email,
          name,
          phone: phone || undefined,
          password,
          role: 'guest'
        });

        // Отправляем код подтверждения
        await handleSendVerificationCode();
      }
    } catch (error: any) {
      setAuthError(error.message || 'Ошибка аутентификации');
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

      {/* Модальное окно подтверждения email */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Подтверждение email</h2>
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationCode('');
                  setVerificationError('');
                  setGeneratedCode('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Код подтверждения отправлен на <strong>{email}</strong>
            </p>

            {/* Показываем код только в демо-режиме (когда SMTP не настроен) */}
            {generatedCode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 font-semibold mb-1">⚠️ ДЕМО РЕЖИМ</p>
                <p className="text-sm text-blue-700">
                  Код подтверждения: <strong className="text-lg">{generatedCode}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  SMTP не настроен. Для реальной отправки email настройте переменные окружения.
                  <br />
                  См. файл <code className="bg-blue-100 px-1 rounded">.env.example</code>
                </p>
              </div>
            )}
            
            {!generatedCode && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  ✓ Код подтверждения отправлен на ваш email адрес
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Проверьте почту (включая папку "Спам") и введите полученный код
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Введите код подтверждения
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  setVerificationError('');
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none text-center text-2xl tracking-widest font-mono"
                autoFocus
              />
              {verificationError && (
                <p className="text-red-500 text-xs mt-1">{verificationError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationCode('');
                  setVerificationError('');
                  setGeneratedCode('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={verificationLoading || verificationCode.length !== 6}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {verificationLoading ? 'Проверка...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
