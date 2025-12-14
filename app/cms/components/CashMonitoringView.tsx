'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Calendar } from 'lucide-react';
import { api } from '@/lib/api';
import type { CashMonitoringResponse } from '@/types/api';

export default function CashMonitoringView({ 
  selectedHotel 
}: { 
  selectedHotel: string 
}) {
  const [cashData, setCashData] = useState<CashMonitoringResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCashData = async () => {
    try {
      setLoading(true);
      const data = await api.getCashMonitoring(selectedHotel || undefined);
      setCashData(data);
    } catch (error) {
      console.error('Error loading cash monitoring:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotel]);

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (!cashData) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          Мониторинг наличных денег
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-700" />
              <span className="text-sm text-green-700 font-semibold">Всего наличных</span>
            </div>
            <div className="text-3xl font-bold text-green-700">{cashData.totalCash.toFixed(2)}€</div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-700" />
              <span className="text-sm text-blue-700 font-semibold">Сегодня</span>
            </div>
            <div className="text-3xl font-bold text-blue-700">{cashData.cashToday.toFixed(2)}€</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-purple-700" />
              <span className="text-sm text-purple-700 font-semibold">За неделю</span>
            </div>
            <div className="text-3xl font-bold text-purple-700">{cashData.cashThisWeek.toFixed(2)}€</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-orange-700" />
              <span className="text-sm text-orange-700 font-semibold">За месяц</span>
            </div>
            <div className="text-3xl font-bold text-orange-700">{cashData.cashThisMonth.toFixed(2)}€</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Последние платежи наличными</h3>
          {cashData.recentCashPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Нет платежей наличными
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Дата</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Комната</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Гость</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {cashData.recentCashPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {new Date(payment.date).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-gray-900">
                        #{payment.roomNumber}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-gray-700">
                        {payment.bookedBy}
                      </td>
                      <td className="px-3 py-2.5 text-sm font-bold text-green-700">
                        {payment.amount.toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}








