"use client";

import { useMemo, useState } from "react";
import { X, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import type { Room } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  FZ: "Семейная",
  DZ: "Двухместная",
  EZ: "Одноместная",
  MZ: "Многоместная",
  App: "Апартаменты",
  COMMON: "Общее помещение",
};

const FLOOR_LABELS: Record<string, string> = {
  EG: "Цокольный этаж",
  "1OG": "1 этаж",
  "2OG": "2 этаж",
  "3OG": "3 этаж",
  "4OG": "4 этаж",
  "5OG": "5 этаж",
  "6OG": "6 этаж",
};

interface RoomPriceModalProps {
  room: Room;
  rooms: Room[];
  hotelName?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function RoomPriceModal({
  room,
  rooms,
  hotelName,
  onClose,
  onSaved,
}: RoomPriceModalProps) {
  const [price, setPrice] = useState(room.price > 0 ? String(room.price) : "");
  const [perPerson, setPerPerson] = useState(Boolean(room.pricePerPerson));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Мини-план этажа: все комнаты этого отеля и этажа, наша — подсвечена
  const plan = useMemo(() => {
    const onFloor = rooms.filter(
      (r) => r.hotelId === room.hotelId && r.floor === room.floor,
    );
    return { onFloor };
  }, [rooms, room.hotelId, room.floor]);

  // Показываем участок вокруг нужной комнаты, а не весь этаж целиком
  const tw = room.width || 120;
  const th = room.height || 100;
  const cx = room.position.x + tw / 2;
  const cy = room.position.y + th / 2;
  const vbW = Math.max(520, tw * 4.5);
  const vbH = vbW * 0.65;
  const vbX = cx - vbW / 2;
  const vbY = cy - vbH / 2;

  const parsed = Number(price.replace(",", "."));
  const valid = price.trim() !== "" && Number.isFinite(parsed) && parsed > 0;

  const handleSave = async () => {
    if (!valid) {
      setError("Введите цену больше нуля");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await api.updateRoom(room.id, {
        price: parsed,
        pricePerPerson: perPerson,
      });
      onSaved();
      onClose();
    } catch (e) {
      console.error("Error saving room price:", e);
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#fbf8f4] p-6 shadow-2xl dark:bg-card sm:max-w-lg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#3d2f27] dark:text-foreground">
              Цена комнаты
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-base text-[#8a7566] dark:text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {hotelName || "Отель"} · комната {room.number}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-[#efe3d6] dark:hover:bg-white/10"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* План этажа с подсвеченной комнатой */}
        <div className="rounded-2xl bg-white p-3 dark:bg-white/5">
          <p className="mb-2 text-sm font-medium text-[#8a7566] dark:text-muted-foreground">
            {FLOOR_LABELS[room.floor] || room.floor} — эта комната выделена
          </p>
          <svg
            viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
            className="h-72 w-full"
            role="img"
            aria-label="План этажа"
          >
            {plan.onFloor.map((r) => {
              const w = r.width || 120;
              const h = r.height || 100;
              const isTarget = r.id === room.id;
              return (
                <g key={r.id}>
                  <rect
                    x={r.position.x}
                    y={r.position.y}
                    width={w}
                    height={h}
                    rx={6}
                    fill={isTarget ? "#ffb88c" : "#efe6dc"}
                    stroke={isTarget ? "#6b4a36" : "#d9c8b8"}
                    strokeWidth={isTarget ? 6 : 2}
                  />
                  <text
                    x={r.position.x + w / 2}
                    y={r.position.y + h / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(
                      isTarget ? 36 : 20,
                      (w * 0.9) / Math.max(2, r.number.length * 0.62),
                    )}
                    fontWeight={isTarget ? 700 : 400}
                    fill={isTarget ? "#3d2f27" : "#a8917f"}
                  >
                    {r.number}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-sm text-[#8a7566] dark:text-muted-foreground">
            {TYPE_LABELS[room.type] || room.type}
            {room.capacity ? ` · мест: ${room.capacity}` : ""}
            {room.name ? ` · «${room.name}»` : ""}
          </p>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-base font-medium text-[#3d2f27] dark:text-foreground">
            Цена за ночь, €
          </span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Например, 65"
            className="h-14 w-full rounded-2xl border border-[#d9c8b8] bg-white px-4 text-xl outline-none focus:border-[#6b4a36] focus:ring-2 focus:ring-[#6b4a36]/20 dark:bg-transparent"
            autoFocus
          />
        </label>

        <label className="mt-4 flex cursor-pointer items-center gap-3 text-base text-[#3d2f27] dark:text-foreground">
          <input
            type="checkbox"
            checked={perPerson}
            onChange={(e) => setPerPerson(e.target.checked)}
            className="h-6 w-6 accent-[#6b4a36]"
          />
          Цена за каждого человека (а не за комнату)
        </label>

        {error && <p className="mt-3 text-base text-[#a8431f]">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-14 flex-1 rounded-2xl bg-[#6b4a36] text-lg font-semibold text-white transition-colors hover:bg-[#5a3b28] disabled:opacity-60"
          >
            {saving ? "Сохраняю…" : "Сохранить цену"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-14 flex-1 rounded-2xl bg-[#efe3d6] text-lg font-medium text-[#5a3b28] hover:bg-[#e6d6c5] dark:bg-white/10 dark:text-foreground"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
