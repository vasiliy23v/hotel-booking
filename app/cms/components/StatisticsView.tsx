'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Building2, Bed, Calendar, Euro, CreditCard } from 'lucide-react';
import { api } from '@/lib/api';
import type { Statistics, Hotel } from '@/types';

export default function StatisticsView({ 
  selectedHotel, 
  hotels 
}: { 
  selectedHotel: string; 
  hotels: Hotel[] 
}) {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterHotelId, setFilterHotelId] = useState<string>(selectedHotel || '');

  const loadStatistics = async (hotelId?: string) => {
    try {
      setLoading(true);
      const stats = await api.getStatistics(hotelId || undefined);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics(filterHotelId || undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHotelId]);

  // Скелетон для загрузки
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="mb-4 sm:mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-16 bg-gray-300 rounded animate-pulse mt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            Статистика
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-gray-700" />
              <span className="text-sm text-gray-700 font-semibold">Всего комнат</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{statistics.totalRooms}</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="w-5 h-5 text-green-700" />
              <span className="text-sm text-green-700 font-semibold">Свободно</span>
            </div>
            <div className="text-3xl font-bold text-green-700">{statistics.availableRooms}</div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              <span className="text-sm text-gray-700 font-semibold">Забронировано</span>
            </div>
            <div className="text-3xl font-bold text-gray-700">{statistics.bookedRooms}</div>
          </div>

          <div className="bg-emerald-600 rounded-lg p-4 border border-emerald-700">
            <div className="flex items-center gap-2 mb-2">
              <Euro className="w-5 h-5 text-white" />
              <span className="text-sm text-white font-semibold">Доход</span>
            </div>
            <div className="text-3xl font-bold text-white">{statistics.revenue}€</div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-orange-700" />
              <span className="text-sm text-orange-700 font-semibold">К оплате</span>
            </div>
            <div className="text-3xl font-bold text-orange-700">{statistics.amountToPay?.toFixed(2) || '0.00'}€</div>
          </div>
        </div>
      </div>
    </div>
  );
}






