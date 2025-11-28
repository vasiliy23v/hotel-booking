'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Building2, Bed, Calendar, Euro } from 'lucide-react';
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

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (!statistics) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
            Статистика
          </h2>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Фильтр по отелю</label>
            <select
              value={filterHotelId}
              onChange={(e) => setFilterHotelId(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none bg-white text-gray-900 text-sm"
            >
              <option value="">Все отели</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
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
        </div>
      </div>
    </div>
  );
}






