'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Building2, Eye, EyeOff, Mail, Phone, AlertCircle, CheckCircle, Key } from 'lucide-react';
import { api } from '@/lib/api';

export default function InviteRegistrationPage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteName, setInviteName] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false); // Режим: регистрация или сброс пароля

  // Проверка токена при загрузке страницы
  useEffect(() => {
    const validateToken = async () => {
      // Получаем токен из параметров (динамический маршрут [token])
      const actualToken = (params?.token as string) || token;
      
      if (!actualToken) {
        setError('Токен приглашения не найден');
        setValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/invites/verify?token=${encodeURIComponent(actualToken)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
          setError(errorData.error || 'Ошибка при проверке приглашения');
          setInviteValid(false);
          setValidating(false);
          return;
        }
        
        const data = await response.json();

        if (data.valid) {
          setInviteValid(true);
          setUserExists(data.userExists || false); // Определяем режим работы
          if (data.invite?.name) {
            setInviteName(data.invite.name);
            setName(data.invite.name);
          }
        } else {
          setError(data.error || 'Приглашение недействительно');
          setInviteValid(false);
        }
      } catch (error) {
        console.error('Ошибка при проверке приглашения:', error);
        setError('Ошибка при проверке приглашения');
        setInviteValid(false);
      } finally {
        setValidating(false);
      }
    };

    if (params) {
      validateToken();
    }
  }, [token, params]);

  // Проверка существующего пользователя - только после проверки токена
  // Не редиректим автоматически, так как пользователь может использовать приглашение
  // для регистрации нового аккаунта или сброса пароля даже если он залогинен

  const handleRegister = async () => {
    if (!token) {
      setError('Токен приглашения отсутствует');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!password) {
        setError('Пароль обязателен');
        setLoading(false);
        return;
      }

      // Проверяем, что указан телефон (обязателен)
      if (!phone.trim()) {
        setError('Телефон обязателен');
        setLoading(false);
        return;
      }

      // Регистрация с токеном приглашения
      // Имя опционально - используем из приглашения, если не указано, или пустую строку
      const newUser = await api.createUser({
        email: email.trim() || undefined,
        name: name.trim() || inviteName || undefined,
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

  const handleResetPassword = async () => {
    if (!token) {
      setError('Токен приглашения отсутствует');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!password || !confirmPassword) {
        setError('Заполните все обязательные поля');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        setLoading(false);
        return;
      }

      // Сброс пароля с токеном приглашения
      const result = await api.resetPassword(token, password, confirmPassword, name);

      if (result.success) {
        // Автоматический вход после сброса пароля
        const loginResponse = await api.login(result.user.email || result.user.phone || '', password);
        localStorage.setItem('currentUser', JSON.stringify(loginResponse));
        
        // Сбрасываем состояние загрузки перед редиректом
        setLoading(false);
        
        // Проверяем, заполнен ли телефон (обязателен)
        if (!loginResponse.phone) {
          router.push('/complete-profile');
          return;
        }
        
        // Менеджеры перенаправляются на CMS, гости - на обычный dashboard
        if (loginResponse.role === 'manager') {
          router.push('/cms/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка при сбросе пароля');
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка приглашения...</p>
        </div>
      </div>
    );
  }

  if (!inviteValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Приглашение недействительно</h1>
          <p className="text-gray-600 mb-6">{error || 'Это приглашение не может быть использовано для регистрации.'}</p>
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
            {userExists ? (
              <Key className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            ) : (
              <Building2 className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {userExists ? 'Сброс пароля' : 'Регистрация'}
            </h1>
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">Приглашение подтверждено</p>
            </div>
            <p className="text-gray-600">
              {userExists 
                ? 'Установите новый пароль для вашего аккаунта' 
                : 'Создайте свой аккаунт'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Форма регистрации */}
            {!userExists && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Имя
                    {inviteName && (
                      <span className="text-xs text-gray-500 ml-2">(из приглашения, можно изменить)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Опционально. {inviteName ? 'Можно изменить предложенное имя' : 'Можно указать позже'}
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none bg-white text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Опционально. Можно использовать для входа в систему
                  </p>
                </div>
              </>
            )}

            {/* Имя для сброса пароля */}
            {userExists && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Имя
                  {inviteName && (
                    <span className="text-xs text-gray-500 ml-2">(из приглашения, можно изменить)</span>
                  )}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Опционально. {inviteName ? 'Можно изменить предложенное имя' : 'Можно указать имя'}
                </p>
              </div>
            )}

            {/* Пароль */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                {userExists ? 'Новый пароль' : 'Пароль'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && (userExists ? handleResetPassword() : handleRegister())}
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

            {/* Подтверждение пароля - только для сброса пароля */}
            {userExists && (
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
                    onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900"
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
                  <p className="text-xs text-red-500 mt-1">Пароли не совпадают</p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={userExists ? handleResetPassword : handleRegister}
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading 
                ? (userExists ? 'Сброс пароля...' : 'Регистрация...') 
                : (userExists ? 'Сбросить пароль' : 'Зарегистрироваться')}
            </button>

            {!userExists && (
              <button
                onClick={() => router.push('/')}
                className="w-full text-gray-700 hover:text-gray-900 font-semibold text-sm"
              >
                Уже есть аккаунт? Войти
              </button>
            )}
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
