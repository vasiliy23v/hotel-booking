'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Eye, EyeOff, Mail, Phone, AlertCircle, CheckCircle, Key } from 'lucide-react';
import { api } from '@/lib/api';
import { normalizePhone, isValidPhone } from '@/lib/phone';

export default function RegistrationPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
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

  // Проверка токена при загрузке страницы
  useEffect(() => {
    const validateToken = async () => {
      const actualToken = (params?.token as string) || token;
      
      if (!actualToken) {
        setError('Токен регистрации не найден');
        setValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/registration-token?verify=true&token=${encodeURIComponent(actualToken)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
          setError(errorData.error || 'Ошибка при проверке токена');
          setTokenValid(false);
          setValidating(false);
          return;
        }
        
        const data = await response.json();

        if (data.valid) {
          setTokenValid(true);
        } else {
          setError('Токен регистрации недействителен');
          setTokenValid(false);
        }
      } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        setError('Ошибка при проверке токена');
        setTokenValid(false);
      } finally {
        setValidating(false);
      }
    };

    if (params) {
      validateToken();
    }
  }, [token, params]);

  const handleRegister = async () => {
    if (!token) {
      setError('Токен регистрации отсутствует');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Валидация пароля
      const passwordValidationError = validatePassword(password);
      if (passwordValidationError) {
        setPasswordTouched(true);
        setPasswordError(passwordValidationError);
        setError(passwordValidationError);
        setLoading(false);
        return;
      }

      // Проверяем, что указан телефон (обязателен)
      if (!phone.trim()) {
        setPhoneTouched(true);
        setPhoneError('Телефон обязателен');
        setError('Телефон обязателен');
        setLoading(false);
        return;
      }

      // Проверяем формат телефона
      const normalized = normalizePhone(phone);
      if (!normalized || !isValidPhone(normalized)) {
        setPhoneTouched(true);
        setPhoneError('Неверный формат телефона. Используйте формат: +7XXXXXXXXXX');
        setError('Неверный формат телефона');
        setLoading(false);
        return;
      }

      // Регистрация с общим токеном
      const newUser = await api.createUser({
        email: email.trim() || undefined,
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
        password,
        role: 'guest',
        inviteToken: token
      });

      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Сбрасываем состояние загрузки перед редиректом
      setLoading(false);
      
      // Проверяем, заполнен ли телефон (обязателен)
      if (!newUser.phone) {
        router.push('/complete-profile');
        return;
      }
      
      // Менеджеры перенаправляются на CMS, гости - на обычный dashboard
      if (newUser.role === 'manager') {
        router.push('/cms/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка при регистрации');
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка токена регистрации...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Токен регистрации недействителен</h1>
          <p className="text-gray-600 mb-6">{error || 'Этот токен регистрации не может быть использован для регистрации.'}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Левая часть - Форма */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Key className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Регистрация</h1>
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">Токен регистрации подтвержден</p>
            </div>
            <p className="text-gray-600">
              Создайте свой аккаунт
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">
                Опционально. Можно указать позже
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                <Phone className="w-4 h-4 inline mr-1" />
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  setPhone(value);
                  setError('');
                  
                  // Валидация в реальном времени
                  if (phoneTouched || value.length > 0) {
                    if (!value.trim()) {
                      setPhoneError('Телефон обязателен');
                    } else {
                      const normalized = normalizePhone(value);
                      if (!normalized || !isValidPhone(normalized)) {
                        setPhoneError('Неверный формат телефона. Используйте международный формат: +491234567890');
                      } else {
                        setPhoneError('');
                      }
                    }
                  }
                }}
                onBlur={() => {
                  setPhoneTouched(true);
                  if (!phone.trim()) {
                    setPhoneError('Телефон обязателен');
                  } else {
                    const normalized = normalizePhone(phone);
                    if (!normalized || !isValidPhone(normalized)) {
                      setPhoneError('Неверный формат телефона. Используйте международный формат: +491234567890');
                    } else {
                      setPhoneError('');
                    }
                  }
                }}
                placeholder="+491234567890"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none bg-white text-gray-900 ${
                  phoneError && phoneTouched
                    ? 'border-red-500 focus:border-red-500'
                    : phoneTouched && !phoneError && phone.trim()
                    ? 'border-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:border-gray-900'
                }`}
                required
              />
              {phoneError && phoneTouched && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {phoneError}
                </p>
              )}
              {!phoneError && phoneTouched && phone.trim() && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Телефон введен корректно
                </p>
              )}
              {!phoneTouched && (
                <p className="text-xs text-gray-500 mt-1">
                  Обязательное поле для входа в систему. Формат: +7XXXXXXXXXX
                </p>
              )}
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none bg-white text-gray-900"
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
                  onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full text-gray-700 hover:text-gray-900 font-semibold text-sm"
            >
              Уже есть аккаунт? Войти
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

