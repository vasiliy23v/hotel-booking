'use client';

import { useState, useEffect } from 'react';
import { 
  Bed, Users, DoorOpen, Lock, CheckCircle, Edit2, Plus, X, Trash2, 
  ArrowUpDown, Copy
} from 'lucide-react';
import type { Room, Stairs } from '@/types';

interface FloorPlanProps {
  rooms: Room[];
  floor: 'EG' | '1OG' | '2OG';
  onRoomClick: (room: Room) => void;
  onRoomUpdate?: (room: Room) => void;
  onRoomCreate?: (room: Room) => void;
  onCancelBooking?: (roomId: string) => void;
  currentUser: string;
  isManager: boolean;
  stairs?: Stairs[];
  onStairsUpdate?: (stairs: Stairs[]) => void;
  hotelId?: string;
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
  hotelId
}: FloorPlanProps) {
  const [editMode, setEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [roomStartPos, setRoomStartPos] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectedStairs, setSelectedStairs] = useState<string | null>(null);
  const [addingStairs, setAddingStairs] = useState(false);
  const [draggingStairs, setDraggingStairs] = useState<string | null>(null);
  const [stairsStartPos, setStairsStartPos] = useState({ x: 0, y: 0 });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [editingStairs, setEditingStairs] = useState<Stairs | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const SNAP_SIZE = 20;
  
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

  // Инициализация локальных состояний при входе/выходе из режима редактирования
  useEffect(() => {
    if (editMode) {
      // Сохраняем оригинальные данные при входе в режим редактирования
      setOriginalRooms([...rooms]);
      setOriginalStairs([...stairs]);
      setLocalRooms([...rooms]);
      setLocalStairs([...stairs]);
    } else {
      // При выходе из режима редактирования сбрасываем локальные состояния
      setLocalRooms([]);
      setLocalStairs([]);
      setOriginalRooms([]);
      setOriginalStairs([]);
    }
  }, [editMode, rooms, stairs]);

  // Используем локальные данные в режиме редактирования, иначе оригинальные
  const displayRooms = editMode ? localRooms : rooms;
  const displayStairs = editMode ? localStairs : stairs;

  const floorRooms = displayRooms.filter(r => r.floor === floor).sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  const floorStairs = displayStairs.filter(s => s.floor === floor);

  const getRoomColor = (room: Room) => {
    if (room.isCommon) return 'bg-gray-200 border-gray-400';
    if (!room.booking) return 'bg-emerald-100 border-emerald-400 hover:bg-emerald-200';
    const isMyBooking = room.booking.bookedBy === currentUser;
    if (isMyBooking || isManager) return 'bg-gray-100 border-gray-400 hover:bg-gray-200';
    return 'bg-gray-100 border-gray-400';
  };

  const getRoomIcon = (room: Room) => {
    if (room.isCommon) return <Lock className="w-4 h-4 text-gray-600" />;
    if (!room.booking) return <DoorOpen className="w-4 h-4 text-emerald-600" />;
    const isMyBooking = room.booking.bookedBy === currentUser;
    if (isMyBooking) return <CheckCircle className="w-4 h-4 text-gray-700" />;
    return <Lock className="w-4 h-4 text-gray-600" />;
  };

  const handleMouseDown = (e: React.MouseEvent, roomId: string) => {
    if (!editMode) return;
    e.preventDefault();
    const room = floorRooms.find(r => r.id === roomId);
    if (!room) return;

    setDragging(roomId);
    setDragStart({ x: e.clientX, y: e.clientY });
    // Используем позицию из локального состояния
    const localRoom = localRooms.find(r => r.id === roomId);
    setRoomStartPos({ 
      x: localRoom?.position.x || room.position.x, 
      y: localRoom?.position.y || room.position.y 
    });
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
      const room = floorRooms.find(r => r.id === dragging);
      if (!room) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      let newPos = {
        x: Math.max(0, roomStartPos.x + deltaX),
        y: Math.max(0, roomStartPos.y + deltaY)
      };

      if (snapToGrid) {
        newPos = snapPosition(newPos.x, newPos.y);
      }

      // Обновляем только локальное состояние
      const updatedRooms = localRooms.map(r => 
        r.id === dragging 
          ? { ...r, position: newPos }
          : r
      );
      setLocalRooms(updatedRooms);
    }

    if (resizing && editMode) {
      const room = floorRooms.find(r => r.id === resizing);
      if (!room) return;

      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      // Обновляем только локальное состояние
      const updatedRooms = localRooms.map(r => {
        if (r.id === resizing) {
          return {
            ...r,
            width: resizeStart.width + deltaX,
            height: resizeStart.height + deltaY
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

      let newPos = {
        x: Math.max(0, stairsStartPos.x + deltaX),
        y: Math.max(0, stairsStartPos.y + deltaY)
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

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
    setDraggingStairs(null);
  };

  const handleResizeStart = (e: React.MouseEvent, roomId: string) => {
    if (!editMode) return;
    e.stopPropagation();
    const room = floorRooms.find(r => r.id === roomId);
    if (!room) return;

    setResizing(roomId);
    // Используем размеры из локального состояния
    const localRoom = localRooms.find(r => r.id === roomId);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: localRoom?.width || room.width || 120,
      height: localRoom?.height || room.height || 100
    });
  };

  const handleRoomClick = (room: Room) => {
    if (dragging || resizing) return;

    if (editMode) {
      setSelectedRoom(room.id);
      return;
    }
    if (!room.isCommon) {
      // Если комната забронирована и пользователь имеет право отменить, показываем подтверждение
      if (room.booking && onCancelBooking && (room.booking.bookedBy === currentUser || isManager)) {
        if (confirm('Отменить бронирование этой комнаты?')) {
          onCancelBooking(room.id);
        }
      } else {
        onRoomClick(room);
      }
    }
  };

  const handleRoomSave = (room: Room) => {
    if (editingRoom && editMode) {
      const currentRoom = floorRooms.find(r => r.id === editingRoom.id);
      const updatedRoom = {
        ...room,
        position: currentRoom?.position || room.position,
        width: room.width, // Используем размеры из формы
        height: room.height, // Используем размеры из формы
        zIndex: currentRoom?.zIndex || room.zIndex
      };
      // Обновляем только локальное состояние
      setLocalRooms(localRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
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

    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left - 40;
    let y = e.clientY - rect.top - 40;

    if (snapToGrid) {
      const snapped = snapPosition(x, y);
      x = snapped.x;
      y = snapped.y;
    }

    const stairsHotelId = hotelId || floorRooms[0]?.hotelId || '';

    let targetFloor: 'EG' | '1OG' | '2OG' = floor;
    if (floor === 'EG') targetFloor = '1OG';
    else if (floor === '1OG') targetFloor = '2OG';
    else targetFloor = '1OG';

    const newStairs: Stairs = {
      id: `stairs-${Date.now()}`,
      hotelId: stairsHotelId,
      floor,
      position: { x: Math.max(0, x), y: Math.max(0, y) },
      width: 80,
      height: 80,
      direction: 'up',
      targetFloor
    };

    // Добавляем только в локальное состояние
    setLocalStairs([...localStairs, newStairs]);
    setAddingStairs(false);
  };

  const handleDeleteStairs = (stairsId: string) => {
    if (editMode) {
      // Удаляем только из локального состояния
      setLocalStairs(localStairs.filter(s => s.id !== stairsId));
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
      // Создаем копию ступеней с новым ID и немного смещенной позицией
      const duplicatedStairs: Stairs = {
        ...stairs,
        id: `stairs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: stairs.position.x + stairs.width + 20,
          y: stairs.position.y
        }
      };
      // Добавляем в локальное состояние
      setLocalStairs([...localStairs, duplicatedStairs]);
      // Выделяем новые ступени
      setSelectedStairs(duplicatedStairs.id);
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    if (editMode && confirm('Удалить эту комнату?')) {
      // Удаляем только из локального состояния
      setLocalRooms(localRooms.filter(r => r.id !== roomId));
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

  const handleDuplicateRoom = (room: Room) => {
    if (editMode) {
      // Создаем копию комнаты с новым ID и немного смещенной позицией
      const duplicatedRoom: Room = {
        ...room,
        id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        number: `${room.number}-copy`, // Временный номер, пользователь может изменить
        position: {
          x: room.position.x + (room.width || 120) + 20,
          y: room.position.y
        },
        zIndex: (room.zIndex || 1)
      };
      // Добавляем в локальное состояние
      setLocalRooms([...localRooms, duplicatedRoom]);
      // Выделяем новую комнату
      setSelectedRoom(duplicatedRoom.id);
    }
  };

  // Сохранение всех изменений при завершении редактирования
  const handleFinishEditing = async () => {
    if (!onRoomUpdate || !onStairsUpdate) return;

    try {
      // Сохраняем ВСЕ комнаты из localRooms (включая измененные и новые)
      const updatePromises: Promise<unknown>[] = [];
      
      for (const room of localRooms) {
        const original = originalRooms.find(r => r.id === room.id);
        if (original) {
          // Существующая комната - сохраняем все изменения
          const result = onRoomUpdate(room);
          if (result != null && typeof result === 'object' && 'then' in result) {
            updatePromises.push(result as Promise<unknown>);
          }
        } else {
          // Новая комната - создаем через onRoomCreate
          if (onRoomCreate) {
            const result = onRoomCreate(room);
            if (result != null && typeof result === 'object' && 'then' in result) {
              updatePromises.push(result as Promise<unknown>);
            }
          }
        }
      }

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

      // Сохраняем все изменения ступеней
      await onStairsUpdate(localStairs);

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">
          {floor === 'EG' ? 'Первый этаж' : floor === '1OG' ? 'Второй этаж' : 'Третий этаж'}
        </h3>
        {isManager && (
          <div className="flex gap-2 flex-wrap">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
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
                    addingStairs ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {addingStairs ? 'Отмена' : 'Добавить ступени'}
                </button>
                <button
                  onClick={() => setSnapToGrid(!snapToGrid)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    snapToGrid ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Примагничивание к сетке"
                >
                  {snapToGrid ? '✓ Сетка' : 'Сетка'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {editMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Режим редактирования:</strong> Перетаскивайте комнаты мышью, изменяйте размеры за угол, используйте кнопки для управления.
        </div>
      )}

      <div
        className="relative border-2 border-gray-300 rounded-lg bg-gray-50 overflow-auto"
        style={{
          minHeight: '600px',
          width: '100%',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleAddStairs}
      >
        {/* Ступени */}
        {floorStairs.map(stair => {
          const isMobile = windowWidth < 768;
          const mobileScale = isMobile ? Math.min(windowWidth / 800, 0.8) : 1;
          const scaledWidth = stair.width * mobileScale;
          const scaledHeight = stair.height * mobileScale;
          const scaledX = stair.position.x * mobileScale;
          const scaledY = stair.position.y * mobileScale;

          return (
            <div
              key={stair.id}
              data-stairs-id={stair.id}
              className={`absolute border-2 ${
                selectedStairs === stair.id ? 'border-gray-700' : 'border-gray-500'
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
                  setSelectedStairs(stair.id);
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
              {editMode && selectedStairs === stair.id && (
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
                    title="Дублировать"
                  >
                    <Copy className="w-3 h-3 inline" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteStairs(stair.id);
                    }}
                    className="bg-red-500 hover:bg-red-600 rounded px-2 py-1"
                    title="Удалить"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Комнаты */}
        {floorRooms.map(room => {
          const width = room.width || 120;
          const height = room.height || 100;
          const isSelected = selectedRoom === room.id;
          const isDragging = dragging === room.id;

          const isMobile = windowWidth < 768;
          const mobileScale = isMobile ? Math.min(windowWidth / 800, 0.8) : 1;
          const scaledWidth = width * mobileScale;
          const scaledHeight = height * mobileScale;
          const scaledX = room.position.x * mobileScale;
          const scaledY = room.position.y * mobileScale;

          return (
            <div
              key={room.id}
              data-room-id={room.id}
              className={`absolute border-2 rounded-lg p-2 transition-all ${
                getRoomColor(room)
              } ${isSelected && editMode ? 'ring-4 ring-gray-700' : ''} ${
                editMode ? 'cursor-move' : room.isCommon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${isDragging ? 'opacity-80' : ''}`}
              style={{
                left: `${scaledX}px`,
                top: `${scaledY}px`,
                width: `${scaledWidth}px`,
                height: `${scaledHeight}px`,
                zIndex: (room.zIndex || 1) + (isSelected ? 1000 : 0),
                fontSize: isMobile ? `${12 * mobileScale}px` : undefined
              }}
              onMouseDown={(e) => handleMouseDown(e, room.id)}
              onClick={() => handleRoomClick(room)}
            >
              <div className="absolute -top-2 -right-2">
                {getRoomIcon(room)}
              </div>

              <div className="font-bold text-sm">{room.number}</div>
              {room.name && (
                <div className={`text-xs font-semibold text-gray-800 ${isMobile ? 'truncate max-w-full' : ''}`} title={room.name}>
                  {isMobile && room.name.length > 10 ? `${room.name.substring(0, 10)}...` : room.name}
                </div>
              )}
              {!isMobile && (
                <div className="text-xs text-gray-600">
                  {room.type === 'COMMON' ? '' : room.type === 'FZ' ? 'Семейная' : room.type === 'DZ' ? 'Двухместная' : 'Одноместная'}
                </div>
              )}
              {!room.isCommon && room.price > 0 && (
                <div className="text-xs font-semibold text-gray-700">{room.price}€</div>
              )}
              {room.booking && (
                <div className="text-xs mt-1 text-gray-700 truncate">
                  {room.booking.guests?.length || 0}/{room.maxCapacity}
                </div>
              )}

              {editMode && isSelected && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 flex gap-1 flex-wrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRoom(room);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 rounded px-1 min-w-[60px]"
                    title="Редактировать"
                  >
                    <Edit2 className="w-3 h-3 inline" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateRoom(room);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 rounded px-1"
                    title="Дублировать"
                  >
                    <Copy className="w-3 h-3 inline" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCommon(room);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 rounded px-1"
                    title={room.isCommon ? 'Сделать бронируемой' : 'Сделать общей'}
                  >
                    {room.isCommon ? 'Бронь' : 'Общая'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZIndexChange(room, -1);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 rounded px-1"
                    title="Назад"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZIndexChange(room, 1);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 rounded px-1"
                    title="Вперед"
                  >
                    ↑
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoom(room.id);
                    }}
                    className="bg-red-500 hover:bg-red-600 rounded px-1"
                    title="Удалить"
                  >
                    <Trash2 className="w-3 h-3 inline" />
                  </button>
                </div>
              )}

              {/* Ресайзер */}
              {editMode && isSelected && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-gray-600 cursor-nwse-resize"
                  onMouseDown={(e) => handleResizeStart(e, room.id)}
                  style={{ transform: 'translate(50%, 50%)' }}
                />
              )}
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


      {/* Модальное окно создания/редактирования комнаты */}
      {(editingRoom || creatingRoom) && hotelId && (
        <RoomEditModal
          room={editingRoom}
          hotelId={hotelId}
          floor={floor}
          onSave={handleRoomSave}
          onClose={() => {
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
    </div>
  );
}

// Модальное окно редактирования комнаты
function RoomEditModal({ room, hotelId, floor, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    number: room?.number || '',
    name: room?.name || '',
    type: room?.type || 'DZ',
    capacity: room?.capacity || '2 чел.',
    maxCapacity: room?.maxCapacity || 2,
    beds: room?.beds?.join(', ') || '',
    price: room?.price || 0,
    description: room?.description || '',
    isCommon: room?.isCommon || false,
    width: room?.width || 120,
    height: room?.height || 100,
  });

  const handleSave = () => {
    if (!formData.number.trim()) {
      alert('Введите номер комнаты');
      return;
    }

    const bedsArray = formData.beds.split(',').map((b: string) => b.trim()).filter((b: string) => b);

    const roomData: Room = {
      id: room?.id || `room-${Date.now()}`,
      number: formData.number.trim(),
      hotelId,
      name: formData.name.trim(),
      type: formData.type,
      capacity: formData.capacity,
      maxCapacity: formData.maxCapacity,
      beds: bedsArray,
      floor,
      price: formData.type === 'COMMON' ? 0 : formData.price,
      position: room?.position || { x: 0, y: 0 },
      width: formData.width, // Без ограничений минимального размера
      height: formData.height, // Без ограничений минимального размера
      isCommon: formData.type === 'COMMON' ? true : formData.isCommon,
      zIndex: room?.zIndex || 1,
      description: formData.description.trim() || undefined
    };

    onSave(roomData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {room ? 'Редактировать комнату' : 'Создать новую комнату'}
          </h2>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Номер комнаты <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="101"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Тип комнаты <span className="text-red-500">*</span>
                </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value as 'FZ' | 'DZ' | 'EZ' | 'COMMON';
                      const isCommon = newType === 'COMMON';
                      setFormData({ 
                        ...formData, 
                        type: newType,
                        isCommon: isCommon,
                        price: isCommon ? 0 : formData.price || 70
                      });
                    }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                >
                  <option value="FZ">Семейная (FZ)</option>
                  <option value="DZ">Двухместная (DZ)</option>
                  <option value="EZ">Одноместная (EZ)</option>
                  <option value="COMMON">Общее помещение</option>
                </select>
              </div>
            </div>

            {formData.type !== 'COMMON' && (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Вместимость (текст)
                    </label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="до 4 чел."
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Максимальная вместимость
                    </label>
                    <input
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Кровати (через запятую)
                  </label>
                  <input
                    type="text"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                    placeholder="1-DB, 1-HB"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Цена за ночь (€)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Ширина (px)
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 120 })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Высота (px)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 100 })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold"
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
function StairsEditModal({ stairs, hotelId, floor, onSave, onClose }: any) {
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
      targetFloor: formData.targetFloor as 'EG' | '1OG' | '2OG',
      width: formData.width,
      height: formData.height,
      position: { x: formData.x, y: formData.y }
    };
    onSave(updatedStairs);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-md w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Редактировать ступени</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Позиция X (px)
                </label>
                <input
                  type="number"
                  value={formData.x}
                  onChange={(e) => setFormData({ ...formData, x: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Позиция Y (px)
                </label>
                <input
                  type="number"
                  value={formData.y}
                  onChange={(e) => setFormData({ ...formData, y: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Ширина (px)
                </label>
                <input
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 80 })}
                  min="40"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Высота (px)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 80 })}
                  min="40"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-gray-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Направление
              </label>
              <select
                value={formData.direction}
                onChange={(e) => {
                  const newDirection = e.target.value as 'up' | 'down' | 'both';
                  setFormData({ ...formData, direction: newDirection });
                }}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
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
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

