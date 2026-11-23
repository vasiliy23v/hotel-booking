'use client';

import { useState } from 'react';
import Link from 'next/link';
import { serif } from '@/lib/fonts';


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!email.includes('@')) {
      setError('Введите email, указанный при регистрации');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('Не получилось отправить письмо. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-6">
      <div className="w-full max-w-md">
        <h1 className={`${serif.className} text-center text-4xl font-semibold text-[#2a1d15]`}>
          Забыли пароль?
        </h1>
        {sent ? (
          <>
            <p className="mt-4 text-center text-lg text-[#6f625a]">
              Если такой адрес есть у нас, мы отправили на него письмо со ссылкой. Проверьте также «Спам».
            </p>
            <Link href="/" className="mt-8 block text-center text-lg font-medium text-[#6b4a36] hover:underline">
              Вернуться ко входу
            </Link>
          </>
        ) : (
          <>
            <p className="mt-3 mb-8 text-center text-lg text-[#6f625a]">
              Отправим ссылку для нового пароля на вашу почту
            </p>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Email"
                className="h-14 w-full rounded-full bg-[#f1ece6] px-6 text-lg text-[#2a1d15] placeholder:text-[#7d7068] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b4a36]"
              />
              {error && (
                <div role="alert" className="rounded-2xl bg-[#fde8e4] px-5 py-3 text-base text-[#9b2c1f]">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-full bg-[#6b4a36] text-lg font-medium text-white transition-colors hover:bg-[#573b2b] disabled:opacity-60"
              >
                {loading ? 'Отправляем…' : 'Отправить ссылку'}
              </button>
            </form>
            <Link href="/" className="mt-6 block text-center text-base text-[#6f625a] hover:underline">
              Назад
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
