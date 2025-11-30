'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Eye, EyeOff, Mail, Phone, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { api } from '@/lib/api';
import type { User } from '@/types';

export default function CompleteProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Валидация пароля: только латинские символы, минимум 6 символов
  const validatePassword = (pwd: string): string => {
    if (!pwd) {
      return 'Пароль обязателен';
    }
    if (pwd.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    // Проверка на латинские символы, цифры и базовые спецсимволы
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(pwd)) {
      return 'Пароль может содержать только латинские буквы, цифры и специальные символы';
    }
    return '';
  };

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // Если телефон уже заполнен, перенаправляем
      if (user.phone) {
        if (user.role === 'manager') {
          router.push('/cms/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }
      
      setCurrentUser(user);
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setChecking(false);
    } catch {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Проверка: телефон обязателен
      if (!phone.trim()) {
        setError('Телефон обязателен');
        setLoading(false);
        return;
      }

      // Валидация пароля
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        setPasswordTouched(true);
        setPasswordError(passwordValidationError);
        setError(passwordValidationError);
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        setLoading(false);
        return;
      }

      if (!currentUser?.id) {
        setError('Ошибка: пользователь не найден');
        setLoading(false);
        return;
      }

      // Обновляем данные пользователя
      const updatedUser = await api.updateUser(currentUser.id, {
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        password: password,
      });

      // Обновляем пользователя в localStorage
      const { password: _password, ...userWithoutPassword } = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      // Перенаправляем в зависимости от роли
      if (updatedUser.role === 'manager') {
        router.push('/cms/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении данных');
    } finally {
      setLoading(false);
    }
  };

  if (checking || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Lock className="w-16 h-16 mx-auto text-gray-700 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Завершите регистрацию
          </h1>
          <p className="text-gray-600">
            Для продолжения работы необходимо указать телефон (обязательно), email (опционально) и установить пароль
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <Phone className="w-4 h-4 inline mr-1" />
              Телефон <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              placeholder="+491234567890"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Обязательное поле для входа в систему
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              <Mail className="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="email@example.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              Опционально. Можно использовать для входа в систему
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Пароль <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  setError('');
                  
                  // Валидация в реальном времени
                  if (passwordTouched || value.length > 0) {
                    setPasswordError(validatePassword(value));
                  }
                }}
                onBlur={() => {
                  setPasswordTouched(true);
                  setPasswordError(validatePassword(password));
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none bg-white text-gray-900 ${
                  passwordError && passwordTouched
                    ? 'border-red-500 focus:border-red-500'
                    : passwordTouched && !passwordError && password
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:border-gray-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && passwordTouched && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {passwordError}
              </p>
            )}
            {!passwordError && passwordTouched && password && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Пароль введен корректно
              </p>
            )}
            {!passwordTouched && (
              <p className="text-xs text-gray-500 mt-1">
                Минимум 6 символов, только латинские буквы, цифры и специальные символы
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Подтвердите пароль <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Пароли не совпадают
              </p>
            )}
            {password && confirmPassword && password === confirmPassword && passwordTouched && !passwordError && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Пароли совпадают
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить и продолжить'}
          </button>
        </div>
      </div>
    </div>
  );
}

