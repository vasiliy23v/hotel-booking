'use client';

import { Rnd } from 'react-rnd';
import type { Room } from '@/types';

interface RoomWithRndProps {
  room: Room;
  editMode: boolean;
  scale: number;
  onDragStop: (room: Room, position: { x: number; y: number }) => void;
  onResizeStop: (room: Room, size: { width: number; height: number }) => void;
  onClick: (room: Room) => void;
  isSelected: boolean;
  children: React.ReactNode;
}

/**
 * Компонент комнаты с использованием react-rnd
 * Автоматически обрабатывает перемещение и изменение размера
 */
export default function RoomWithRnd({
  room,
  editMode,
  scale,
  onDragStop,
  onResizeStop,
  onClick,
  isSelected,
  children
}: RoomWithRndProps) {
  if (!editMode) {
    // В обычном режиме просто отображаем комнату без редактирования
    return (
      <div
        style={{
          position: 'absolute',
          left: room.position.x * scale,
          top: room.position.y * scale,
          width: (room.width || 120) * scale,
          height: (room.height || 100) * scale,
        }}
        onClick={() => onClick(room)}
      >
        {children}
      </div>
    );
  }

  // В режиме редактирования используем Rnd для drag and resize
  return (
    <Rnd
      size={{
        width: (room.width || 120) * scale,
        height: (room.height || 100) * scale,
      }}
      position={{
        x: room.position.x * scale,
        y: room.position.y * scale,
      }}
      onDragStop={(e, d) => {
        // Сохраняем новую позицию
        onDragStop(room, {
          x: d.x / scale,
          y: d.y / scale,
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        // Сохраняем новый размер и позицию
        onResizeStop(room, {
          width: ref.offsetWidth / scale,
          height: ref.offsetHeight / scale,
        });
      }}
      bounds="parent" // Ограничиваем перемещение родительским контейнером
      minWidth={40 * scale}
      minHeight={40 * scale}
      scale={scale}
      disableResizing={!editMode}
      disableDragging={!editMode}
      style={{
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
        cursor: editMode ? 'move' : 'pointer',
      }}
      onClick={() => onClick(room)}
    >
      {children}
    </Rnd>
  );
}

