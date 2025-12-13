'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, RefreshCcw, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ActivityLog {
  id: string;
  userId?: string;
  userName: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: any;
  status: 'success' | 'error' | 'warning';
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  createdAt: string;
}

interface UserStats {
  userName: string;
  userId?: string;
  userRole?: string;
  totalActions: number;
}

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Фильтры
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(user);
    setCurrentUser(userData);

    // Только менеджеры и разработчики могут просматривать логи
    if (userData.role !== 'manager' && userData.role !== 'developer') {
      toast.error('У вас нет доступа к этой странице');
      router.push('/dashboard');
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadLogs(), loadUserStats()]);
    } catch (error: any) {
      toast.error('Ошибка загрузки данных: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedUser) params.append('userName', selectedUser);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (entityFilter !== 'all') params.append('entity', entityFilter);
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());
      params.append('limit', '100');

      const response = await fetch(`/api/logs?${params.toString()}`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error loading logs:', error);
      setLogs([]);
    }
  };

  const loadUserStats = async () => {
    try {
      const params = new URLSearchParams();
      params.append('type', 'stats');
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await fetch(`/api/logs?${params.toString()}`);
      const data = await response.json();
      setUserStats(data.stats || []);
    } catch (error) {
      console.error('Error loading stats:', error);
      setUserStats([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadLogs();
    }
  }, [selectedUser, statusFilter, entityFilter, startDate, endDate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      room_created: 'Создание комнаты',
      room_updated: 'Обновление комнаты',
      room_deleted: 'Удаление комнаты',
      booking_created: 'Создание бронирования',
      booking_updated: 'Обновление бронирования',
      booking_cancelled: 'Отмена бронирования',
      booking_confirmed: 'Подтверждение бронирования',
      booking_paid: 'Оплата бронирования',
      hotel_created: 'Создание отеля',
      hotel_updated: 'Обновление отеля',
      user_login: 'Вход в систему',
      user_register: 'Регистрация',
      api_error: 'Ошибка API',
    };
    return labels[action] || action;
  };

  const exportToCSV = () => {
    const csv = [
      ['Дата', 'Пользователь', 'Действие', 'Сущность', 'Статус', 'Ошибка', 'Длительность (мс)'].join(','),
      ...logs.map(log =>
        [
          new Date(log.createdAt).toLocaleString('ru-RU'),
          log.userName,
          getActionLabel(log.action),
          log.entity,
          log.status,
          log.errorMessage || '',
          log.duration || '',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
    link.click();
  };

  const filteredStats = userStats.filter(stat =>
    stat.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка логов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Логи системы</h1>
          <p className="text-gray-600 mt-1">Мониторинг активности пользователей</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} variant="outline">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт CSV
          </Button>
          <Button onClick={() => router.push('/cms/dashboard')}>
            Назад к CMS
          </Button>
        </div>
      </div>

      {/* Статистика по пользователям */}
      {showStats && (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Статистика по пользователям</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowStats(false)}>
              Скрыть
            </Button>
          </div>
          <Input
            placeholder="Поиск по имени пользователя..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStats.map((stat, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedUser(stat.userName);
                  setShowStats(false);
                }}
              >
                <div className="font-semibold text-lg">{stat.userName}</div>
                <div className="text-sm text-gray-600">
                  {stat.userRole && <span className="capitalize">{stat.userRole}</span>}
                </div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  {stat.totalActions}
                  <span className="text-sm font-normal text-gray-600 ml-2">действий</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showStats && (
        <Button variant="outline" size="sm" onClick={() => setShowStats(true)} className="mb-4">
          Показать статистику
        </Button>
      )}

      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Пользователь</label>
            <Input
              placeholder="Имя пользователя"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Статус</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="success">Успешно</option>
              <option value="error">Ошибки</option>
              <option value="warning">Предупреждения</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Сущность</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="room">Комнаты</option>
              <option value="booking">Бронирования</option>
              <option value="hotel">Отели</option>
              <option value="user">Пользователи</option>
              <option value="system">Система</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Дата от</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PP', { locale: ru }) : 'Выберите'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={ru} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Дата до</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PP', { locale: ru }) : 'Выберите'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={ru} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {(selectedUser || statusFilter !== 'all' || entityFilter !== 'all' || startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSelectedUser('');
              setStatusFilter('all');
              setEntityFilter('all');
              setStartDate(undefined);
              setEndDate(undefined);
            }}
          >
            Сбросить фильтры
          </Button>
        )}
      </div>

      {/* Таблица логов */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Логи действий
            {selectedUser && <span className="text-blue-600 ml-2">({selectedUser})</span>}
          </h2>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Логи не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата/Время</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Действие</TableHead>
                    <TableHead>Сущность</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Длительность</TableHead>
                    <TableHead>Ошибка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className={log.status === 'error' ? 'bg-red-50' : ''}>
                      <TableCell>{getStatusIcon(log.status)}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(log.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.userName}</div>
                        {log.userRole && (
                          <div className="text-xs text-gray-500 capitalize">{log.userRole}</div>
                        )}
                      </TableCell>
                      <TableCell>{getActionLabel(log.action)}</TableCell>
                      <TableCell className="capitalize">{log.entity}</TableCell>
                      <TableCell className="text-xs font-mono">{log.entityId?.slice(0, 8)}...</TableCell>
                      <TableCell>{log.duration ? `${log.duration}мс` : '-'}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-red-600">
                        {log.errorMessage || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



