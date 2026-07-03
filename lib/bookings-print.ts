import { parseLocalDate, type FestivalDateRange } from '@/lib/festival-dates';
import type { BookingInfo, Room } from '@/types';

export type BookingForPrint = BookingInfo & {
  roomNumber?: string;
  hotelName?: string;
};

export type PrintRow = {
  name: string;
  bookedBy: string;
  roomLabel: string;
  dayKeys: Set<string>;
  priceFormula: string;
  totalPrice: number;
  showPrice: boolean;
};

export function dayKeyFromDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDayHeader(dayKey: string): string {
  const date = parseLocalDate(dayKey);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export function formatFullDate(dayKey: string): string {
  return parseLocalDate(dayKey).toLocaleDateString('ru-RU');
}

export function getStayDayKeys(checkIn: string, checkOut: string): string[] {
  const keys: string[] = [];
  const start = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);
  const cursor = new Date(start);

  while (cursor < end) {
    keys.push(dayKeyFromDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

function getUpcomingFestivalRange(
  activeRanges: FestivalDateRange[],
  allRanges: FestivalDateRange[]
): FestivalDateRange | null {
  const today = parseLocalDate(new Date());
  const upcomingActive = activeRanges
    .filter((range) => parseLocalDate(range.endDate) >= today)
    .sort((a, b) => parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime());

  if (upcomingActive.length > 0) {
    return upcomingActive[0];
  }

  const upcomingAny = allRanges
    .filter((range) => parseLocalDate(range.endDate) >= today)
    .sort((a, b) => parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime());

  return upcomingAny[0] ?? null;
}

export function collectPrintDayKeys(
  bookings: Array<{ checkIn: string; checkOut: string }>,
  activeRanges: FestivalDateRange[],
  allRanges: FestivalDateRange[]
): string[] {
  const keys = new Set<string>();

  for (const booking of bookings) {
    getStayDayKeys(booking.checkIn, booking.checkOut).forEach((key) => keys.add(key));
  }

  const festivalRange = getUpcomingFestivalRange(activeRanges, allRanges);
  if (festivalRange) {
    let cursor = parseLocalDate(festivalRange.startDate);
    const end = parseLocalDate(festivalRange.endDate);
    while (cursor <= end) {
      keys.add(dayKeyFromDate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return [...keys].sort();
}

function nightsLabel(nights: number): string {
  if (nights === 1) return 'ночь';
  if (nights >= 2 && nights <= 4) return 'ночи';
  return 'ночей';
}

export function calculateBookingNights(checkIn: string, checkOut: string): number {
  return Math.ceil(
    (parseLocalDate(checkOut).getTime() - parseLocalDate(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function buildPriceFormula(
  booking: BookingForPrint,
  room: Room | undefined,
  nights: number,
  options: { perGuest: boolean }
): { formula: string; amount: number } {
  const roomLabel = booking.roomNumber
    ? `#${booking.roomNumber}${booking.hotelName ? ` (${booking.hotelName})` : ''}`
    : booking.hotelName || '—';
  const nightsWord = nightsLabel(nights);
  const price = room?.price ?? 0;
  const guestsCount = booking.guests?.length ?? 0;

  if (!room || price <= 0) {
    return {
      formula: `Номер ${roomLabel}: цена не определена`,
      amount: 0,
    };
  }

  if (options.perGuest && guestsCount > 0) {
    const amount = nights * price;
    return {
      formula: [
        `Номер ${roomLabel}`,
        `${nights} ${nightsWord} × ${price.toFixed(2)}€ за чел/ночь`,
        `${nights} × ${price.toFixed(2)}€ = ${amount.toFixed(2)}€`,
      ].join(' → '),
      amount,
    };
  }

  const amount = nights * price;
  return {
    formula: [
      `Номер ${roomLabel}`,
      `${nights} ${nightsWord} × ${price.toFixed(2)}€ за номер`,
      `${nights} × ${price.toFixed(2)}€ = ${amount.toFixed(2)}€`,
      guestsCount > 0 ? `(гостей: ${guestsCount}, оплата за номер)` : '',
    ]
      .filter(Boolean)
      .join(' → '),
    amount,
  };
}

export function buildPrintRows(bookings: BookingForPrint[], rooms: Room[]): PrintRow[] {
  const rows: PrintRow[] = [];

  for (const booking of bookings) {
    const room = rooms.find((item) => item.id === booking.roomId);
    const nights = calculateBookingNights(booking.checkIn, booking.checkOut);
    const stayDays = new Set(getStayDayKeys(booking.checkIn, booking.checkOut));
    const guestsCount = booking.guests?.length ?? 0;
    const isPerPerson = Boolean(room?.pricePerPerson && guestsCount > 0);
    const roomLabel = booking.roomNumber
      ? `#${booking.roomNumber}${booking.hotelName ? ` · ${booking.hotelName}` : ''}`
      : booking.hotelName || '—';

    if (booking.guests && booking.guests.length > 0) {
      booking.guests.forEach((guest, index) => {
        const { formula, amount } = buildPriceFormula(booking, room, nights, {
          perGuest: isPerPerson,
        });

        rows.push({
          name: guest.name || '—',
          bookedBy: booking.bookedBy,
          roomLabel,
          dayKeys: stayDays,
          priceFormula: formula,
          totalPrice: amount,
          showPrice: isPerPerson || index === 0,
        });
      });
    } else {
      const { formula, amount } = buildPriceFormula(booking, room, nights, { perGuest: false });

      rows.push({
        name: booking.bookedBy,
        bookedBy: booking.bookedBy,
        roomLabel,
        dayKeys: stayDays,
        priceFormula: formula,
        totalPrice: amount,
        showPrice: true,
      });
    }
  }

  return rows.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildBookingsPrintHtml(options: {
  rows: PrintRow[];
  dayKeys: string[];
  title?: string;
  printedAt?: Date;
}): string {
  const { rows, dayKeys, title = 'Регистрация участников фестиваля', printedAt = new Date() } = options;

  const dayHeaders = dayKeys
    .map(
      (key) =>
        `<th class="day" title="${escapeHtml(formatFullDate(key))}">${escapeHtml(formatDayHeader(key))}</th>`
    )
    .join('');

  const bodyRows = rows
    .map((row) => {
      const dayCells = dayKeys
        .map((key) => {
          const checked = row.dayKeys.has(key);
          return `<td class="day">${checked ? '<span class="check">✓</span>' : ''}</td>`;
        })
        .join('');

      return `<tr>
        <td class="name">${escapeHtml(row.name)}</td>
        ${dayCells}
        <td class="formula">${escapeHtml(row.showPrice ? row.priceFormula : '—')}</td>
        <td class="amount">${row.showPrice && row.totalPrice > 0 ? `${row.totalPrice.toFixed(2)}€` : ''}</td>
        <td class="sign"></td>
        <td class="sign"></td>
      </tr>`;
    })
    .join('');

  const totalAmount = rows.reduce((sum, row) => sum + (row.showPrice ? row.totalPrice : 0), 0);

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #111;
      margin: 16px;
      font-size: 11px;
    }
    h1 {
      font-size: 16px;
      margin: 0 0 4px;
    }
    .meta {
      margin: 0 0 12px;
      color: #444;
      font-size: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    th, td {
      border: 1px solid #222;
      padding: 4px 3px;
      vertical-align: middle;
      word-wrap: break-word;
    }
    th {
      background: #f3f4f6;
      font-weight: 700;
      text-align: center;
      font-size: 10px;
    }
    td.name {
      text-align: left;
      font-weight: 600;
      width: 140px;
    }
    th.day, td.day {
      width: 34px;
      text-align: center;
      padding: 4px 1px;
    }
    .check {
      font-size: 13px;
      font-weight: 700;
      line-height: 1;
    }
    td.formula {
      text-align: left;
      font-size: 9px;
      line-height: 1.35;
      width: 220px;
    }
    td.amount {
      text-align: right;
      font-weight: 700;
      width: 64px;
      white-space: nowrap;
    }
    td.sign, th.sign {
      width: 72px;
      min-height: 28px;
    }
    tfoot td {
      font-weight: 700;
      background: #fafafa;
    }
    .legend {
      margin-top: 10px;
      font-size: 9px;
      color: #444;
      line-height: 1.45;
    }
    @page {
      size: landscape;
      margin: 10mm;
    }
    @media print {
      body { margin: 0; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">Дата печати: ${escapeHtml(
    printedAt.toLocaleString('ru-RU')
  )} · Участников: ${rows.length} · Дней: ${dayKeys.length}</p>
  <table>
    <thead>
      <tr>
        <th class="name">ФИО зарегистрированного</th>
        ${dayHeaders}
        <th>Расчёт стоимости</th>
        <th>Итого</th>
        <th class="sign">Подпись гостя</th>
        <th class="sign">Подпись администратора</th>
      </tr>
    </thead>
    <tbody>
      ${bodyRows || '<tr><td colspan="' + (dayKeys.length + 5) + '">Нет данных для печати</td></tr>'}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="${dayKeys.length + 2}" style="text-align:right">Итого по таблице:</td>
        <td class="amount">${totalAmount > 0 ? `${totalAmount.toFixed(2)}€` : '—'}</td>
        <td colspan="2"></td>
      </tr>
    </tfoot>
  </table>
  <div class="legend">
    <strong>Формула расчёта:</strong>
    для номера с оплатой за человека — <em>количество ночей × цена за чел/ночь</em>;
    для номера с оплатой за номер — <em>количество ночей × цена за номер</em>
    (количество гостей указано в формуле, но не умножается на цену).
    Галочка (✓) в колонке дня означает, что человек зарегистрирован на ночь с этой даты
    (день заезда включительно, день выезда не включается).
  </div>
</body>
</html>`;
}

function printHtmlDocument(html: string): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText =
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const doc = frameWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    alert('Не удалось подготовить документ для печати.');
    return;
  }

  const cleanup = () => {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  };

  doc.open();
  doc.write(html);
  doc.close();

  const runPrint = () => {
    try {
      frameWindow?.focus();
      frameWindow?.print();
    } catch (error) {
      console.error('Print failed:', error);
      alert('Не удалось запустить печать.');
    } finally {
      setTimeout(cleanup, 1000);
    }
  };

  if (doc.readyState === 'complete') {
    setTimeout(runPrint, 150);
  } else {
    iframe.onload = () => setTimeout(runPrint, 150);
  }
}

export function openBookingsPrintWindow(options: {
  bookings: BookingForPrint[];
  rooms: Room[];
  activeRanges: FestivalDateRange[];
  allRanges: FestivalDateRange[];
  title?: string;
}): void {
  const dayKeys = collectPrintDayKeys(options.bookings, options.activeRanges, options.allRanges);
  const rows = buildPrintRows(options.bookings, options.rooms);
  const html = buildBookingsPrintHtml({
    rows,
    dayKeys,
    title: options.title,
  });

  printHtmlDocument(html);
}
