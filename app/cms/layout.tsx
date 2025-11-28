'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

export default function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      router.push('/');
      return;
    }

    const user: User = JSON.parse(userStr);
    
    // Проверяем, заполнен ли телефон (обязателен)
    if (!user.phone) {
      router.push('/complete-profile');
      return;
    }
    
    if (user.role !== 'manager') {
      router.push('/dashboard');
    }
  }, [router]);

  return <>{children}</>;
}





