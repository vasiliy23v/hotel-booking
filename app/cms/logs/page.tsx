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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CalendarIcon, Download, RefreshCcw, AlertCircle, CheckCircle, AlertTriangle, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  details?: Record<string, unknown>;
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

const LOGS_PASSWORD = '2305'; // Пароль для доступа к логам (не отображается в интерфейсе)

export default function LogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Модальные окна
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showLogDetails, setShowLogDetails] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);
  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
  
  // Множественный выбор
  const [selectedLogIds, setSelectedLogIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  // Фильтры
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showStats, setShowStats] = useState(true);
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const logsPerPage = 10;

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

    // Для разработчика доступ без пароля, для остальных - требуется пароль
    if (userData.role === 'developer') {
      setIsAuthenticated(true);
      loadData();
    } else {
      // Проверяем, есть ли сохраненный пароль в localStorage
      const savedPassword = localStorage.getItem('logs_password_authenticated');
      if (savedPassword === 'true') {
        setIsAuthenticated(true);
        loadData();
      } else {
        setPasswordRequired(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadLogs(), loadUserStats()]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      toast.error('Ошибка загрузки данных: ' + errorMessage);
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
      params.append('limit', logsPerPage.toString());
      params.append('offset', ((currentPage - 1) * logsPerPage).toString());

      const response = await fetch(`/api/logs?${params.toString()}`);
      const data = await response.json();
      setLogs(data.logs || []);
      setTotalLogs(data.total || 0);
    } catch (error) {
      console.error('Error loading logs:', error);
      setLogs([]);
      setTotalLogs(0);
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
      setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
      loadLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, statusFilter, entityFilter, startDate, endDate, currentUser]);

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      loadLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Сброс выбора при изменении списка логов
  useEffect(() => {
    setSelectedLogIds(new Set());
    setSelectAll(false);
  }, [logs]);

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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === LOGS_PASSWORD) {
      // Сохраняем факт успешной авторизации в localStorage
      localStorage.setItem('logs_password_authenticated', 'true');
      setIsAuthenticated(true);
      setPasswordRequired(false);
      setPasswordInput('');
      loadData();
    } else {
      toast.error('Неверный пароль');
      setPasswordInput('');
    }
  };

  const handleViewLog = (log: ActivityLog) => {
    setSelectedLog(log);
    setShowLogDetails(true);
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const response = await fetch(`/api/logs?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Лог удален');
        setDeleteLogId(null);
        setSelectedLogIds(new Set());
        // Обновляем таблицу после удаления
        await loadLogs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Ошибка при удалении лога');
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      toast.error('Ошибка при удалении лога');
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedLogIds(new Set());
      setSelectAll(false);
    } else {
      const allIds = new Set(logs.map(log => log.id));
      setSelectedLogIds(allIds);
      setSelectAll(true);
    }
  };

  const handleToggleLogSelect = (logId: string) => {
    const newSelected = new Set(selectedLogIds);
    if (newSelected.has(logId)) {
      newSelected.delete(logId);
    } else {
      newSelected.add(logId);
    }
    setSelectedLogIds(newSelected);
    setSelectAll(newSelected.size === logs.length);
  };

  const handleDeleteSelected = () => {
    if (selectedLogIds.size === 0) {
      toast.error('Выберите логи для удаления');
      return;
    }
    setDeleteSelectedOpen(true);
  };

  const confirmDeleteSelected = async () => {
    try {
      const idsArray = Array.from(selectedLogIds);
      const response = await fetch(`/api/logs?ids=${idsArray.join(',')}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`Удалено логов: ${data.deleted || idsArray.length}`);
        setSelectedLogIds(new Set());
        setSelectAll(false);
        setDeleteSelectedOpen(false);
        // Обновляем таблицу после удаления
        await loadLogs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Ошибка при удалении логов');
      }
    } catch (error) {
      console.error('Error deleting logs:', error);
      toast.error('Ошибка при удалении логов');
    }
  };

  const filteredStats = userStats.filter(stat =>
    stat.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Экран ввода пароля
  if (passwordRequired && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Доступ к логам</h2>
          <p className="text-gray-600 mb-6 text-center">Введите пароль для доступа к логам системы</p>
          <form onSubmit={handlePasswordSubmit}>
            <Input
              type="password"
              placeholder="Пароль"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="mb-4"
              autoFocus
            />
            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => router.push('/cms/dashboard')}
          >
            Назад
          </Button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Логи системы</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Мониторинг активности пользователей</p>
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
                className="border border-gray-200 dark:border-border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-card"
                onClick={() => {
                  setSelectedUser(stat.userName);
                  setShowStats(false);
                }}
              >
                <div className="font-semibold text-lg text-gray-900 dark:text-foreground">{stat.userName}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.userRole && <span className="capitalize">{stat.userRole}</span>}
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                  {stat.totalActions}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">действий</span>
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
      <div className="bg-white dark:bg-card rounded-lg shadow mb-6 p-6 border border-gray-200 dark:border-border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-foreground">Фильтры</h2>
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
      <div className="bg-white dark:bg-card rounded-lg shadow border border-gray-200 dark:border-border">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
              Логи действий
              {selectedUser && <span className="text-blue-600 dark:text-blue-400 ml-2">({selectedUser})</span>}
            </h2>
            <div className="flex gap-2">
              {selectedLogIds.size > 0 && (
                <Button 
                  onClick={handleDeleteSelected} 
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить выбранные ({selectedLogIds.size})
                </Button>
              )}
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
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Логи не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleToggleSelectAll}
                        className="cursor-pointer"
                        title="Выделить все"
                      />
                    </TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата/Время</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Действие</TableHead>
                    <TableHead>Сущность</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Длительность</TableHead>
                    <TableHead>Ошибка</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow 
                      key={log.id} 
                      className={`${log.status === 'error' ? 'bg-red-50 dark:bg-red-900/20' : ''} ${selectedLogIds.has(log.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedLogIds.has(log.id)}
                          onChange={() => handleToggleLogSelect(log.id)}
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell>{getStatusIcon(log.status)}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(log.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-foreground">{log.userName}</div>
                        {log.userRole && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{log.userRole}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-foreground">{getActionLabel(log.action)}</TableCell>
                      <TableCell className="capitalize text-gray-900 dark:text-foreground">{log.entity}</TableCell>
                      <TableCell className="text-xs font-mono text-gray-600 dark:text-gray-400">{log.entityId?.slice(0, 8)}...</TableCell>
                      <TableCell className="text-gray-900 dark:text-foreground">{log.duration ? `${log.duration}мс` : '-'}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-red-600 dark:text-red-400">
                        {log.errorMessage || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewLog(log)}
                            title="Просмотреть полный лог"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteLogId(log.id)}
                            title="Удалить лог"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Пагинация */}
          {totalLogs > logsPerPage && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-border">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Показано {((currentPage - 1) * logsPerPage) + 1} - {Math.min(currentPage * logsPerPage, totalLogs)} из {totalLogs}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Назад
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, Math.ceil(totalLogs / logsPerPage)) }, (_, i) => {
                    const totalPages = Math.ceil(totalLogs / logsPerPage);
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalLogs / logsPerPage), prev + 1))}
                  disabled={currentPage >= Math.ceil(totalLogs / logsPerPage)}
                >
                  Вперед
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно просмотра полного лога */}
      <Sheet open={showLogDetails} onOpenChange={setShowLogDetails}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto bg-white dark:bg-card">
          <SheetHeader>
            <SheetTitle className="text-gray-900 dark:text-foreground">Полная информация о логе</SheetTitle>
            <SheetDescription className="text-gray-600 dark:text-gray-400">
              Детальная информация о выбранном действии
            </SheetDescription>
          </SheetHeader>
          {selectedLog && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-foreground">Основная информация</h3>
                <div className="bg-gray-50 dark:bg-muted p-4 rounded-lg space-y-2 text-sm border border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                  <div><span className="font-medium">ID:</span> {selectedLog.id}</div>
                  <div><span className="font-medium">Статус:</span> {selectedLog.status}</div>
                  <div><span className="font-medium">Действие:</span> {getActionLabel(selectedLog.action)}</div>
                  <div><span className="font-medium">Сущность:</span> {selectedLog.entity}</div>
                  <div><span className="font-medium">ID сущности:</span> {selectedLog.entityId || '-'}</div>
                  <div><span className="font-medium">Дата/Время:</span> {format(new Date(selectedLog.createdAt), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}</div>
                  {selectedLog.duration && (
                    <div><span className="font-medium">Длительность:</span> {selectedLog.duration}мс</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-foreground">Пользователь</h3>
                <div className="bg-gray-50 dark:bg-muted p-4 rounded-lg space-y-2 text-sm border border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                  <div><span className="font-medium">Имя:</span> {selectedLog.userName}</div>
                  {selectedLog.userId && (
                    <div><span className="font-medium">ID пользователя:</span> {selectedLog.userId}</div>
                  )}
                  {selectedLog.userRole && (
                    <div><span className="font-medium">Роль:</span> {selectedLog.userRole}</div>
                  )}
                </div>
              </div>

              {selectedLog.errorMessage && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-foreground">Ошибка</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-sm text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
                    {selectedLog.errorMessage}
                  </div>
                </div>
              )}

              {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-foreground">Детали</h3>
                  <div className="bg-gray-50 dark:bg-muted p-4 rounded-lg border border-gray-200 dark:border-border">
                    <pre className="text-xs overflow-x-auto text-gray-900 dark:text-foreground">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {(selectedLog.ipAddress || selectedLog.userAgent) && (
                <div>
                  <h3 className="font-semibold mb-2 text-gray-900 dark:text-foreground">Техническая информация</h3>
                  <div className="bg-gray-50 dark:bg-muted p-4 rounded-lg space-y-2 text-sm border border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                    {selectedLog.ipAddress && (
                      <div><span className="font-medium">IP адрес:</span> {selectedLog.ipAddress}</div>
                    )}
                    {selectedLog.userAgent && (
                      <div><span className="font-medium">User Agent:</span> {selectedLog.userAgent}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteLogId !== null} onOpenChange={(open) => !open && setDeleteLogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить лог?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить этот лог? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteLogId && handleDeleteLog(deleteLogId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Диалог подтверждения удаления выбранных логов */}
      <AlertDialog open={deleteSelectedOpen} onOpenChange={setDeleteSelectedOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить выбранные логи?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить {selectedLogIds.size} выбранных логов? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSelected}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить ({selectedLogIds.size})
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}




