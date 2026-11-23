import { redirect } from 'next/navigation';

// Раздел «Мои бронирования» живёт внутри главной страницы
export default function BookingsPage() {
  redirect('/dashboard?tab=bookings');
}
