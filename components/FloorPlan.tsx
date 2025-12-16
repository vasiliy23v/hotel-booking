'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Rnd } from 'react-rnd';
import { 
  Bed, Users, DoorOpen, Lock, CheckCircle, Edit2, Plus, X, Trash2, 
  ArrowUpDown, Copy, ShowerHead, Toilet, Grid3x3, Loader2, Calendar,
  ArrowLeft, ArrowRight, Info, Eye, EyeOff
} from 'lucide-react';
import type { Room, Stairs, BookingInfo } from '@/types';
import { api } from '@/lib/api';

interface FloorPlanProps {
  rooms: Room[];
  floor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG';
  onRoomClick: (room: Room) => void;
  onRoomUpdate?: (room: Room) => void;
  onRoomCreate?: (room: Room) => void;
  onCancelBooking?: (bookingId: string) => void;
  currentUser: string;
  isManager: boolean;
  stairs?: Stairs[];
  onStairsUpdate?: (stairs: Stairs[]) => void;
  hotelId?: string;
  dateFilterEnabled?: boolean;
  checkInDate?: string;
  checkOutDate?: string;
  loadingAvailability?: boolean;
  roomsAvailability?: Record<string, boolean>;
}

export default function FloorPlan({
  rooms,
  floor,
  onRoomClick,
  onRoomUpdate,
  onRoomCreate,
  onCancelBooking,
  currentUser,
  isManager,
  stairs = [],
  onStairsUpdate,
  hotelId,
  dateFilterEnabled: externalDateFilterEnabled,
  checkInDate: externalCheckInDate,
  checkOutDate: externalCheckOutDate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadingAvailability,
  roomsAvailability
}: FloorPlanProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<Set<string>>(new Set());
  const [copiedRooms, setCopiedRooms] = useState<Room[]>([]);
  const [showFloorSelectModal, setShowFloorSelectModal] = useState(false);
  const [copyingType, setCopyingType] = useState<'rooms' | 'stairs'>('rooms');
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [roomStartPos, setRoomStartPos] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectedStairs, setSelectedStairs] = useState<string | null>(null);
  const [selectedStairsSet, setSelectedStairsSet] = useState<Set<string>>(new Set());
  const [copiedStairs, setCopiedStairs] = useState<Stairs[]>([]);
  const [addingStairs, setAddingStairs] = useState(false);
  const [draggingStairs, setDraggingStairs] = useState<string | null>(null);
  const [stairsStartPos, setStairsStartPos] = useState({ x: 0, y: 0 });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [editingStairs, setEditingStairs] = useState<Stairs | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  // Используем внешние пропсы для фильтра по датам, если они переданы, иначе локальные состояния
  const [internalDateFilterEnabled] = useState(false);
  const [internalCheckInDate] = useState('');
  const [internalCheckOutDate] = useState('');
  // Состояние для отображения информации о бронировании (хранится в localStorage)
  const [showBookingInfo, setShowBookingInfo] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('floorPlan_showBookingInfo');
      return saved !== null ? saved === 'true' : true; // По умолчанию показываем
    }
    return true;
  });
  const dateFilterEnabled = externalDateFilterEnabled !== undefined ? externalDateFilterEnabled : internalDateFilterEnabled;
  const checkInDate = externalCheckInDate !== undefined ? externalCheckInDate : internalCheckInDate;
  const checkOutDate = externalCheckOutDate !== undefined ? externalCheckOutDate : internalCheckOutDate;
  const [internalRoomsAvailability, setRoomsAvailability] = useState<Record<string, boolean>>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [internalLoadingAvailability, setLoadingAvailability] = useState(false);
  const roomsAvailabilityState = roomsAvailability !== undefined ? roomsAvailability : internalRoomsAvailability;
  // const loadingAvailabilityState = loadingAvailability !== undefined ? loadingAvailability : internalLoadingAvailability;
  // Счетчик обновлений для принудительного перерисовывания комнат при изменении доступности
  const [availabilityUpdateKey, setAvailabilityUpdateKey] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [bookingsPopupRoom, setBookingsPopupRoom] = useState<Room | null>(null);
  const planContainerRef = useRef<HTMLDivElement>(null);
  const SNAP_SIZE = 10;
  const GRID_SIZE = 10; // Размер сетки для отображения
  // Храним начальные позиции выбранных комнат при начале перетаскивания
  const dragStartPositions = useRef<Map<string, { x: number; y: number }>>(new Map());
  // Храним начальные размеры выбранных комнат при начале изменения размера
  const resizeStartSizes = useRef<Map<string, { width: number; height: number }>>(new Map());
  
  // Локальные состояния для редактирования (изменения не сохраняются до нажатия "Завершить")
  const [localRooms, setLocalRooms] = useState<Room[]>([]);
  const [localStairs, setLocalStairs] = useState<Stairs[]>([]);
  const [originalRooms, setOriginalRooms] = useState<Room[]>([]);
  const [originalStairs, setOriginalStairs] = useState<Stairs[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Счетчик для генерации уникальных ID
  const idCounterRef = useRef(0);
  
  // Функция для генерации уникального ID
  // Вызывается только в обработчиках событий, не во время рендера
  const generateId = () => {
    idCounterRef.current += 1;
    return `${Date.now()}-${idCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Функция для вставки скопированных комнат на текущий этаж
  const handlePasteRooms = useCallback(() => {
    if (copiedRooms.length === 0 || !editMode) return;
    
    // Находим максимальный zIndex для правильного наложения
    const maxZIndex = localRooms.reduce((max, r) => Math.max(max, r.zIndex || 1), 1);
    
    // Вычисляем смещение для позиции (чтобы вставленные комнаты не накладывались на оригиналы)
    const offset = 30;
    
    // Находим минимальные координаты скопированных комнат для вычисления смещения
    const minX = Math.min(...copiedRooms.map(r => r.position.x));
    const minY = Math.min(...copiedRooms.map(r => r.position.y));
    
    // Копируем комнаты на текущий этаж
    const duplicatedRooms: Room[] = copiedRooms.map((room, index) => {
      return {
        ...room,
        id: `room-${generateId()}`,
        number: `${room.number}-copy`,
        floor: floor, // Оставляем на текущем этаже
        position: {
          x: Math.round(room.position.x - minX + offset),
          y: Math.round(room.position.y - minY + offset)
        },
        zIndex: maxZIndex + index + 1,
        width: room.width || 120,
        height: room.height || 100
      };
    });
    
    // Добавляем в локальное состояние
    setLocalRooms([...localRooms, ...duplicatedRooms]);
    
    // Выделяем вставленные комнаты
    const newSelectedIds = new Set(duplicatedRooms.map(r => r.id));
    setSelectedRooms(newSelectedIds);
    setSelectedRoom(duplicatedRooms[0]?.id || null);
  }, [copiedRooms, editMode, localRooms, floor, setLocalRooms, setSelectedRooms, setSelectedRoom]);

  // Функция для вставки скопированных ступеней на текущий этаж
  const handlePasteStairs = useCallback(() => {
    if (copiedStairs.length === 0 || !editMode) return;
    
    // Вычисляем смещение для позиции (чтобы вставленные ступени не накладывались на оригиналы)
    const offset = 30;
    
    // Находим минимальные координаты скопированных ступеней для вычисления смещения
    const minX = Math.min(...copiedStairs.map(s => s.position.x));
    const minY = Math.min(...copiedStairs.map(s => s.position.y));
    
      // Копируем ступени на текущий этаж
      // ВАЖНО: Создаем НОВЫЕ ступени с НОВЫМИ уникальными ID
      const duplicatedStairs: Stairs[] = copiedStairs.map((stair) => {
        return {
          ...stair,
          id: `stairs-${generateId()}`, // НОВЫЙ уникальный ID
          hotelId: stair.hotelId || hotelId || '',
          floor: floor, // Оставляем на текущем этаже
          targetFloor: stair.targetFloor, // Сохраняем целевой этаж
          position: {
            x: Math.round(stair.position.x - minX + offset),
            y: Math.round(stair.position.y - minY + offset)
          },
          width: stair.width, // Сохраняем размеры
          height: stair.height,
          direction: stair.direction // Сохраняем направление
        };
      });
    
    // Добавляем в локальное состояние используя функциональное обновление
    setLocalStairs(prevStairs => {
      // Проверяем, что новые ID не дублируются с существующими
      const existingIds = new Set(prevStairs.map(s => s.id));
      const newStairs = duplicatedStairs.filter(s => !existingIds.has(s.id));
      
      if (newStairs.length !== duplicatedStairs.length) {
        console.warn('handlePasteStairs: some stairs have duplicate IDs, skipping them');
      }
      
      return [...prevStairs, ...newStairs];
    });
    
    // Выделяем вставленные ступени
    const newSelectedIds = new Set(duplicatedStairs.map(s => s.id));
    setSelectedStairsSet(newSelectedIds);
    setSelectedStairs(duplicatedStairs[0]?.id || null);
  }, [copiedStairs, editMode, floor, hotelId]);

  // Обработка горячих клавиш для копирования и вставки
  useEffect(() => {
    if (typeof window === 'undefined' || !editMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C или Cmd+C - копирование
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedRooms.size > 0) {
          e.preventDefault();
          const roomsToCopy = localRooms.filter(r => selectedRooms.has(r.id));
          if (roomsToCopy.length > 0) {
            setCopiedRooms(roomsToCopy);
            setCopiedStairs([]); // Очищаем скопированные ступени при копировании комнат
          }
        } else if (selectedStairsSet.size > 0) {
          e.preventDefault();
          const stairsToCopy = localStairs.filter(s => selectedStairsSet.has(s.id));
          if (stairsToCopy.length > 0) {
            setCopiedStairs(stairsToCopy);
            setCopiedRooms([]); // Очищаем скопированные комнаты при копировании ступеней
          }
        }
      }
      
      // Ctrl+V или Cmd+V - вставка
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (copiedRooms.length > 0) {
          e.preventDefault();
          handlePasteRooms();
        } else if (copiedStairs.length > 0) {
          e.preventDefault();
          handlePasteStairs();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editMode, selectedRooms, localRooms, copiedRooms, handlePasteRooms, selectedStairsSet, localStairs, copiedStairs, handlePasteStairs]);

  // Инициализация локальных состояний при входе/выходе из режима редактирования
  const prevEditModeRef = useRef(editMode);
  
  useEffect(() => {
    // Обновляем локальные состояния только при изменении editMode
    if (editMode && !prevEditModeRef.current) {
      // Вход в режим редактирования
      setOriginalRooms([...rooms]);
      setOriginalStairs([...stairs]);
      setLocalRooms([...rooms]);
      setLocalStairs([...stairs]);
    } else if (!editMode && prevEditModeRef.current) {
      // Выход из режима редактирования
      setLocalRooms([]);
      setLocalStairs([]);
      setOriginalRooms([]);
      setOriginalStairs([]);
      setSelectedRoom(null);
      setSelectedRooms(new Set());
      setCopiedRooms([]);
      setSelectedStairs(null);
      setSelectedStairsSet(new Set());
      setCopiedStairs([]);
      setShowFloorSelectModal(false);
      setCopyingType('rooms');
    }
    
    prevEditModeRef.current = editMode;
  }, [editMode, rooms, stairs]);

  // Используем локальные данные в режиме редактирования, иначе оригинальные
  const displayRooms = editMode ? localRooms : rooms;
  const displayStairs = editMode ? localStairs : stairs;

  const floorRooms = useMemo(() => {
    return displayRooms.filter(r => r.floor === floor).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  }, [displayRooms, floor]);
  
  const floorStairs = displayStairs.filter(s => s.floor === floor);

  // Проверка доступности комнат по выбранным датам
  // Выполняется каждый раз при изменении дат или включении/выключении фильтра
  useEffect(() => {
    if (!dateFilterEnabled || !checkInDate || !checkOutDate) {
      setRoomsAvailability({});
      setLoadingAvailability(false);
      return;
    }

    // Проверяем, что обе даты валидны
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    // Если дата выезда раньше или равна дате заезда - это ошибка
    // (автоматически добавляем +1 день при одинаковых датах в onChange)
    if (checkOut <= checkIn) {
      setRoomsAvailability({});
      setLoadingAvailability(false);
      return;
    }

    const checkAvailability = async () => {
      const nonCommonRooms = floorRooms.filter(r => !r.isCommon);
      if (nonCommonRooms.length === 0) {
        setRoomsAvailability({});
        setLoadingAvailability(false);
        return;
      }

      setLoadingAvailability(true);
      try {
        const roomIds = nonCommonRooms.map(r => r.id);
        const availability = await api.checkRoomsAvailability(roomIds, checkInDate, checkOutDate);
        setRoomsAvailability(availability);
        // Увеличиваем счетчик для принудительного обновления компонентов
        setAvailabilityUpdateKey(prev => prev + 1);
      } catch (error) {
        console.error('Error checking rooms availability:', error);
        setRoomsAvailability({});
        setAvailabilityUpdateKey(prev => prev + 1);
      } finally {
        setLoadingAvailability(false);
      }
    };

    // Небольшая задержка для debounce при быстром изменении дат
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dateFilterEnabled, checkInDate, checkOutDate, floorRooms]);

  // Вычисляем размеры контейнера на основе позиций комнат и ступеней
  const calculateContainerSize = () => {
    if (floorRooms.length === 0 && floorStairs.length === 0) {
      return { width: 800, height: 600 };
    }
    
    let maxX = 0;
    let maxY = 0;
    
    floorRooms.forEach(room => {
      const width = room.width || 120;
      const height = room.height || 100;
      maxX = Math.max(maxX, room.position.x + width);
      maxY = Math.max(maxY, room.position.y + height);
    });
    
    floorStairs.forEach(stair => {
      maxX = Math.max(maxX, stair.position.x + stair.width);
      maxY = Math.max(maxY, stair.position.y + stair.height);
    });
    
    // Добавляем отступы
    return {
      width: Math.max(800, maxX + 100),
      height: Math.max(600, maxY + 100)
    };
  };

  const containerSize = calculateContainerSize();
  const isMobile = windowWidth < 768;
  const isLargeScreen = windowWidth >= 1920;

  // Проверка видимости плана в viewport и показ подсказки для мобильных
  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile || hasScrolled) return;

    const checkVisibility = () => {
      if (!planContainerRef.current) return;

      const rect = planContainerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Проверяем, что план виден и занимает около 70% viewport
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      // const planHeight = rect.height;
      const visiblePercentage = (visibleHeight / viewportHeight) * 100;
      
      // Показываем подсказку, если план занимает около 70% или больше viewport
      const isVisible = rect.top < viewportHeight && rect.bottom > 0;
      const shouldShow = isVisible && visiblePercentage >= 60 && visiblePercentage <= 80 && !hasScrolled;
      
      if (shouldShow && !hasScrolled) {
        setShowScrollHint(true);
      } else if (!shouldShow) {
        // Не скрываем подсказку автоматически, только если план полностью скрыт
        if (rect.bottom < 0 || rect.top > viewportHeight) {
          setShowScrollHint(false);
        }
      }
    };

    // Проверяем при монтировании и при скролле
    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [isMobile, hasScrolled]);

  // Функция для закрытия подсказки
  const handleCloseHint = () => {
    setShowScrollHint(false);
    setHasScrolled(true);
  };
  
  // Масштаб для мобильных устройств - уменьшаем план пропорционально ширине экрана
  // Базовое значение: для экрана 375px (типичный мобильный) масштаб ~0.5-0.6
  // Для экрана 768px (планшет) масштаб ~0.9-1.0
  const mobileScale = isMobile 
    ? Math.max(0.5, Math.min(windowWidth / 600, 1.0))
    : 1;
  
  // Масштаб для больших экранов - уменьшаем для лучшей видимости
  const largeScreenScale = isLargeScreen ? Math.min(windowWidth / 1920, 1.2) : 1;
  
  // Общий масштаб (приоритет мобильному, если это мобильное устройство)
  const scale = isMobile ? mobileScale : largeScreenScale;
  
  // Масштабируем размеры контейнера
  const scaledContainerHeight = containerSize.height * scale;

  // Функции для определения цвета и иконки комнаты
  // Используем useCallback чтобы они пересчитывались при изменении roomsAvailability
  const getRoomColor = useCallback((room: Room) => {
    if (room.isCommon) return 'bg-gray-200 dark:bg-muted border-gray-400 dark:border-border';
    
    // Если включен фильтр по датам, используем информацию о доступности
    if (dateFilterEnabled && checkInDate && checkOutDate) {
      const isAvailable = roomsAvailabilityState[room.id];
      if (isAvailable === false) {
        // Комната занята в выбранные даты
        return 'bg-red-100 border-red-400 hover:bg-red-200 dark:bg-red-900/20 dark:border-red-600/20 dark:hover:bg-red-800';
      } else if (isAvailable === true) {
        // Комната свободна в выбранные даты
        return 'bg-emerald-100 border-emerald-400 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-600 dark:hover:bg-emerald-800';
      }
      // Если информация еще загружается, показываем нейтральный цвет
      return 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-600 dark:hover:bg-yellow-800';
    }
    
    // Без фильтра по датам - используем текущие бронирования
    const activeBookings = room.bookings || (room.booking ? [room.booking] : []);
    if (activeBookings.length === 0) return 'bg-emerald-100 border-emerald-400 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-600/20 dark:hover:bg-emerald-800';
    // Забронированные комнаты всегда красные для всех
    return 'bg-red-100 border-red-400 hover:bg-red-200 dark:bg-red-900 dark:border-red-600 dark:hover:bg-red-800';
  }, [dateFilterEnabled, checkInDate, checkOutDate, roomsAvailabilityState]);

  const getRoomIcon = useCallback((room: Room) => {
    if (room.isCommon) return <Lock className="w-4 h-4 text-gray-600 dark:text-muted-foreground" />;
    
    // Если включен фильтр по датам, используем информацию о доступности
    if (dateFilterEnabled && checkInDate && checkOutDate) {
      const isAvailable = roomsAvailabilityState[room.id];
      if (isAvailable === false) {
        // Комната занята в выбранные даты
        return <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />;
      } else if (isAvailable === true) {
        // Комната свободна в выбранные даты
        return <DoorOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      }
      // Если информация еще загружается, показываем нейтральный цвет
      return <Loader2 className="w-4 h-4 text-yellow-600 animate-spin dark:text-yellow-400" />;
    }
    
    // Без фильтра по датам - используем текущее бронирование
    if (!room.booking) return <DoorOpen className="w-4 h-4 text-emerald-600" />;
    const isMyBooking = room.booking.bookedBy === currentUser;
    if (isMyBooking) return <CheckCircle className="w-4 h-4 text-gray-700 dark:text-foreground" />;
    return <Lock className="w-4 h-4 text-gray-600 dark:text-muted-foreground" />;
  }, [dateFilterEnabled, checkInDate, checkOutDate, roomsAvailabilityState, currentUser]);

  // Функция для форматирования кроватей в формат "1-HB 2-EB"
  const formatBeds = (beds: string[]): string => {
    if (!beds || beds.length === 0) return '';
    
    // Группируем кровати по типу
    const bedCounts: Record<string, number> = {};
    
    beds.forEach(bed => {
      if (!bed || !bed.trim()) return;
      
      // Обрабатываем разные форматы: "1-HB", "HB", "1-HB, 2-EB", "1 DB" и т.д.
      const trimmed = bed.trim();
      
      // Проверяем формат "число-тип" или "число тип"
      const matchWithCount = trimmed.match(/^(\d+)[-\s]+([A-Z]+)$/i);
      if (matchWithCount) {
        const count = parseInt(matchWithCount[1]);
        const type = matchWithCount[2].toUpperCase();
        bedCounts[type] = (bedCounts[type] || 0) + count;
      } else {
        // Просто тип без количества - считаем как 1
        const type = trimmed.toUpperCase();
        if (type) {
          bedCounts[type] = (bedCounts[type] || 0) + 1;
        }
      }
    });
    
    // Форматируем результат: "1-HB 2-EB"
    return Object.entries(bedCounts)
      .sort(([a], [b]) => a.localeCompare(b)) // Сортируем по типу для консистентности
      .map(([type, count]) => `${count}-${type}`)
      .join(' ');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleMouseDown = (_e: React.MouseEvent, _roomId: string) => {
    // Функция оставлена для обратной совместимости
  };

  const snapPosition = (x: number, y: number) => {
    if (!snapToGrid) return { x, y };
    return {
      x: Math.round(x / SNAP_SIZE) * SNAP_SIZE,
      y: Math.round(y / SNAP_SIZE) * SNAP_SIZE
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && editMode) {
      // Используем комнату из локального состояния для получения актуальных данных
      const localRoom = localRooms.find(r => r.id === dragging);
      if (!localRoom) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Учитываем масштаб при перетаскивании
      const adjustedDeltaX = deltaX / scale;
      const adjustedDeltaY = deltaY / scale;

      let newPos = {
        x: Math.max(0, roomStartPos.x + adjustedDeltaX),
        y: Math.max(0, roomStartPos.y + adjustedDeltaY)
      };

      if (snapToGrid) {
        newPos = snapPosition(newPos.x, newPos.y);
      }

      // Обновляем только локальное состояние, сохраняя все остальные свойства комнаты
      const updatedRooms = localRooms.map(r => 
        r.id === dragging 
          ? { ...r, position: { x: newPos.x, y: newPos.y } }
          : r
      );
      setLocalRooms(updatedRooms);
    }

    if (resizing && editMode) {
      const room = floorRooms.find(r => r.id === resizing);
      if (!room) return;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      // Учитываем масштаб при изменении размера
      const adjustedDeltaX = deltaX / scale;
      const adjustedDeltaY = deltaY / scale;

      // Обновляем только локальное состояние
      const updatedRooms = localRooms.map(r => {
        if (r.id === resizing) {
          return {
            ...r,
            width: resizeStart.width + adjustedDeltaX,
            height: resizeStart.height + adjustedDeltaY
          };
        }
        return r;
      });
      setLocalRooms(updatedRooms);
    }

    if (draggingStairs && editMode) {
      const stair = floorStairs.find(s => s.id === draggingStairs);
      if (!stair) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Учитываем масштаб при перетаскивании
      const adjustedDeltaX = deltaX / scale;
      const adjustedDeltaY = deltaY / scale;

      let newPos = {
        x: Math.max(0, stairsStartPos.x + adjustedDeltaX),
        y: Math.max(0, stairsStartPos.y + adjustedDeltaY)
      };

      if (snapToGrid) {
        newPos = snapPosition(newPos.x, newPos.y);
      }

      // Обновляем только локальное состояние
      const updatedStairs = localStairs.map(s =>
        s.id === draggingStairs
          ? { ...s, position: newPos }
          : s
      );
      setLocalStairs(updatedStairs);
    }
  };

  // Функция автосохранения комнаты
  const autoSaveRoom = async (roomId: string) => {
    if (!onRoomUpdate || !editMode) return;
    
    const localRoom = localRooms.find(r => r.id === roomId);
    if (!localRoom) return;
    
    const originalRoom = originalRooms.find(r => r.id === roomId);
    if (!originalRoom) {
      // Если комнаты нет в оригинальных, значит это новая комната - не сохраняем автосохранением
      return;
    }
    
    // Проверяем, были ли изменения позиции или размера
    const positionChanged = 
      originalRoom.position.x !== localRoom.position.x || 
      originalRoom.position.y !== localRoom.position.y;
    const sizeChanged = 
      (originalRoom.width || 0) !== (localRoom.width || 0) || 
      (originalRoom.height || 0) !== (localRoom.height || 0);
    
    if (positionChanged || sizeChanged) {
      try {
        await onRoomUpdate(localRoom);
        // Обновляем оригинальную комнату после успешного сохранения
        setOriginalRooms(originalRooms.map(r => r.id === roomId ? localRoom : r));
      } catch (error) {
        console.error('Ошибка при автосохранении комнаты:', error);
      }
    }
  };

  const handleMouseUp = async () => {
    // Автосохранение при завершении перемещения
    if (dragging && onRoomUpdate) {
      await autoSaveRoom(dragging);
    }
    
    // Автосохранение при завершении изменения размера
    if (resizing && onRoomUpdate) {
      await autoSaveRoom(resizing);
    }
    
    setDragging(null);
    setResizing(null);
    setDraggingStairs(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleResizeStart = (_e: React.MouseEvent, _roomId: string) => {
    // Функция оставлена для обратной совместимости
  };

  // Храним время последнего клика для обработки двойного клика (используем performance.now вместо Date.now)
  const lastClickTime = useRef<{ roomId: string; time: number } | null>(null);

  const handleRoomClick = async (room: Room, e?: React.MouseEvent) => {
    if (dragging || resizing) return;

    if (editMode) {
      // Обработка двойного клика для редактирования
      const now = typeof window !== 'undefined' ? performance.now() : 0;
      if (lastClickTime.current?.roomId === room.id && now - lastClickTime.current.time < 300) {
        // Двойной клик - открываем редактирование
        e?.stopPropagation();
        // Автосохранение предыдущей комнаты, если она редактировалась
        if (editingRoom && editingRoom.id !== room.id) {
          await autoSaveRoom(editingRoom.id);
        }
        setEditingRoom(room);
        setSelectedRoom(room.id);
        setSelectedRooms(new Set([room.id]));
        lastClickTime.current = null;
        return;
      }
      lastClickTime.current = { roomId: room.id, time: now };

      // Множественный выбор с Ctrl/Cmd или Shift
      if (e && (e.ctrlKey || e.metaKey || e.shiftKey)) {
        setSelectedRooms(prev => {
          const newSet = new Set(prev);
          if (newSet.has(room.id)) {
            newSet.delete(room.id);
            if (selectedRoom === room.id) {
              setSelectedRoom(newSet.size > 0 ? Array.from(newSet)[0] : null);
            }
          } else {
            newSet.add(room.id);
            setSelectedRoom(room.id);
          }
          return newSet;
        });
      } else {
        // Одиночный выбор
        setSelectedRoom(room.id);
        setSelectedRooms(new Set([room.id]));
      }
      return;
    }
    if (!room.isCommon) {
      // Получаем все активные бронирования комнаты
      const activeBookings = room.bookings || (room.booking ? [room.booking] : []);
      
      // Если есть бронирования и фильтр по датам активен, проверяем пересечение
      if (activeBookings.length > 0 && externalDateFilterEnabled && externalCheckInDate && externalCheckOutDate) {
        const filterCheckIn = new Date(externalCheckInDate);
        const filterCheckOut = new Date(externalCheckOutDate);
        
        const bookingsToShow = activeBookings.filter(booking => {
          const bookingCheckIn = new Date(booking.checkIn);
          const bookingCheckOut = new Date(booking.checkOut);
          return bookingCheckIn < filterCheckOut && bookingCheckOut > filterCheckIn;
        });
        
        // Если есть бронирования в выбранном диапазоне - предлагаем отменить (для менеджера) или показываем свое (для пользователя)
        if (bookingsToShow.length > 0) {
          const bookingToCancel = bookingsToShow[0];
          
          // Менеджер может отменить любое бронирование
          // Обычный пользователь может отменить только свое
          const canCancel = isManager || bookingToCancel.bookedBy === currentUser;
          
          if (canCancel && onCancelBooking) {
            if (confirm(`Отменить бронирование ${bookingToCancel.bookedBy} на период ${new Date(bookingToCancel.checkIn).toLocaleDateString('ru-RU')} - ${new Date(bookingToCancel.checkOut).toLocaleDateString('ru-RU')}?`)) {
              if (bookingToCancel.id) {
                onCancelBooking(bookingToCancel.id);
              }
            }
            return; // Не открываем форму, если отменяем бронирование
          }
        }
      }
      
      // Все пользователи могут открыть форму бронирования
      // Проверка доступности по датам будет происходить в форме
      onRoomClick(room);
    }
  };

  const handleRoomSave = async (room: Room) => {
    if (editingRoom && editMode) {
      const currentRoom = localRooms.find(r => r.id === editingRoom.id);
      const updatedRoom = {
        ...room,
        position: currentRoom?.position || room.position,
        width: room.width, // Используем размеры из формы
        height: room.height, // Используем размеры из формы
        zIndex: currentRoom?.zIndex || room.zIndex
      };
      // Обновляем локальное состояние
      setLocalRooms(localRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
      
      // Автосохранение в базу данных
      if (onRoomUpdate) {
        try {
          await onRoomUpdate(updatedRoom);
          // Обновляем оригинальную комнату после успешного сохранения
          setOriginalRooms(originalRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
        } catch (error) {
          console.error('Ошибка при сохранении комнаты:', error);
        }
      }
    } else if (onRoomCreate && editMode) {
      // Добавляем новую комнату в локальное состояние
      setLocalRooms([...localRooms, room]);
    } else if (onRoomCreate && !editMode) {
      // Если не в режиме редактирования, создаем сразу
      onRoomCreate(room);
    }
    setEditingRoom(null);
    setCreatingRoom(false);
    setSelectedRoom(null);
  };

  const handleAddStairs = (e: React.MouseEvent<HTMLDivElement>) => {
    // Проверяем, был ли клик на комнате или ступенях
    const target = e.target as HTMLElement;
    const clickedOnRoom = target.closest('[data-room-id]');
    const clickedOnStairs = target.closest('[data-stairs-id]');
    
    // Если клик был не на комнате и не на ступенях, снимаем выделение
    if (!clickedOnRoom && !clickedOnStairs) {
      if (selectedRoom) {
        setSelectedRoom(null);
      }
      if (selectedStairs) {
        setSelectedStairs(null);
      }
    }

    // Добавляем ступени только если включен режим добавления
    if (!editMode || !addingStairs) return;

    // Находим внутренний контейнер для правильного вычисления координат
    const outerContainer = e.currentTarget;
    const innerContainer = outerContainer.querySelector('div[style*="position: relative"]') as HTMLElement;
    
    let x: number;
    let y: number;
    
    if (innerContainer) {
      // Вычисляем позицию относительно внутреннего контейнера
      const innerRect = innerContainer.getBoundingClientRect();
      const scrollLeft = outerContainer.scrollLeft;
      const scrollTop = outerContainer.scrollTop;
      
      x = e.clientX - innerRect.left + scrollLeft - 40;
      y = e.clientY - innerRect.top + scrollTop - 40;
    } else {
      // Fallback на внешний контейнер, если внутренний не найден
      const rect = e.currentTarget.getBoundingClientRect();
      x = e.clientX - rect.left - 40;
      y = e.clientY - rect.top - 40;
    }

    // Учитываем масштаб при вычислении позиции
    x = x / scale;
    y = y / scale;

    if (snapToGrid) {
      const snapped = snapPosition(x, y);
      x = snapped.x;
      y = snapped.y;
    }

    const stairsHotelId = hotelId || floorRooms[0]?.hotelId || '';

    // Определяем целевой этаж динамически на основе текущего этажа
    const allFloors = ['EG', '1OG', '2OG', '3OG', '4OG', '5OG', '6OG'];
    const currentIndex = allFloors.indexOf(floor);
    const nextIndex = Math.min(currentIndex + 1, allFloors.length - 1);
    const targetFloor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG' = allFloors[nextIndex] as 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG';

    const newStairs: Stairs = {
      id: `stairs-${generateId()}`,
      hotelId: stairsHotelId,
      floor,
      position: { x: Math.max(0, x), y: Math.max(0, y) },
      width: 80,
      height: 80,
      direction: 'up',
      targetFloor
    };

    // Добавляем только в локальное состояние используя функциональное обновление
    setLocalStairs(prevStairs => [...prevStairs, newStairs]);
    setAddingStairs(false);
  };

  const handleDeleteStairs = async (stairsId: string) => {
    if (!editMode || !onStairsUpdate) return;
    
    // Если выбрано несколько ступеней, удаляем все выбранные
    if (selectedStairsSet.size > 1) {
      const stairsToDelete = localStairs.filter(s => selectedStairsSet.has(s.id));
      const count = stairsToDelete.length;
      if (confirm(`Удалить ${count} ${count === 1 ? 'ступень' : count < 5 ? 'ступени' : 'ступеней'}?`)) {
        // Удаляем все выбранные ступени из локального состояния
        const updatedStairs = localStairs.filter(s => !selectedStairsSet.has(s.id));
        setLocalStairs(updatedStairs);
        
        // Обновляем оригинальные ступени
        setOriginalStairs(originalStairs.filter(s => !selectedStairsSet.has(s.id)));
        
        // Автосохранение: передаем все ступени отеля, исключая удаленные
        const allStairsMap = new Map<string, Stairs>();
        
        // Добавляем все ступени из пропса (все ступени отеля)
        stairs.forEach(s => {
          // Пропускаем удаленные ступени
          if (!selectedStairsSet.has(s.id)) {
            allStairsMap.set(s.id, s);
          }
        });
        
        // Добавляем локальные (обновленные) ступени
        updatedStairs.forEach(s => {
          allStairsMap.set(s.id, s);
        });
        
        const finalAllStairs = Array.from(allStairsMap.values());
        
        try {
          await onStairsUpdate(finalAllStairs);
        } catch (error) {
          console.error('Ошибка при удалении ступеней:', error);
          alert('Ошибка при удалении ступеней');
        }
        
        // Сбрасываем выделение
        setSelectedStairsSet(new Set());
        setSelectedStairs(null);
      }
    } else {
      // Удаляем одну ступень
      if (confirm('Удалить эту ступень?')) {
        // Удаляем только из локального состояния
        const updatedStairs = localStairs.filter(s => s.id !== stairsId);
        setLocalStairs(updatedStairs);
        
        // Обновляем оригинальные ступени
        setOriginalStairs(originalStairs.filter(s => s.id !== stairsId));
        
        // Автосохранение: передаем все ступени отеля, исключая удаленную
        const allStairsMap = new Map<string, Stairs>();
        
        // Добавляем все ступени из пропса (все ступени отеля), исключая удаленную
        stairs.forEach(s => {
          if (s.id !== stairsId) {
            allStairsMap.set(s.id, s);
          }
        });
        
        // Добавляем локальные (обновленные) ступени
        updatedStairs.forEach(s => {
          allStairsMap.set(s.id, s);
        });
        
        const finalAllStairs = Array.from(allStairsMap.values());
        
        try {
          await onStairsUpdate(finalAllStairs);
        } catch (error) {
          console.error('Ошибка при удалении ступени:', error);
          alert('Ошибка при удалении ступени');
        }
        
        // Сбрасываем выделение
        setSelectedStairsSet(new Set());
        setSelectedStairs(null);
      }
    }
  };

  const handleStairsSave = (updatedStairs: Stairs) => {
    if (editingStairs && editMode) {
      // Сохраняем все изменения из формы, включая размеры
      const finalStairs = {
        ...updatedStairs
      };
      // Обновляем только локальное состояние
      setLocalStairs(localStairs.map(s => s.id === finalStairs.id ? finalStairs : s));
    }
    setEditingStairs(null);
    setSelectedStairs(null);
  };

  const handleDuplicateStairs = (stairs: Stairs) => {
    if (editMode) {
      // Если выбрано несколько ступеней, копируем на другой этаж
      if (selectedStairsSet.size > 1) {
        handleDuplicateMultipleStairs();
        return;
      }
      
      // Копирование одной ступени
      // Создаем НОВУЮ ступень на основе текущей с новым ID и немного смещенной позицией
      const duplicatedStairs: Stairs = {
        ...stairs,
        id: `stairs-${generateId()}`, // Новый уникальный ID
        hotelId: stairs.hotelId || hotelId || '',
        floor: stairs.floor, // Сохраняем тот же этаж
        targetFloor: stairs.targetFloor, // Сохраняем целевой этаж
        position: {
          x: stairs.position.x + stairs.width + 20, // Смещаем позицию
          y: stairs.position.y
        },
        width: stairs.width, // Сохраняем размеры
        height: stairs.height,
        direction: stairs.direction // Сохраняем направление
      };
      // Добавляем в локальное состояние используя функциональное обновление
      setLocalStairs(prevStairs => [...prevStairs, duplicatedStairs]);
      // Выделяем новые ступени
      setSelectedStairs(duplicatedStairs.id);
      setSelectedStairsSet(new Set([duplicatedStairs.id]));
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!editMode || !onRoomUpdate || isLoading) return;
    
    // Если выбрано несколько комнат, удаляем все выбранные
    if (selectedRooms.size > 1) {
      const roomsToDelete = localRooms.filter(r => selectedRooms.has(r.id));
      const count = roomsToDelete.length;
      if (confirm(`Удалить ${count} ${count === 1 ? 'комнату' : count < 5 ? 'комнаты' : 'комнат'}?`)) {
        setIsLoading(true);
        setLoadingMessage(`Удаление ${count} ${count === 1 ? 'комнаты' : 'комнат'}...`);
        
        try {
          // Удаляем все выбранные комнаты из локального состояния
          const updatedRooms = localRooms.filter(r => !selectedRooms.has(r.id));
          setLocalRooms(updatedRooms);
          
          // Обновляем оригинальные комнаты
          setOriginalRooms(originalRooms.filter(r => !selectedRooms.has(r.id)));
          
          // Автосохранение: помечаем удаленные комнаты позицией -1000
          for (const roomToDelete of roomsToDelete) {
            try {
              await onRoomUpdate({ ...roomToDelete, position: { x: -1000, y: -1000 } });
            } catch (error) {
              console.error(`Ошибка при удалении комнаты ${roomToDelete.id}:`, error);
            }
          }
          
          // Сбрасываем выделение
          setSelectedRooms(new Set());
          setSelectedRoom(null);
        } finally {
          setIsLoading(false);
          setLoadingMessage('');
        }
      }
    } else {
      // Удаляем одну комнату
      if (confirm('Удалить эту комнату?')) {
        const roomToDelete = localRooms.find(r => r.id === roomId);
        if (!roomToDelete) return;
        
        setIsLoading(true);
        setLoadingMessage('Удаление комнаты...');
        
        try {
          // Удаляем из локального состояния
          const updatedRooms = localRooms.filter(r => r.id !== roomId);
          setLocalRooms(updatedRooms);
          
          // Обновляем оригинальные комнаты
          setOriginalRooms(originalRooms.filter(r => r.id !== roomId));
          
          // Автосохранение: помечаем удаленную комнату позицией -1000
          await onRoomUpdate({ ...roomToDelete, position: { x: -1000, y: -1000 } });
          
          // Сбрасываем выделение
          setSelectedRooms(new Set());
          setSelectedRoom(null);
        } catch (error) {
          console.error(`Ошибка при удалении комнаты ${roomId}:`, error);
          alert('Ошибка при удалении комнаты');
        } finally {
          setIsLoading(false);
          setLoadingMessage('');
        }
      }
    }
  };

  const handleToggleCommon = (room: Room) => {
    if (editMode) {
      // Обновляем только локальное состояние
      setLocalRooms(localRooms.map(r => {
        if (r.id === room.id) {
          // Если комната была общей (COMMON), делаем её обычной (DZ)
          if (r.type === 'COMMON' || r.isCommon) {
            return { 
              ...r, 
              isCommon: false,
              type: 'DZ', // Меняем тип на обычный
              price: r.price || 70 // Устанавливаем цену по умолчанию, если её не было
            };
          } else {
            // Если комната была обычной, делаем её общей
            return { 
              ...r, 
              isCommon: true,
              type: 'COMMON',
              price: 0
            };
          }
        }
        return r;
      }));
    }
  };

  const handleZIndexChange = (room: Room, delta: number) => {
    if (editMode) {
      // Обновляем только локальное состояние
      setLocalRooms(localRooms.map(r => 
        r.id === room.id ? { ...r, zIndex: (r.zIndex || 1) + delta } : r
      ));
    }
  };

  const handleDuplicateRoom = async (room: Room) => {
    if (!editMode || isLoading) return;
    
    // Если выбрано несколько комнат, копируем все
    if (selectedRooms.size > 1) {
      handleDuplicateMultipleRooms();
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage('Копирование комнаты...');
    
    // Копирование одной комнаты
    // Находим максимальный zIndex для правильного наложения
    const maxZIndex = localRooms.reduce((max, r) => Math.max(max, r.zIndex || 1), 1);
    
    // Вычисляем новую позицию с учетом размеров и отступа
    const roomWidth = room.width || 120;
    const roomHeight = room.height || 100;
    const offset = 20;
    
    // Применяем снаппинг к сетке, если включен
    let newX = room.position.x + roomWidth + offset;
    let newY = room.position.y;
    
    if (snapToGrid) {
      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
    }
    
    // Создаем копию комнаты с новым ID и смещенной позицией
    const duplicatedRoom: Room = {
      ...room,
      id: `room-${generateId()}`,
      number: `${room.number}-copy`, // Временный номер, пользователь может изменить
      position: {
        x: newX,
        y: newY
      },
      zIndex: maxZIndex + 1, // Размещаем поверх всех комнат
      // Сохраняем размеры
      width: roomWidth,
      height: roomHeight
    };
    
    // Добавляем в локальное состояние
    setLocalRooms([...localRooms, duplicatedRoom]);
    
    // Автосохранение новой комнаты
    if (onRoomCreate) {
      try {
        await onRoomCreate(duplicatedRoom);
        // Добавляем в оригинальные комнаты после успешного создания
        setOriginalRooms([...originalRooms, duplicatedRoom]);
        
        // Выделяем новую комнату
        setSelectedRoom(duplicatedRoom.id);
        setSelectedRooms(new Set([duplicatedRoom.id]));
      } catch (error) {
        console.error('Ошибка при создании копии комнаты:', error);
        alert('Ошибка при создании копии комнаты');
        // Удаляем из локального состояния при ошибке
        setLocalRooms(localRooms.filter(r => r.id !== duplicatedRoom.id));
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    } else {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleDuplicateMultipleRooms = () => {
    if (selectedRooms.size === 0) {
      console.warn('handleDuplicateMultipleRooms: no rooms selected');
      return;
    }
    
    console.log('handleDuplicateMultipleRooms: selected rooms count:', selectedRooms.size);
    console.log('handleDuplicateMultipleRooms: localRooms count:', localRooms.length);
    
    // Сохраняем выбранные комнаты для копирования
    const roomsToCopy = localRooms.filter(r => selectedRooms.has(r.id));
    console.log('handleDuplicateMultipleRooms: rooms to copy:', roomsToCopy.length);
    
    if (roomsToCopy.length === 0) {
      console.error('handleDuplicateMultipleRooms: no rooms found to copy');
      alert('Не удалось найти выбранные комнаты для копирования');
      return;
    }
    
    setCopiedRooms(roomsToCopy);
    setCopyingType('rooms');
    setShowFloorSelectModal(true);
    console.log('handleDuplicateMultipleRooms: modal should be shown');
  };

  const handleDuplicateMultipleStairs = () => {
    if (selectedStairsSet.size === 0) {
      console.warn('handleDuplicateMultipleStairs: no stairs selected');
      return;
    }
    
    console.log('handleDuplicateMultipleStairs: selected stairs count:', selectedStairsSet.size);
    console.log('handleDuplicateMultipleStairs: localStairs count:', localStairs.length);
    
    // Сохраняем выбранные ступени для копирования
    const stairsToCopy = localStairs.filter(s => selectedStairsSet.has(s.id));
    console.log('handleDuplicateMultipleStairs: stairs to copy:', stairsToCopy.length);
    
    if (stairsToCopy.length === 0) {
      console.error('handleDuplicateMultipleStairs: no stairs found to copy');
      alert('Не удалось найти выбранные ступени для копирования');
      return;
    }
    
    setCopiedStairs(stairsToCopy);
    setCopyingType('stairs');
    setShowFloorSelectModal(true);
    console.log('handleDuplicateMultipleStairs: modal should be shown');
  };

  const handlePasteToFloor = async (targetFloor: 'EG' | '1OG' | '2OG' | '3OG') => {
    if (copiedRooms.length === 0 || isLoading) {
      console.warn('handlePasteToFloor: copiedRooms is empty or loading');
      return;
    }
    
    if (!onRoomCreate) {
      console.error('handlePasteToFloor: onRoomCreate is not available');
      alert('Ошибка: функция создания комнат недоступна');
      return;
    }
    
    setIsLoading(true);
    setLoadingMessage(`Копирование ${copiedRooms.length} ${copiedRooms.length === 1 ? 'комнаты' : 'комнат'} на ${targetFloor === 'EG' ? 'первый' : targetFloor === '1OG' ? 'второй' : targetFloor === '2OG' ? 'третий' : 'четвертый'} этаж...`);
    
    console.log('handlePasteToFloor: copying', copiedRooms.length, 'rooms to floor', targetFloor);
    
    // Находим максимальный zIndex для правильного наложения на целевом этаже
    const targetFloorRooms = localRooms.filter(r => r.floor === targetFloor);
    const maxZIndex = targetFloorRooms.length > 0 
      ? targetFloorRooms.reduce((max, r) => Math.max(max, r.zIndex || 1), 1)
      : 1;
    
    // Копируем комнаты на выбранный этаж с сохранением точных позиций и размеров
    const duplicatedRooms: Room[] = copiedRooms.map((room, index) => {
      return {
        ...room,
        id: `room-${generateId()}`,
        number: `${room.number}-copy`,
        floor: targetFloor,
        position: {
          x: room.position.x, // Сохраняем точную позицию X
          y: room.position.y  // Сохраняем точную позицию Y
        },
        zIndex: maxZIndex + index + 1,
        width: room.width || 120,  // Сохраняем точную ширину
        height: room.height || 100  // Сохраняем точную высоту
      };
    });
    
    console.log('handlePasteToFloor: created', duplicatedRooms.length, 'duplicated rooms');
    
    // Добавляем в локальное состояние используя функциональное обновление
    setLocalRooms(prevRooms => {
      const newRooms = [...prevRooms, ...duplicatedRooms];
      console.log('handlePasteToFloor: total rooms after paste:', newRooms.length);
      console.log('handlePasteToFloor: rooms on target floor', targetFloor, ':', newRooms.filter(r => r.floor === targetFloor).length);
      return newRooms;
    });
    
    try {
      // Автосохранение всех скопированных комнат в базу данных
      const savedRooms: Room[] = [];
      for (const duplicatedRoom of duplicatedRooms) {
        try {
          await onRoomCreate(duplicatedRoom);
          savedRooms.push(duplicatedRoom);
        } catch (error) {
          console.error(`Ошибка при создании комнаты ${duplicatedRoom.id}:`, error);
        }
      }
      
      // Обновляем оригинальные комнаты только для успешно сохраненных
      if (savedRooms.length > 0) {
        setOriginalRooms(prevOriginal => [...prevOriginal, ...savedRooms]);
      }
      
      // Если не все комнаты сохранились, показываем предупреждение
      if (savedRooms.length < duplicatedRooms.length) {
        alert(`Внимание: сохранено ${savedRooms.length} из ${duplicatedRooms.length} комнат. Некоторые комнаты не удалось сохранить.`);
      }
      
      // Выделяем скопированные комнаты
      const newSelectedIds = new Set(savedRooms.map(r => r.id));
      setSelectedRooms(newSelectedIds);
      setSelectedRoom(savedRooms[0]?.id || null);
      
      // Закрываем модальное окно
      setShowFloorSelectModal(false);
      setCopiedRooms([]);
      
      // Показываем уведомление об успешном копировании
      if (savedRooms.length === duplicatedRooms.length) {
        alert(`Успешно скопировано ${savedRooms.length} ${savedRooms.length === 1 ? 'комната' : savedRooms.length < 5 ? 'комнаты' : 'комнат'} на ${targetFloor === 'EG' ? 'первый' : targetFloor === '1OG' ? 'второй' : targetFloor === '2OG' ? 'третий' : 'четвертый'} этаж. Переключитесь на этот этаж, чтобы увидеть скопированные комнаты.`);
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handlePasteStairsToFloor = (targetFloor: 'EG' | '1OG' | '2OG' | '3OG') => {
    if (copiedStairs.length === 0) {
      console.warn('handlePasteStairsToFloor: copiedStairs is empty');
      return;
    }
    
    console.log('handlePasteStairsToFloor: copying', copiedStairs.length, 'stairs to floor', targetFloor);
    
    // Копируем ступени на выбранный этаж с сохранением точных позиций и размеров
    const duplicatedStairs: Stairs[] = copiedStairs.map((stair) => {
      // Определяем целевой этаж для ступеней
      let newTargetFloor: 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG' = targetFloor;
      if (stair.targetFloor) {
        // Если у ступеней был целевой этаж, вычисляем новый целевой этаж относительно нового этажа
        // Генерируем список этажей динамически (до 6 этажей)
        const allFloors = ['EG', '1OG', '2OG', '3OG', '4OG', '5OG', '6OG'];
        const currentFloorIndex = allFloors.indexOf(stair.floor);
        const targetFloorIndex = allFloors.indexOf(stair.targetFloor);
        const floorOffset = targetFloorIndex - currentFloorIndex;
        const newFloorIndex = allFloors.indexOf(targetFloor);
        const newTargetIndex = Math.max(0, Math.min(allFloors.length - 1, newFloorIndex + floorOffset));
        newTargetFloor = allFloors[newTargetIndex] as 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG';
      }
      
      return {
        ...stair,
        id: `stairs-${generateId()}`,
        floor: targetFloor,
        targetFloor: newTargetFloor,
        position: {
          x: stair.position.x, // Сохраняем точную позицию X
          y: stair.position.y   // Сохраняем точную позицию Y
        },
        width: stair.width,   // Сохраняем точную ширину
        height: stair.height   // Сохраняем точную высоту
      };
    });
    
    console.log('handlePasteStairsToFloor: created', duplicatedStairs.length, 'duplicated stairs');
    
    // Добавляем в локальное состояние используя функциональное обновление
    setLocalStairs(prevStairs => {
      const newStairs = [...prevStairs, ...duplicatedStairs];
      console.log('handlePasteStairsToFloor: total stairs after paste:', newStairs.length);
      console.log('handlePasteStairsToFloor: stairs on target floor', targetFloor, ':', newStairs.filter(s => s.floor === targetFloor).length);
      return newStairs;
    });
    
    // Выделяем скопированные ступени
    const newSelectedIds = new Set(duplicatedStairs.map(s => s.id));
    setSelectedStairsSet(newSelectedIds);
    setSelectedStairs(duplicatedStairs[0]?.id || null);
    
    // Закрываем модальное окно
    setShowFloorSelectModal(false);
    setCopiedStairs([]);
    
    // Показываем уведомление об успешном копировании
    alert(`Успешно скопировано ${duplicatedStairs.length} ${duplicatedStairs.length === 1 ? 'ступень' : duplicatedStairs.length < 5 ? 'ступени' : 'ступеней'} на ${targetFloor === 'EG' ? 'первый' : targetFloor === '1OG' ? 'второй' : targetFloor === '2OG' ? 'третий' : 'четвертый'} этаж. Переключитесь на этот этаж, чтобы увидеть скопированные ступени.`);
  };

  // Функция для глубокого сравнения комнат
  const roomsAreEqual = (room1: Room, room2: Room): boolean => {
    return (
      room1.id === room2.id &&
      room1.number === room2.number &&
      room1.name === room2.name &&
      room1.type === room2.type &&
      room1.capacity === room2.capacity &&
      room1.maxCapacity === room2.maxCapacity &&
      JSON.stringify(room1.beds) === JSON.stringify(room2.beds) &&
      room1.floor === room2.floor &&
      room1.price === room2.price &&
      room1.position.x === room2.position.x &&
      room1.position.y === room2.position.y &&
      (room1.width || 120) === (room2.width || 120) &&
      (room1.height || 100) === (room2.height || 100) &&
      room1.isCommon === room2.isCommon &&
      (room1.zIndex || 1) === (room2.zIndex || 1) &&
      room1.description === room2.description
    );
  };

  // Сохранение всех изменений при завершении редактирования
  const handleFinishEditing = async () => {
    if (!onRoomUpdate || !onStairsUpdate) return;

    try {
      const updatePromises: Promise<unknown>[] = [];
      
      // Сохраняем только измененные комнаты
      let newRoomsCount = 0;
      let updatedRoomsCount = 0;
      
      for (const room of localRooms) {
        const original = originalRooms.find(r => r.id === room.id);
        if (original) {
          // Существующая комната - проверяем, изменилась ли она
          if (!roomsAreEqual(room, original)) {
            // Комната изменилась - сохраняем только изменения
            updatedRoomsCount++;
            const result = onRoomUpdate(room);
            if (result != null && typeof result === 'object' && 'then' in result) {
              updatePromises.push(result as Promise<unknown>);
            }
          }
          // Если комната не изменилась, пропускаем её
        } else {
          // Новая комната - создаем через onRoomCreate
          newRoomsCount++;
          console.log('handleFinishEditing: creating new room', room.id, 'on floor', room.floor);
          if (onRoomCreate) {
            const result = onRoomCreate(room);
            if (result != null && typeof result === 'object' && 'then' in result) {
              updatePromises.push(result as Promise<unknown>);
            }
          }
        }
      }
      
      console.log('handleFinishEditing: new rooms:', newRoomsCount, ', updated rooms:', updatedRoomsCount);

      // Удаляем комнаты, которые были удалены (помечаем позицией -1000)
      const deletedRooms = originalRooms.filter(
        or => !localRooms.find(lr => lr.id === or.id)
      );
      for (const room of deletedRooms) {
        // Помечаем комнату как удаленную
        const result = onRoomUpdate({ ...room, position: { x: -1000, y: -1000 } });
        if (result != null && typeof result === 'object' && 'then' in result) {
          updatePromises.push(result as Promise<unknown>);
        }
      }

      // Ждем завершения всех обновлений комнат
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }

      // Сохраняем изменения ступеней ТОЛЬКО если они были изменены
      // Ступени - отдельная сущность, не должны обновляться при обновлении комнат
      const stairsChanged = localStairs.length !== originalStairs.length || 
        localStairs.some(localStair => {
          const original = originalStairs.find(s => s.id === localStair.id);
          if (!original) return true; // Новая ступень
          // Проверяем, изменилась ли ступень
          return (
            localStair.floor !== original.floor ||
            localStair.position.x !== original.position.x ||
            localStair.position.y !== original.position.y ||
            localStair.width !== original.width ||
            localStair.height !== original.height ||
            localStair.direction !== original.direction ||
            localStair.targetFloor !== original.targetFloor
          );
        }) ||
        originalStairs.some(originalStair => {
          // Проверяем, была ли удалена ступень
          return !localStairs.find(s => s.id === originalStair.id);
        });
      
      if (stairsChanged) {
        // КРИТИЧЕСКИ ВАЖНО: handleStairsUpdate в родительском компоненте УДАЛЯЕТ все ступени,
        // которых нет в переданном списке. Поэтому мы ДОЛЖНЫ передать ВСЕ ступени отеля.
        
        // КРИТИЧЕСКИ ВАЖНО: Используем stairs из пропса как основной источник истины,
        // так как он содержит ВСЕ ступени отеля (после исправления в HotelDetailView.tsx).
        // originalStairs может быть неполным, если пользователь переключался между этажами.
        
        // ВАЖНО: Используем Map для дедупликации по ID, чтобы избежать дубликатов
        const allStairsMap = new Map<string, Stairs>();
        
        // КРИТИЧЕСКИ ВАЖНО: Сначала добавляем ВСЕ ступени из пропса (основной источник истины)
        // stairs из пропса должен содержать ВСЕ ступени отеля, не только текущего этажа
        stairs.forEach(s => {
          allStairsMap.set(s.id, s);
        });
        
        // Затем добавляем все оригинальные ступени, которых нет в пропсе
        // Это защита на случай, если originalStairs содержит ступени, которых нет в пропсе
        originalStairs.forEach(s => {
          if (!allStairsMap.has(s.id)) {
            console.log('handleFinishEditing: adding stair from originalStairs not in props:', s.id, 'floor:', s.floor);
            allStairsMap.set(s.id, s);
          }
        });
        
        // Затем перезаписываем локальными (измененными и новыми)
        // Локальные имеют приоритет, так как они могут быть изменены или созданы
        localStairs.forEach(s => {
          if (allStairsMap.has(s.id)) {
            const existing = allStairsMap.get(s.id);
            if (existing && (existing.floor !== s.floor || existing.position.x !== s.position.x || existing.position.y !== s.position.y)) {
              console.log('handleFinishEditing: overwriting stairs with ID:', s.id, 'floor:', existing.floor, '->', s.floor);
            }
          }
          allStairsMap.set(s.id, s);
        });
        
        // Удаляем ступени, которые были удалены (есть в originalStairs, но нет в localStairs)
        const deletedStairsIds = new Set(
          originalStairs
            .filter(os => !localStairs.find(ls => ls.id === os.id))
            .map(s => s.id)
        );
        
        // Удаляем удаленные ступени из финального списка
        deletedStairsIds.forEach(id => {
          allStairsMap.delete(id);
          console.log('handleFinishEditing: removing deleted stair:', id);
        });
        
        const finalAllStairs = Array.from(allStairsMap.values());
        
        console.log('handleFinishEditing: stairs were changed, saving...');
        console.log('handleFinishEditing: localStairs count:', localStairs.length);
        console.log('handleFinishEditing: originalStairs count:', originalStairs.length);
        console.log('handleFinishEditing: stairs (from props) count:', stairs.length);
        console.log('handleFinishEditing: finalAllStairs count:', finalAllStairs.length);
        console.log('handleFinishEditing: stairs by floor:', {
          EG: finalAllStairs.filter(s => s.floor === 'EG').length,
          '1OG': finalAllStairs.filter(s => s.floor === '1OG').length,
          '2OG': finalAllStairs.filter(s => s.floor === '2OG').length,
          '3OG': finalAllStairs.filter(s => s.floor === '3OG').length
        });
        console.log('handleFinishEditing: originalStairs by floor:', {
          EG: originalStairs.filter(s => s.floor === 'EG').length,
          '1OG': originalStairs.filter(s => s.floor === '1OG').length,
          '2OG': originalStairs.filter(s => s.floor === '2OG').length,
          '3OG': originalStairs.filter(s => s.floor === '3OG').length
        });
        
        // Финальная проверка: убеждаемся, что мы передаем ВСЕ ступени отеля
        // Количество должно быть >= оригинальных (могут быть добавлены новые)
        if (finalAllStairs.length < originalStairs.length) {
          console.error('handleFinishEditing: CRITICAL ERROR - finalAllStairs count is less than originalStairs!');
          console.error('handleFinishEditing: originalStairs count:', originalStairs.length);
          console.error('handleFinishEditing: finalAllStairs count:', finalAllStairs.length);
          console.error('handleFinishEditing: originalStairs IDs:', originalStairs.map(s => s.id));
          console.error('handleFinishEditing: finalAllStairs IDs:', finalAllStairs.map(s => s.id));
        }
        
        // Вызываем onStairsUpdate ТОЛЬКО если ступени были изменены
        // Передаем полный список всех ступеней отеля, чтобы ничего не было удалено
        await onStairsUpdate(finalAllStairs);
      } else {
        console.log('handleFinishEditing: stairs were not changed, skipping update');
        console.log('handleFinishEditing: stairs (from props) count:', stairs.length);
        console.log('handleFinishEditing: originalStairs count:', originalStairs.length);
      }

      // Выходим из режима редактирования
      setEditMode(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Ошибка при сохранении изменений');
    }
  };

  // Отмена редактирования - возврат к оригинальным данным
  const handleCancelEditing = () => {
    setLocalRooms([...originalRooms]);
    setLocalStairs([...originalStairs]);
    setEditMode(false);
    setSelectedRoom(null);
    setSelectedStairs(null);
    setAddingStairs(false);
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-lg p-6 relative">
      {/* Лоадер */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10001] rounded-lg">
          <div className="bg-white dark:bg-card rounded-lg p-6 flex flex-col items-center gap-4 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-primary" />
            <p className="text-gray-700 dark:text-foreground font-semibold">{loadingMessage}</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">
          {floor === 'EG' ? 'Цокольный этаж (EG)' : floor === '1OG' ? 'Первый этаж (1OG)' : floor === '2OG' ? 'Второй этаж (2OG)' : 'Третий этаж (3OG)'}
        </h3>
        {isManager && (
          <div className="flex gap-2 flex-wrap">
            {!editMode && (
              <button
                onClick={() => {
                  const newValue = !showBookingInfo;
                  setShowBookingInfo(newValue);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('floorPlan_showBookingInfo', String(newValue));
                  }
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  showBookingInfo 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 dark:bg-muted text-gray-700 dark:text-foreground hover:bg-gray-300 dark:hover:bg-accent'
                }`}
                title={showBookingInfo ? 'Скрыть информацию о бронировании' : 'Показать информацию о бронировании'}
              >
                {showBookingInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showBookingInfo ? 'Скрыть последнюю бронь в комнатах' : 'Показать последнюю бронь в комнатах'}
              </button>
            )}
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-gray-200 dark:bg-muted text-gray-700 dark:text-foreground hover:bg-gray-300 dark:hover:bg-accent"
              >
                <Edit2 className="w-4 h-4" />
                Редактировать план
              </button>
            ) : (
              <>
                <button
                  onClick={handleFinishEditing}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Сохранить изменения
                </button>
                <button
                  onClick={handleCancelEditing}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                  Отменить
                </button>
              </>
            )}
            {editMode && (
              <>
                <button
                  onClick={() => setCreatingRoom(true)}
                  className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Добавить комнату
                </button>
                <button
                  onClick={() => setAddingStairs(!addingStairs)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    addingStairs ? 'bg-gray-700 dark:bg-primary text-white dark:text-primary-foreground' : 'bg-gray-200 dark:bg-muted text-gray-700 dark:text-foreground hover:bg-gray-300 dark:hover:bg-accent'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {addingStairs ? 'Отмена' : 'Добавить ступени'}
                </button>
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    snapToGrid ? 'bg-purple-600 dark:bg-purple-700 text-white' : 'bg-gray-200 dark:bg-muted text-gray-700 dark:text-foreground hover:bg-gray-300 dark:hover:bg-accent'
                  }`}
                  title="Примагничивание к сетке"
                >
                  <Grid3x3 className="w-4 h-4" />
                  {snapToGrid ? '✓ Сетка' : 'Сетка'}
                </button>
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    showGrid ? 'bg-blue-600 dark:bg-blue-700 text-white' : 'bg-gray-200 dark:bg-muted text-gray-700 dark:text-foreground hover:bg-gray-300 dark:hover:bg-accent'
                  }`}
                  title="Показать сетку"
                >
                  <Grid3x3 className="w-4 h-4" />
                  {showGrid ? 'Скрыть сетку' : 'Показать сетку'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {editMode && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
          <strong>Режим редактирования:</strong> Перетаскивайте комнаты мышью, изменяйте размеры за угол. Двойной клик по комнате открывает форму редактирования. Используйте Ctrl/Cmd+клик или Shift+клик для множественного выбора - затем перетащите любую выбранную комнату, чтобы переместить все выбранные одновременно, или измените размер любой выбранной комнаты, чтобы изменить размер всех выбранных одновременно. Все изменения сохраняются автоматически.
        </div>
      )}


      <div
        ref={planContainerRef}
        className={`relative border-2 border-gray-300 dark:border-border rounded-lg bg-gray-50 dark:bg-muted ${isMobile ? 'overflow-auto' : 'overflow-hidden'} ${isLoading ? 'pointer-events-none' : ''}`}
        style={{
          minHeight: isMobile ? `${scaledContainerHeight}px` : '600px',
          height: isMobile ? `${scaledContainerHeight}px` : 'auto',
          width: '100%',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleAddStairs}
      >
        {/* Подсказка для скролла на мобильных устройствах */}
        {showScrollHint && isMobile && planContainerRef.current && (
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99999] animate-bounce"
          >
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <div className="flex gap-1">
                <ArrowLeft className="w-4 h-4 animate-pulse" />
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-xs font-semibold whitespace-nowrap">
                Прокрутите план
              </span>
              <button
                onClick={handleCloseHint}
                className="bg-white dark:bg-card text-green-600 dark:text-green-400 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 dark:hover:bg-accent transition-colors ml-1"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
        <div
          className="relative"
          style={{
            width: `${containerSize.width * scale}px`,
            height: `${scaledContainerHeight}px`,
            minHeight: `${scaledContainerHeight}px`,
            position: 'relative',
          }}
        >
        {/* Визуализация сетки */}
        {showGrid && editMode && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE * scale}px ${GRID_SIZE * scale}px`,
            }}
          />
        )}

        {/* Ступени */}
        {floorStairs.map(stair => {
          const scaledWidth = stair.width * scale;
          const scaledHeight = stair.height * scale;
          const scaledX = stair.position.x * scale;
          const scaledY = stair.position.y * scale;

          return (
            <div
              key={stair.id}
              data-stairs-id={stair.id}
              className={`absolute border-2 ${
                (selectedStairs === stair.id || selectedStairsSet.has(stair.id)) ? 'border-gray-700 ring-2 ring-gray-500' : 'border-gray-500'
              } ${editMode ? 'cursor-move' : ''}`}
              style={{
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                background: `repeating-linear-gradient(
                  to bottom,
                  #9ca3af 0px,
                  #9ca3af 8px,
                  #6b7280 8px,
                  #6b7280 16px
                )`,
                zIndex: 0,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            onMouseDown={(e) => {
              if (editMode) {
                e.stopPropagation();
                setDraggingStairs(stair.id);
                setDragStart({ x: e.clientX, y: e.clientY });
                // Используем позицию из локального состояния
                const localStair = localStairs.find(s => s.id === stair.id);
                setStairsStartPos({ 
                  x: localStair?.position.x || stair.position.x, 
                  y: localStair?.position.y || stair.position.y 
                });
              }
            }}
              onClick={(e) => {
                e.stopPropagation();
                if (editMode && !draggingStairs) {
                  // Множественный выбор с Ctrl/Cmd
                  if (e.ctrlKey || e.metaKey) {
                    setSelectedStairsSet(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(stair.id)) {
                        newSet.delete(stair.id);
                      } else {
                        newSet.add(stair.id);
                      }
                      return newSet;
                    });
                    setSelectedStairs(stair.id);
                  } else {
                    // Одиночный выбор
                    setSelectedStairs(stair.id);
                    setSelectedStairsSet(new Set([stair.id]));
                  }
                }
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl text-center text-white font-bold px-2 rounded">
                  {stair.direction === 'up' && '↑'}
                  {stair.direction === 'down' && '↓'}
                  {stair.direction === 'both' && '↕'}
                </div>
              </div>
              {editMode && (selectedStairs === stair.id || selectedStairsSet.has(stair.id)) && (
                <div className="absolute -bottom-8 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 flex gap-1 justify-center flex-wrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingStairs(stair);
                    }}
                    className="bg-green-500 hover:bg-green-600 rounded px-2 py-1"
                    title="Редактировать"
                  >
                    <Edit2 className="w-3 h-3 inline" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateStairs(stair);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 rounded px-2 py-1"
                    title={selectedStairsSet.size > 1 ? `Копировать ${selectedStairsSet.size} ступеней` : 'Дублировать'}
                  >
                    <Copy className="w-3 h-3 inline" />
                    {selectedStairsSet.size > 1 && (
                      <span className="ml-1 text-[10px]">{selectedStairsSet.size}</span>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStairs(stair.id);
                    }}
                    className="bg-pink-900 hover:bg-pink-950 rounded px-2 py-1"
                    title={selectedStairsSet.size > 1 ? `Удалить ${selectedStairsSet.size} ступеней` : 'Удалить'}
                  >
                    <X className="w-3 h-3" />
                    {selectedStairsSet.size > 1 && (
                      <span className="ml-1 text-[10px]">{selectedStairsSet.size}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Комнаты */}
        {/* Используем key с roomsAvailability для принудительного обновления при изменении доступности */}
        {floorRooms.map(room => {
          const width = room.width || 120;
          const height = room.height || 100;
          const isSelected = selectedRoom === room.id || selectedRooms.has(room.id);
          const localRoom = localRooms.find(r => r.id === room.id) || room;

          const scaledWidth = width * scale;
          const scaledHeight = height * scale;
          const scaledX = localRoom.position.x * scale;
          const scaledY = localRoom.position.y * scale;

          // Контент комнаты
          const roomContent = (
            <>
              <div className={`h-full flex ${room.isCommon && room.textVertical ? 'items-center justify-center' : 'flex-col justify-start'} overflow-hidden`}>
                {/* Номер комнаты */}
                <div 
                  className={`font-normal text-sm leading-tight ${room.isCommon && room.textVertical ? '' : 'truncate'}`}
                  style={room.isCommon && room.textVertical ? { 
                    transform: 'rotate(-90deg)',
                    whiteSpace: 'nowrap'
                  } : {}}
                >
                  {room.number}
                </div>
                
                {/* Компактная информация для маленьких комнат */}
                {!room.isCommon && (scaledWidth < 100 || scaledHeight < 80) ? (
                  <>
                    {/* Компактный режим для маленьких комнат */}
                    <div className="flex flex-col gap-y-0.5 mt-1 text-xs text-gray-700 dark:text-foreground">
                      {/* Тип комнаты */}
                      <div className="text-[10px] text-gray-600 dark:text-muted-foreground leading-tight">
                        {room.type === 'FZ' ? 'FZ' : room.type === 'DZ' ? 'DZ' : room.type === 'EZ' ? 'EZ' : room.type === 'MZ' ? 'MZ' : room.type === 'App' ? 'App' : ''}
                      </div>
                      {room.capacity && (
                        <div className="flex items-center gap-1">
                          {/* <Users className="w-4 h-4" /> */}
                          <span>{room.capacity}</span>
                        </div>
                      )}
                      {room.beds && room.beds.length > 0 && (
                        <div className="flex items-center gap-1">
                          {/* <Bed className="w-4 h-4" /> */}
                          <span className="text-[10px]">{formatBeds(room.beds)}</span>
                        </div>
                      )}
                      <div className="flex gap-1 w-full">
                      {room.hasShower && (
                        <div className="flex items-center gap-1" title="Душ">
                          <ShowerHead className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                      {room.hasToilet && (
                        <div className="flex items-center gap-1" title="Туалет">
                          <Toilet className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                      {room.price > 0 && (
                        <div className="font-semibold col-span-2 text-right">
                          {Math.round(room.price)}€{room.pricePerPerson ? ' p.P.' : ''}
                        </div>
                      )}
                      </div>
                    </div>
                    {/* Информация о бронировании для менеджера в компактном режиме */}
                    {isManager && room.booking && showBookingInfo && (
                      <div className="sm:block hidden mt-1 text-[9px] text-gray-700 dark:text-foreground border-t border-gray-300 dark:border-border pt-1">
                        <div className="font-semibold truncate" title={room.booking.bookedBy}>
                          {room.booking.bookedBy}
                        </div>
                        <div className="text-gray-600 dark:text-muted-foreground">
                          {new Date(room.booking.checkIn).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} - {new Date(room.booking.checkOut).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Полный режим для больших комнат
                  <>
                    {/* Тип комнаты */}
                    {!room.isCommon && (
                      <div className="text-sm text-gray-600 dark:text-muted-foreground leading-tight truncate mt-1">
                        {room.type === 'FZ' ? 'FZ' : room.type === 'DZ' ? 'DZ' : room.type === 'EZ' ? 'EZ' : room.type === 'MZ' ? 'MZ' : room.type === 'App' ? 'App' : ''}
                      </div>
                    )}
                    
                    {/* Информация о людях и кроватях */}
                    {!room.isCommon && (
                      <div className="flex items-start flex-col gap-2 mt-1 text-xs text-gray-700 dark:text-foreground">
                        {/* Количество людей */}
                        {room.capacity && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{room.capacity}</span>
                            {room.maxCapacity && typeof room.maxCapacity === 'number' && typeof room.capacity === 'number' && room.maxCapacity > room.capacity && (
                              <span className="text-gray-500">/ {room.maxCapacity}</span>
                            )}
                          </div>
                        )}
                        
                        {/* Кровати */}
                        {room.beds && room.beds.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span className="text-[10px]">{formatBeds(room.beds)}</span>
                          </div>
                        )}
                        
                        {/* Душ и туалет */}
                        {(room.hasShower || room.hasToilet) && (
                          <div className="flex items-center gap-2">
                            {room.hasShower && (
                              <div className="flex items-center gap-1" title="Душ">
                                <ShowerHead className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                            {room.hasToilet && (
                              <div className="flex items-center gap-1" title="Туалет">
                                <Toilet className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Цена */}
                    {!room.isCommon && room.price > 0 && (
                      <div className="text-xs font-semibold text-gray-700 dark:text-foreground leading-tight mt-1">
                        {Math.round(room.price)}€{room.pricePerPerson ? ' p.P.' : ''}
                      </div>
                    )}
                    
                    {/* Информация о бронировании для менеджера */}
                    {isManager && room.booking && showBookingInfo && (
                      <div className="mt-2 pt-2 border-t border-gray-300 dark:border-border text-[10px] text-gray-700 dark:text-foreground">
                        <div className="font-semibold truncate" title={room.booking.bookedBy}>
                          {room.booking.bookedBy}
                        </div>
                        <div className="text-gray-600 dark:text-muted-foreground">
                          {new Date(room.booking.checkIn).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} - {new Date(room.booking.checkOut).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Иконка статуса - смещена ниже и правее */}
              <div className="absolute bottom-1 right-1">
                {getRoomIcon(room)}
              </div>

              {/* Иконка информации о бронированиях для менеджера */}
              {isManager && !room.isCommon && room.bookings && room.bookings.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBookingsPopupRoom(room);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm z-10"
                  title="Показать бронирования"
                >
                  <Info className="w-3 h-3" />
                </button>
              )}

              {editMode && (isSelected || selectedRooms.has(room.id)) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 overflow-x-auto z-50" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4B5563 transparent' }}>
                  <div className="flex gap-1 min-w-max whitespace-nowrap">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      // Автосохранение предыдущей комнаты, если она редактировалась
                      if (editingRoom && editingRoom.id !== room.id) {
                        await autoSaveRoom(editingRoom.id);
                      }
                      setEditingRoom(room);
                    }}
                    onTouchStart={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      // Автосохранение предыдущей комнаты, если она редактировалась
                      if (editingRoom && editingRoom.id !== room.id) {
                        await autoSaveRoom(editingRoom.id);
                      }
                      setEditingRoom(room);
                    }}
                    className="bg-green-500 hover:bg-green-600 active:bg-green-700 rounded px-1 shrink-0 touch-manipulation"
                    title="Редактировать"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <Edit2 className="w-3 h-3 inline" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoading) {
                        handleDuplicateRoom(room);
                      }
                    }}
                    disabled={isLoading}
                    className="bg-purple-500 hover:bg-purple-600 rounded px-1 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={selectedRooms.size > 1 ? `Копировать ${selectedRooms.size} комнат` : 'Дублировать'}
                  >
                    <Copy className="w-3 h-3 inline" />
                    {selectedRooms.size > 1 && (
                      <span className="ml-1 text-[10px]">{selectedRooms.size}</span>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCommon(room);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 rounded px-1 shrink-0"
                    title={room.isCommon ? 'Сделать бронируемой' : 'Сделать общей'}
                  >
                    {room.isCommon ? 'Бронь' : 'Общая'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZIndexChange(room, -1);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 rounded px-1 shrink-0"
                    title="Назад"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZIndexChange(room, 1);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 rounded px-1 shrink-0"
                    title="Вперед"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoading) {
                        handleDeleteRoom(room.id);
                      }
                    }}
                    disabled={isLoading}
                    className="bg-pink-900 hover:bg-pink-950 rounded px-1 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={selectedRooms.size > 1 ? `Удалить ${selectedRooms.size} комнат` : 'Удалить'}
                  >
                    <Trash2 className="w-3 h-3 inline" />
                    {selectedRooms.size > 1 && (
                      <span className="ml-1 text-[10px]">{selectedRooms.size}</span>
                    )}
                  </button>
                  </div>
                </div>
              )}
            </>
          );

          // В режиме редактирования используем react-rnd
          if (editMode) {
            return (
              <Rnd
                key={`${room.id}-${availabilityUpdateKey}`}
                data-room-id={room.id}
                size={{
                  width: scaledWidth,
                  height: scaledHeight,
                }}
                position={{
                  x: scaledX,
                  y: scaledY,
                }}
                onDragStart={() => {
                  // Сохраняем начальные позиции всех выбранных комнат при начале перетаскивания
                  if (selectedRooms.size > 1 && selectedRooms.has(room.id)) {
                    dragStartPositions.current.clear();
                    localRooms.forEach(r => {
                      if (selectedRooms.has(r.id)) {
                        dragStartPositions.current.set(r.id, { x: r.position.x, y: r.position.y });
                      }
                    });
                  } else {
                    dragStartPositions.current.clear();
                    dragStartPositions.current.set(room.id, { x: localRoom.position.x, y: localRoom.position.y });
                  }
                }}
                onDrag={(e, d) => {
                  // Во время перетаскивания обновляем позицию перетаскиваемой комнаты
                  // и всех других выбранных комнат в реальном времени
                  if (selectedRooms.size > 1 && selectedRooms.has(room.id)) {
                    // Вычисляем новую позицию перетаскиваемой комнаты
                    let newX = d.x / scale;
                    let newY = d.y / scale;
                    
                    if (snapToGrid) {
                      newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
                      newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
                    }
                    
                    // Получаем начальную позицию перетаскиваемой комнаты
                    const startPos = dragStartPositions.current.get(room.id);
                    if (!startPos) return;
                    
                    // Вычисляем смещение
                    const deltaX = newX - startPos.x;
                    const deltaY = newY - startPos.y;
                    
                    // Обновляем все выбранные комнаты с тем же смещением
                    setLocalRooms(localRooms.map(r => {
                      if (selectedRooms.has(r.id)) {
                        const rStartPos = dragStartPositions.current.get(r.id);
                        if (!rStartPos) return r;
                        
                        let updatedX = rStartPos.x + deltaX;
                        let updatedY = rStartPos.y + deltaY;
                        
                        if (snapToGrid) {
                          updatedX = Math.round(updatedX / GRID_SIZE) * GRID_SIZE;
                          updatedY = Math.round(updatedY / GRID_SIZE) * GRID_SIZE;
                        }
                        
                        return {
                          ...r,
                          position: { x: updatedX, y: updatedY }
                        };
                      }
                      return r;
                    }));
                  }
                }}
                onDragStop={(e, d) => {
                  (async () => {
                  // Применяем снаппинг к сетке, если включен
                  let newX = d.x / scale;
                  let newY = d.y / scale;
                  
                  if (snapToGrid) {
                    newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
                    newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
                  }

                  // Если выбрано несколько комнат, перемещаем все выбранные
                  if (selectedRooms.size > 1 && selectedRooms.has(room.id)) {
                    const startPos = dragStartPositions.current.get(room.id);
                    if (!startPos) return;
                    
                    // Вычисляем смещение относительно начальной позиции
                    const deltaX = newX - startPos.x;
                    const deltaY = newY - startPos.y;
                    
                    const updatedRooms: Room[] = [];
                    
                    // Обновляем все выбранные комнаты
                    localRooms.forEach(r => {
                      if (selectedRooms.has(r.id)) {
                        const rStartPos = dragStartPositions.current.get(r.id);
                        if (!rStartPos) return;
                        
                        let updatedX = rStartPos.x + deltaX;
                        let updatedY = rStartPos.y + deltaY;
                        
                        if (snapToGrid) {
                          updatedX = Math.round(updatedX / GRID_SIZE) * GRID_SIZE;
                          updatedY = Math.round(updatedY / GRID_SIZE) * GRID_SIZE;
                        }
                        
                        const updatedRoom = {
                          ...r,
                          position: { x: updatedX, y: updatedY }
                        };
                        updatedRooms.push(updatedRoom);
                      }
                    });
                    
                    // Обновляем локальное состояние для всех комнат
                    const roomMap = new Map(updatedRooms.map(r => [r.id, r]));
                    setLocalRooms(localRooms.map(r => roomMap.get(r.id) || r));

                    // Автосохранение всех перемещенных комнат
                    for (const updatedRoom of updatedRooms) {
                      const originalRoom = originalRooms.find(r => r.id === updatedRoom.id);
                      if (originalRoom) {
                        // Комната существует - обновляем
                        if (onRoomUpdate) {
                          try {
                            await onRoomUpdate(updatedRoom);
                            setOriginalRooms(originalRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
                          } catch (error) {
                            console.error(`Ошибка при автосохранении комнаты ${updatedRoom.id}:`, error);
                          }
                        }
                      } else {
                        // Новая комната - создаем
                        if (onRoomCreate) {
                          try {
                            await onRoomCreate(updatedRoom);
                            setOriginalRooms([...originalRooms, updatedRoom]);
                          } catch (error) {
                            console.error(`Ошибка при создании комнаты ${updatedRoom.id}:`, error);
                          }
                        }
                      }
                    }
                    
                    // Очищаем сохраненные позиции
                    dragStartPositions.current.clear();
                  } else {
                    // Одиночное перемещение
                    const updatedRoom = {
                      ...localRoom,
                      position: { x: newX, y: newY }
                    };
                    setLocalRooms(localRooms.map(r => r.id === room.id ? updatedRoom : r));

                    // Автосохранение
                    const originalRoom = originalRooms.find(r => r.id === room.id);
                    if (originalRoom) {
                      // Комната существует - обновляем
                      if (onRoomUpdate) {
                        try {
                          await onRoomUpdate(updatedRoom);
                          setOriginalRooms(originalRooms.map(r => r.id === room.id ? updatedRoom : r));
                        } catch (error) {
                          console.error('Ошибка при автосохранении:', error);
                        }
                      }
                    } else {
                      // Новая комната - создаем
                      if (onRoomCreate) {
                        try {
                          await onRoomCreate(updatedRoom);
                          setOriginalRooms([...originalRooms, updatedRoom]);
                        } catch (error) {
                          console.error('Ошибка при создании комнаты:', error);
                        }
                      }
                    }
                    
                    // Очищаем сохраненные позиции
                    dragStartPositions.current.clear();
                  }
                })();
                }}
                onResizeStart={() => {
                  // Сохраняем начальные размеры всех выбранных комнат при начале изменения размера
                  if (selectedRooms.size > 1 && selectedRooms.has(room.id)) {
                    resizeStartSizes.current.clear();
                    localRooms.forEach(r => {
                      if (selectedRooms.has(r.id)) {
                        resizeStartSizes.current.set(r.id, { 
                          width: r.width || 120, 
                          height: r.height || 100 
                        });
                      }
                    });
                  } else {
                    resizeStartSizes.current.clear();
                    resizeStartSizes.current.set(room.id, { 
                      width: localRoom.width || 120, 
                      height: localRoom.height || 100 
                    });
                  }
                }}
                onResize={(e, direction, ref) => {
                  // Во время изменения размера обновляем размер перетаскиваемой комнаты
                  // и всех других выбранных комнат в реальном времени
                  if (selectedRooms.size > 1 && selectedRooms.has(room.id)) {
                    // Вычисляем новый размер перетаскиваемой комнаты
                    let newWidth = ref.offsetWidth / scale;
                    let newHeight = ref.offsetHeight / scale;
                    
                    if (snapToGrid) {
                      newWidth = Math.round(newWidth / GRID_SIZE) * GRID_SIZE;
                      newHeight = Math.round(newHeight / GRID_SIZE) * GRID_SIZE;
                    }
                    
                    // Получаем начальный размер перетаскиваемой комнаты
                    const startSize = resizeStartSizes.current.get(room.id);
                    if (!startSize) return;
                    
                    // Вычисляем изменение размера
                    const deltaWidth = newWidth - startSize.width;
                    const deltaHeight = newHeight - startSize.height;
                    
                    // Обновляем все выбранные комнаты с тем же изменением размера
                    setLocalRooms(localRooms.map(r => {
                      if (selectedRooms.has(r.id)) {
                        const rStartSize = resizeStartSizes.current.get(r.id);
                        if (!rStartSize) return r;
                        
                        let updatedWidth = rStartSize.width + deltaWidth;
                        let updatedHeight = rStartSize.height + deltaHeight;
                        
                        // Минимальный размер
                        updatedWidth = Math.max(40, updatedWidth);
                        updatedHeight = Math.max(40, updatedHeight);
                        
                        if (snapToGrid) {
                          updatedWidth = Math.round(updatedWidth / GRID_SIZE) * GRID_SIZE;
                          updatedHeight = Math.round(updatedHeight / GRID_SIZE) * GRID_SIZE;
                        }
                        
                        return {
                          ...r,
                          width: updatedWidth,
                          height: updatedHeight
                        };
                      }
                      return r;
                    }));
                  }
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  (async () => {
                  // Применяем снаппинг к сетке, если включен
                  let newWidth = ref.offsetWidth / scale;
                  let newHeight = ref.offsetHeight / scale;
                  let newX = position.x / scale;
                  let newY = position.y / scale;
                  
                  if (snapToGrid) {
                    newWidth = Math.round(newWidth / GRID_SIZE) * GRID_SIZE;
                    newHeight = Math.round(newHeight / GRID_SIZE) * GRID_SIZE;
                    newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
                    newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
                  }

                  // Если выбрано несколько комнат, изменяем размер всех выбранных
                  if (selectedRooms.size > 1 && selectedRooms.has(room.id)) {
                    const startSize = resizeStartSizes.current.get(room.id);
                    if (!startSize) return;
                    
                    // Вычисляем изменение размера относительно начального размера
                    const deltaWidth = newWidth - startSize.width;
                    const deltaHeight = newHeight - startSize.height;
                    
                    const updatedRooms: Room[] = [];
                    
                    // Обновляем все выбранные комнаты
                    localRooms.forEach(r => {
                      if (selectedRooms.has(r.id)) {
                        const rStartSize = resizeStartSizes.current.get(r.id);
                        if (!rStartSize) return;
                        
                        let updatedWidth = rStartSize.width + deltaWidth;
                        let updatedHeight = rStartSize.height + deltaHeight;
                        
                        // Минимальный размер
                        updatedWidth = Math.max(40, updatedWidth);
                        updatedHeight = Math.max(40, updatedHeight);
                        
                        if (snapToGrid) {
                          updatedWidth = Math.round(updatedWidth / GRID_SIZE) * GRID_SIZE;
                          updatedHeight = Math.round(updatedHeight / GRID_SIZE) * GRID_SIZE;
                        }
                        
                        const updatedRoom = {
                          ...r,
                          width: updatedWidth,
                          height: updatedHeight
                        };
                        updatedRooms.push(updatedRoom);
                      }
                    });
                    
                    // Обновляем локальное состояние для всех комнат
                    const roomMap = new Map(updatedRooms.map(r => [r.id, r]));
                    setLocalRooms(localRooms.map(r => roomMap.get(r.id) || r));

                    // Автосохранение всех измененных комнат
                    for (const updatedRoom of updatedRooms) {
                      const originalRoom = originalRooms.find(r => r.id === updatedRoom.id);
                      if (originalRoom) {
                        // Комната существует - обновляем
                        if (onRoomUpdate) {
                          try {
                            await onRoomUpdate(updatedRoom);
                            setOriginalRooms(originalRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
                          } catch (error) {
                            console.error(`Ошибка при автосохранении комнаты ${updatedRoom.id}:`, error);
                          }
                        }
                      } else {
                        // Новая комната - создаем
                        if (onRoomCreate) {
                          try {
                            await onRoomCreate(updatedRoom);
                            setOriginalRooms([...originalRooms, updatedRoom]);
                          } catch (error) {
                            console.error(`Ошибка при создании комнаты ${updatedRoom.id}:`, error);
                          }
                        }
                      }
                    }
                    
                    // Очищаем сохраненные размеры
                    resizeStartSizes.current.clear();
                  } else {
                    // Одиночное изменение размера
                    const updatedRoom = {
                      ...localRoom,
                      position: { x: newX, y: newY },
                      width: newWidth,
                      height: newHeight
                    };
                    setLocalRooms(localRooms.map(r => r.id === room.id ? updatedRoom : r));

                    // Автосохранение
                    const originalRoom = originalRooms.find(r => r.id === room.id);
                    if (originalRoom) {
                      // Комната существует - обновляем
                      if (onRoomUpdate) {
                        try {
                          await onRoomUpdate(updatedRoom);
                          setOriginalRooms(originalRooms.map(r => r.id === room.id ? updatedRoom : r));
                        } catch (error) {
                          console.error('Ошибка при автосохранении:', error);
                        }
                      }
                    } else {
                      // Новая комната - создаем
                      if (onRoomCreate) {
                        try {
                          await onRoomCreate(updatedRoom);
                          setOriginalRooms([...originalRooms, updatedRoom]);
                        } catch (error) {
                          console.error('Ошибка при создании комнаты:', error);
                        }
                      }
                    }
                    
                    // Очищаем сохраненные размеры
                    resizeStartSizes.current.clear();
                  }
                })();
                }}
                bounds="parent"
                minWidth={40 * scale}
                minHeight={40 * scale}
                grid={snapToGrid ? [GRID_SIZE * scale, GRID_SIZE * scale] : undefined}
                style={{
                  border: isSelected ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                  cursor: 'move',
                  zIndex: (room.zIndex || 1) + (isSelected ? 1000 : 0),
                }}
                className={`rounded-lg overflow-hidden ${getRoomColor(room)}`}
                onClick={(e: React.MouseEvent) => handleRoomClick(room, e)}
                onDoubleClick={(e: React.MouseEvent) => {
                  (async () => {
                  e.stopPropagation();
                  // Автосохранение предыдущей комнаты
                  if (editingRoom && editingRoom.id !== room.id) {
                    await autoSaveRoom(editingRoom.id);
                  }
                  setEditingRoom(room);
                })();
                }}
              >
                <div
                  style={{
                    padding: `${6 * scale}px`,
                    fontSize: `${12 * scale}px`,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  {roomContent}
                </div>
              </Rnd>
            );
          }

          // В обычном режиме просто div
          return (
            <div
              key={`${room.id}-${availabilityUpdateKey}`}
              data-room-id={room.id}
              className={`absolute border-2 rounded-lg transition-all overflow-hidden ${
                getRoomColor(room)
              } ${room.isCommon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              style={{
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                zIndex: room.zIndex || 1,
                padding: `${6 * scale}px`,
                fontSize: `${12 * scale}px`
              }}
              onClick={(e) => handleRoomClick(room, e)}
            >
              {roomContent}
            </div>
          );
        })}

        {addingStairs && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-30 flex items-center justify-center pointer-events-none">
            <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
              Кликните на плане, чтобы добавить ступени
            </div>
          </div>
        )}
        </div>
      </div>


      {/* Модальное окно создания/редактирования комнаты */}
      {(editingRoom || creatingRoom) && hotelId && (
        <RoomEditModal
          room={editingRoom}
          hotelId={hotelId}
          floor={floor}
          onSave={handleRoomSave}
          onClose={async () => {
            // Автосохранение при закрытии модального окна, если были изменения позиции/размера
            if (editingRoom && onRoomUpdate) {
              await autoSaveRoom(editingRoom.id);
            }
            setEditingRoom(null);
            setCreatingRoom(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {/* Модальное окно редактирования ступеней */}
      {editingStairs && hotelId && (
        <StairsEditModal
          stairs={editingStairs}
          hotelId={hotelId}
          floor={floor}
          onSave={handleStairsSave}
          onClose={() => {
            setEditingStairs(null);
            setSelectedStairs(null);
          }}
        />
      )}

      {/* Модальное окно выбора этажа для копирования */}
      {showFloorSelectModal && (copyingType === 'rooms' ? copiedRooms.length > 0 : copiedStairs.length > 0) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4"
          onClick={() => {
            setShowFloorSelectModal(false);
            if (copyingType === 'rooms') {
              setCopiedRooms([]);
            } else {
              setCopiedStairs([]);
            }
          }}
        >
          <div 
            className="bg-white dark:bg-card rounded-lg max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-foreground">
                Выберите этаж для копирования
              </h2>
              <p className="text-gray-600 dark:text-muted-foreground mb-6">
                {copyingType === 'rooms' ? (
                  <>Выберите этаж, на который нужно скопировать {copiedRooms.length} {copiedRooms.length === 1 ? 'комнату' : copiedRooms.length < 5 ? 'комнаты' : 'комнат'}</>
                ) : (
                  <>Выберите этаж, на который нужно скопировать {copiedStairs.length} {copiedStairs.length === 1 ? 'ступень' : copiedStairs.length < 5 ? 'ступени' : 'ступеней'}</>
                )}
              </p>
              <div className="flex flex-col gap-3">
                {floor !== 'EG' && (
                  <button
                    onClick={() => {
                      if (!isLoading) {
                        if (copyingType === 'rooms') {
                          handlePasteToFloor('EG');
                        } else {
                          handlePasteStairsToFloor('EG');
                        }
                      }
                    }}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Цокольный этаж (EG)
                  </button>
                )}
                {floor !== '1OG' && (
                  <button
                    onClick={() => {
                      if (!isLoading) {
                        if (copyingType === 'rooms') {
                          handlePasteToFloor('1OG');
                        } else {
                          handlePasteStairsToFloor('1OG');
                        }
                      }
                    }}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Второй этаж (1OG)
                  </button>
                )}
                {floor !== '2OG' && (
                  <button
                    onClick={() => {
                      if (!isLoading) {
                        if (copyingType === 'rooms') {
                          handlePasteToFloor('2OG');
                        } else {
                          handlePasteStairsToFloor('2OG');
                        }
                      }
                    }}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Третий этаж (2OG)
                  </button>
                )}
                {floor !== '3OG' && (
                  <button
                    onClick={() => {
                      if (!isLoading) {
                        if (copyingType === 'rooms') {
                          handlePasteToFloor('3OG');
                        } else {
                          handlePasteStairsToFloor('3OG');
                        }
                      }
                    }}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Четвертый этаж (3OG)
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowFloorSelectModal(false);
                    if (copyingType === 'rooms') {
                      setCopiedRooms([]);
                    } else {
                      setCopiedStairs([]);
                    }
                  }}
                  className="px-6 py-3 bg-gray-300 dark:bg-muted hover:bg-gray-400 dark:hover:bg-accent text-gray-700 dark:text-foreground rounded-lg font-semibold transition-colors mt-2"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Попап с бронированиями комнаты */}
      {bookingsPopupRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-foreground">
                Бронирования комнаты #{bookingsPopupRoom.number}
              </h3>
              <button
                onClick={() => setBookingsPopupRoom(null)}
                className="text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const futureBookings = (bookingsPopupRoom.bookings || [])
                  .filter((b: BookingInfo) => new Date(b.checkOut) >= today)
                  .sort((a: BookingInfo, b: BookingInfo) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
                
                // Находим последнее прошедшее бронирование (скрытое)
                const pastBookings = (bookingsPopupRoom.bookings || [])
                  .filter((b: BookingInfo) => new Date(b.checkOut) < today)
                  .sort((a: BookingInfo, b: BookingInfo) => new Date(b.checkOut).getTime() - new Date(a.checkOut).getTime());
                const lastBooking = pastBookings.length > 0 ? pastBookings[0] : null;
                
                if (futureBookings.length === 0) {
                  return (
                    <div className="text-center text-gray-500 dark:text-muted-foreground py-8">
                      Нет предстоящих бронирований
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    {futureBookings.map((booking: BookingInfo, index: number) => {
                      const checkIn = new Date(booking.checkIn);
                      const checkOut = new Date(booking.checkOut);
                      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                      const isActive = checkIn <= today && checkOut > today;
                      
                      return (
                        <div 
                          key={booking.id || index}
                          className={`p-3 rounded-lg border ${isActive ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800' : 'bg-gray-50 dark:bg-muted border-gray-200 dark:border-border'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-semibold text-gray-900 dark:text-foreground">
                              {booking.bookedBy}
                            </div>
                            {isActive && (
                              <span className="text-xs bg-green-500 dark:bg-green-600 text-white px-2 py-0.5 rounded-full">
                                Сейчас
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-muted-foreground space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {checkIn.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })} — {checkOut.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="text-gray-400 dark:text-muted-foreground">({nights} {nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'})</span>
                            </div>
                            {booking.phone && (
                              <div className="text-xs text-gray-500 dark:text-muted-foreground">
                                📞 {booking.phone}
                              </div>
                            )}
                            {booking.email && (
                              <div className="text-xs text-gray-500 dark:text-muted-foreground">
                                ✉️ {booking.email}
                              </div>
                            )}
                            {booking.guests && booking.guests.length > 0 && (
                              <div className="text-xs text-gray-500 dark:text-muted-foreground">
                                👥 Гости: {booking.guests.map(g => g.name).join(', ')}
                              </div>
                            )}
                            {booking.isPaid && (
                              <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                ✓ Оплачено {booking.amount ? `(${booking.amount}€)` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                   
                  </div>
                );
              })()}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-border">
              <button
                onClick={() => setBookingsPopupRoom(null)}
                className="w-full py-2 bg-gray-200 dark:bg-muted hover:bg-gray-300 dark:hover:bg-accent text-gray-700 dark:text-foreground rounded-lg font-semibold transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Модальное окно редактирования комнаты
 
function RoomEditModal({ room, hotelId, floor, onSave, onClose }: { room: Room | null; hotelId: string; floor: string; onSave: (updatedRoom: Room) => void; onClose: () => void }) {
  const idCounterRef = useRef(0);
  // Вызывается только в обработчиках событий, не во время рендера
  const generateId = () => {
    idCounterRef.current += 1;
    return `${Date.now()}-${idCounterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Функция для нормализации кроватей в читаемый формат
  const normalizeBeds = (beds: string[] | undefined): string => {
    if (!beds || beds.length === 0) return '';
    
    // Стандартные типы кроватей (короткие коды)
    const standardBedTypes = ['DB', 'HB', 'EB', 'QB', 'KB', 'SB', 'TB', 'FB', 'DZ', 'EZ', 'MZ', 'FZ'];
    
    // Объединяем все элементы массива в одну строку для обработки
    const allBeds = beds.join(', ');
    
    // Разбиваем по запятым
    const bedItems = allBeds.split(',').map(b => b.trim()).filter(b => b);
    
    const result: string[] = [];
    const bedCounts: Record<string, number> = {};
    
    bedItems.forEach(item => {
      if (!item) return;
      
      // Проверяем формат "число-тип" (например, "2-HB" или "1-Sofa")
      const matchWithCount = item.match(/^(\d+)[-](.+)$/);
      if (matchWithCount) {
        const count = parseInt(matchWithCount[1]);
        const type = matchWithCount[2].trim();
        
        // Если это стандартный тип кровати - группируем
        if (standardBedTypes.includes(type.toUpperCase())) {
          const upperType = type.toUpperCase();
          bedCounts[upperType] = (bedCounts[upperType] || 0) + count;
        } else {
          // Если это описание (не стандартный тип) - добавляем без числа
          result.push(type);
        }
      } else {
        // Проверяем, является ли это стандартным типом без количества
        if (standardBedTypes.includes(item.toUpperCase())) {
          const upperType = item.toUpperCase();
          bedCounts[upperType] = (bedCounts[upperType] || 0) + 1;
        } else {
          // Это описание - добавляем как есть
          result.push(item);
        }
      }
    });
    
    // Форматируем сгруппированные стандартные типы кроватей
    const formattedBeds = Object.entries(bedCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([type, count]) => `${count}-${type}`);
    
    // Объединяем стандартные типы и описания
    return [...formattedBeds, ...result].join(', ');
  };

  const [formData, setFormData] = useState({
    number: room?.number ?? '',
    name: room?.name ?? '',
    type: room?.type ?? 'DZ',
    capacity: room?.capacity ?? '2 чел.',
    maxCapacity: room?.maxCapacity ?? 2,
    beds: normalizeBeds(room?.beds),
    price: room?.price ?? 0,
    description: room?.description ?? '',
    isCommon: room?.isCommon ?? false,
    width: room?.width ?? 120,
    height: room?.height ?? 100,
    hasShower: room?.hasShower ?? false,
    hasToilet: room?.hasToilet ?? false,
    pricePerPerson: room?.pricePerPerson ?? false,
    textVertical: room?.textVertical ?? false,
  });

  const handleSave = () => {
    if (!formData.number.trim()) {
      alert('Введите номер комнаты');
      return;
    }

    const bedsArray = formData.beds.split(',').map((b: string) => b.trim()).filter((b: string) => b);

    const roomData: Room = {
      id: room?.id || `room-${generateId()}`,
      number: formData.number.trim(),
      hotelId,
      name: formData.name.trim(),
      type: formData.type,
      capacity: formData.capacity,
      maxCapacity: formData.maxCapacity,
      beds: bedsArray,
      floor: floor as 'EG' | '1OG' | '2OG' | '3OG' | '4OG' | '5OG' | '6OG',
      price: formData.type === 'COMMON' ? 0 : formData.price,
      position: room?.position || { x: 0, y: 0 },
      width: formData.width, // Без ограничений минимального размера
      height: formData.height, // Без ограничений минимального размера
      isCommon: formData.type === 'COMMON' ? true : formData.isCommon,
      zIndex: room?.zIndex || 1,
      description: formData.description.trim() || null,
      hasShower: formData.hasShower,
      hasToilet: formData.hasToilet,
      pricePerPerson: formData.pricePerPerson,
      textVertical: formData.type === 'COMMON' ? formData.textVertical : false
    };

    onSave(roomData);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-[10000] p-4 pb-20 lg:pb-4 overflow-y-auto">
      <div className="bg-white dark:bg-card rounded-lg max-w-2xl w-full my-8 max-h-[calc(90vh-80px)] lg:max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-foreground">
            {room ? 'Редактировать комнату' : 'Создать новую комнату'}
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Номер комнаты <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="101"
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Тип комнаты <span className="text-red-500">*</span>
                </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value as 'FZ' | 'DZ' | 'EZ' | 'MZ' | 'App' | 'COMMON';
                      const isCommon = newType === 'COMMON';
                      setFormData({ 
                        ...formData, 
                        type: newType,
                        isCommon: isCommon,
                        price: isCommon ? 0 : formData.price || 70
                      });
                    }}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                >
                  <option value="FZ">FZ</option>
                  <option value="DZ">DZ</option>
                  <option value="EZ">EZ</option>
                  <option value="MZ">MZ</option>
                  <option value="App">App</option>
                  <option value="COMMON">COMMON</option>
                </select>
              </div>
            </div>

            {formData.type !== 'COMMON' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                      Вместимость (текст)
                    </label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="до 4 чел."
                      className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                      Максимальная вместимость
                    </label>
                    <input
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                    Кровати (через запятую)
                  </label>
                  <input
                    type="text"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    placeholder="1-DB, 1-HB"
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                    Цена за ночь (€)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="pricePerPerson"
                      checked={formData.pricePerPerson}
                      onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="pricePerPerson" className="text-sm font-semibold cursor-pointer text-gray-900 dark:text-foreground">
                      Цена за одного человека
                    </label>
                  </div>
                </div>

                {/* Душ и туалет */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasShower"
                      checked={formData.hasShower}
                      onChange={(e) => setFormData({ ...formData, hasShower: e.target.checked })}
                      className="w-5 h-5 text-blue-600 dark:text-primary border-gray-300 dark:border-border rounded focus:ring-blue-500 dark:focus:ring-primary"
                    />
                    <label htmlFor="hasShower" className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-gray-900 dark:text-foreground">
                      <ShowerHead className="w-5 h-5 text-blue-600 dark:text-primary" />
                      <span>Душ</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasToilet"
                      checked={formData.hasToilet}
                      onChange={(e) => setFormData({ ...formData, hasToilet: e.target.checked })}
                      className="w-5 h-5 text-blue-600 dark:text-primary border-gray-300 dark:border-border rounded focus:ring-blue-500 dark:focus:ring-primary"
                    />
                    <label htmlFor="hasToilet" className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-gray-900 dark:text-foreground">
                      <Toilet className="w-5 h-5 text-blue-600 dark:text-primary" />
                      <span>Туалет</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {formData.type === 'COMMON' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="textVertical"
                  checked={formData.textVertical}
                  onChange={(e) => setFormData({ ...formData, textVertical: e.target.checked })}
                  className="w-5 h-5 text-blue-600 dark:text-primary border-gray-300 dark:border-border rounded focus:ring-blue-500 dark:focus:ring-primary"
                />
                <label htmlFor="textVertical" className="text-sm font-semibold cursor-pointer text-gray-900 dark:text-foreground">
                  Расположить текст вертикально
                </label>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Ширина (px)
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 120 })}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Высота (px)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Описание
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание комнаты, особенности..."
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-blue-500 dark:focus:border-ring focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-muted hover:bg-gray-400 dark:hover:bg-accent text-gray-700 dark:text-foreground py-3 rounded-lg font-semibold"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-700 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/90 text-white dark:text-primary-foreground py-3 rounded-lg font-semibold"
            >
              {room ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Модальное окно редактирования ступеней
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StairsEditModal({ stairs, hotelId, floor, onSave, onClose }: { stairs: Stairs; hotelId: string; floor: string; onSave: (updatedStairs: Stairs) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    direction: stairs.direction || 'up',
    targetFloor: stairs.targetFloor || '1OG',
    width: stairs.width || 80,
    height: stairs.height || 80,
    x: stairs.position.x,
    y: stairs.position.y,
  });

  const handleSave = () => {
    const updatedStairs: Stairs = {
      ...stairs,
      direction: formData.direction as 'up' | 'down' | 'both',
      targetFloor: formData.targetFloor as 'EG' | '1OG' | '2OG' | '3OG',
      width: formData.width,
      height: formData.height,
      position: { x: formData.x, y: formData.y }
    };
    onSave(updatedStairs);
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-[10000] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-card rounded-lg max-w-md w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-foreground">Редактировать ступени</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Позиция X (px)
                </label>
                <input
                  type="number"
                  value={formData.x}
                  onChange={(e) => setFormData({ ...formData, x: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Позиция Y (px)
                </label>
                <input
                  type="number"
                  value={formData.y}
                  onChange={(e) => setFormData({ ...formData, y: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Ширина (px)
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 80 })}
                  min="40"
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                  Высота (px)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 80 })}
                  min="40"
                  className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-gray-700 dark:focus:border-ring focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900 dark:text-foreground">
                Направление
              </label>
              <select
                value={formData.direction}
                onChange={(e) => {
                  const newDirection = e.target.value as 'up' | 'down' | 'both';
                  setFormData({ ...formData, direction: newDirection });
                }}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-border rounded-lg bg-white dark:bg-input text-gray-900 dark:text-foreground focus:border-blue-500 dark:focus:border-ring focus:outline-none"
              >
                <option value="up">Вверх ↑</option>
                <option value="down">Вниз ↓</option>
                <option value="both">Оба направления ↕</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-muted hover:bg-gray-400 dark:hover:bg-accent text-gray-700 dark:text-foreground py-3 rounded-lg font-semibold"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-700 dark:bg-primary hover:bg-gray-800 dark:hover:bg-primary/90 text-white dark:text-primary-foreground py-3 rounded-lg font-semibold"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

