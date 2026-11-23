'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { serif } from '@/lib/fonts';


export default function ResetPasswordPage() {
  const router = useRouter();
  const token = useParams()?.token as string;
  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => setValid(!!d.valid))
      .catch(() => setValid(false));
  }, [token]);

  const submit = async () => {
    if (password.length < 6) {
      setError('Минимум 6 символов');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка');
      setDone(true);
      setTimeout(() => router.push('/'), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8f5] px-6">
      <div className="w-full max-w-md text-center">
        {valid === null ? (
          <p className="text-lg text-[#6f625a]">Проверяем ссылку…</p>
        ) : !valid ? (
          <>
            <h1 className={`${serif.className} text-3xl font-semibold text-[#2a1d15]`}>Ссылка устарела</h1>
            <p className="mt-3 text-lg text-[#6f625a]">Запросите новую, она действует один час.</p>
            <Link href="/forgot-password" className="mt-8 block text-lg font-medium text-[#6b4a36] hover:underline">
              Запросить ссылку
            </Link>
          </>
        ) : done ? (
          <>
            <h1 className={`${serif.className} text-3xl font-semibold text-[#2a1d15]`}>Готово</h1>
            <p className="mt-3 text-lg text-[#6f625a]">Пароль изменён. Переходим ко входу…</p>
          </>
        ) : (
          <>
            <h1 className={`${serif.className} text-4xl font-semibold text-[#2a1d15]`}>Новый пароль</h1>
            <p className="mt-3 mb-8 text-lg text-[#6f625a]">Минимум 6 символов, латинские буквы и цифры</p>
            <form
              className="space-y-4 text-left"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Новый пароль"
                  className="h-14 w-full rounded-full bg-[#f1ece6] pl-6 pr-28 text-lg text-[#2a1d15] placeholder:text-[#7d7068] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6b4a36]"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 h-10 -translate-y-1/2 rounded-full px-4 text-base font-medium text-[#6b4a36] hover:bg-[#e8dfd6]"
                >
                  {show ? 'Скрыть' : 'Показать'}
                </button>
              </div>
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
                {loading ? 'Сохраняем…' : 'Сохранить пароль'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
