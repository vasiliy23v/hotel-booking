'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { DatePicker } from '@/components/ui/date-picker';

interface BookingDateRange {
  id: string;
  name: string | null;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function BookingDateRangesView() {
  const [ranges, setRanges] = useState<BookingDateRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRange, setEditingRange] = useState<BookingDateRange | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    isActive: true,
  });

  const loadRanges = async () => {
    try {
      setLoading(true);
      const data = await api.getBookingDateRanges(false);
      setRanges(data);
    } catch (error) {
      console.error('Error loading date ranges:', error);
      alert('Ошибка при загрузке диапазонов дат');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRanges();
  }, []);

  const handleAdd = () => {
    setFormData({
      name: '',
      startDate: undefined,
      endDate: undefined,
      isActive: true,
    });
    setEditingRange(null);
    setShowAddModal(true);
  };

  const handleEdit = (range: BookingDateRange) => {
    setFormData({
      name: range.name || '',
      startDate: range.startDate ? new Date(range.startDate) : undefined,
      endDate: range.endDate ? new Date(range.endDate) : undefined,
      isActive: range.isActive,
    });
    setEditingRange(range);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.startDate || !formData.endDate) {
      alert('Пожалуйста, выберите даты начала и окончания');
      return;
    }

    if (formData.startDate >= formData.endDate) {
      alert('Дата начала должна быть раньше даты окончания');
      return;
    }

    try {
      const rangeData = {
        name: formData.name || undefined,
        startDate: `${formData.startDate.getFullYear()}-${String(formData.startDate.getMonth() + 1).padStart(2, '0')}-${String(formData.startDate.getDate()).padStart(2, '0')}`,
        endDate: `${formData.endDate.getFullYear()}-${String(formData.endDate.getMonth() + 1).padStart(2, '0')}-${String(formData.endDate.getDate()).padStart(2, '0')}`,
        isActive: formData.isActive,
      };

      if (editingRange) {
        await api.updateBookingDateRange(editingRange.id, rangeData);
      } else {
        await api.createBookingDateRange(rangeData);
      }

      setShowAddModal(false);
      setEditingRange(null);
      await loadRanges();
    } catch (error: unknown) {
      console.error('Error saving date range:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при сохранении диапазона дат';
      alert(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот диапазон дат?')) {
      return;
    }

    try {
      await api.deleteBookingDateRange(id);
      await loadRanges();
    } catch (error: unknown) {
      console.error('Error deleting date range:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении диапазона дат';
      alert(errorMessage);
    }
  };

  const handleToggleActive = async (range: BookingDateRange) => {
    try {
      await api.updateBookingDateRange(range.id, {
        isActive: !range.isActive,
      });
      await loadRanges();
    } catch (error: unknown) {
      console.error('Error toggling date range:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при изменении статуса диапазона дат';
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-base text-[#8a7566]">Когда можно бронировать</p>
          <button
            onClick={handleAdd}
            className="flex h-12 items-center gap-2 rounded-full bg-[#6b4a36] px-6 text-base font-semibold text-white transition-colors hover:bg-[#5a3b28]"
          >
            <Plus className="h-5 w-5" />
            Добавить
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-lg text-[#8a7566]">Загрузка...</div>
        ) : ranges.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-[#8a7566]">Фестивалей пока нет</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eadfd3] rounded-2xl border border-[#eadfd3] bg-white">
            {ranges.map((range) => {
              const fmt = (d: string | Date) =>
                new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
              return (
                <div key={range.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`h-3 w-3 shrink-0 rounded-full ${range.isActive ? 'bg-[#3f9d5a]' : 'bg-[#d8cabb]'}`}
                      title={range.isActive ? 'Активен' : 'Неактивен'}
                    />
                    <div className="min-w-0">
                      <h3 className={`truncate text-lg font-semibold ${range.isActive ? 'text-[#3d2f27]' : 'text-[#8a7566]'}`}>
                        {range.name || 'Без названия'}
                      </h3>
                      <div className="text-base text-[#a8917f]">
                        {fmt(range.startDate)} — {fmt(range.endDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(range)}
                      className="h-11 rounded-full px-4 text-base font-medium text-[#6b4a36] transition-colors hover:bg-[#f1e4d6]"
                    >
                      {range.isActive ? 'Выключить' : 'Включить'}
                    </button>
                    <button
                      onClick={() => handleEdit(range)}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[#a8917f] transition-colors hover:bg-[#f1e4d6] hover:text-[#5a3b28]"
                      title="Редактировать"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(range.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-[#a8917f] transition-colors hover:bg-[#fde4d8] hover:text-[#a8431f]"
                      title="Удалить"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Модальное окно для добавления/редактирования */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                  {editingRange ? 'Редактировать диапазон' : 'Новый диапазон дат'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingRange(null);
                  }}
                  className="text-gray-400 dark:text-muted-foreground hover:text-gray-600 dark:hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
                    Название (необязательно)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Например: Фестиваль 2024"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg focus:outline-none focus:border-gray-900 dark:focus:border-ring bg-white dark:bg-input text-gray-900 dark:text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
                    Дата начала <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    date={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    placeholder="Выберите дату начала"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-foreground mb-2">
                    Дата окончания <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    date={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    placeholder="Выберите дату окончания"
                    minDate={formData.startDate}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-gray-900 dark:text-primary border-gray-300 dark:border-border rounded focus:ring-gray-900 dark:focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-foreground">
                    Активен (бронирования разрешены в этом диапазоне)
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingRange(null);
                    }}
                    className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

