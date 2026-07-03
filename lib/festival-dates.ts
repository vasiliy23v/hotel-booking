export type FestivalDateRange = {
  startDate: string;
  endDate: string;
};

export const FESTIVAL_MONTH_MARGIN = 1;

export function parseLocalDate(date: Date | string): Date {
  if (typeof date === 'string') {
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function addMonthsWithMargin(
  months: Set<string>,
  rangeStart: Date,
  rangeEnd: Date,
  margin: number
) {
  const from = new Date(rangeStart.getFullYear(), rangeStart.getMonth() - margin, 1);
  const to = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth() + margin, 1);
  let cursor = from;
  while (cursor <= to) {
    months.add(monthKey(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  }
}

function monthsFromRange(rangeStart: Date, rangeEnd: Date, margin: number): Set<string> {
  const months = new Set<string>();
  addMonthsWithMargin(months, rangeStart, rangeEnd, margin);
  return months;
}

function getUpcomingRanges(ranges: FestivalDateRange[]): FestivalDateRange[] {
  const today = parseLocalDate(new Date());
  return ranges
    .filter((range) => parseLocalDate(range.endDate) >= today)
    .sort(
      (a, b) =>
        parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime()
    );
}

function inferFestivalWindowFromFutureBookings(
  bookings: Array<{ checkIn: string; checkOut: string }>
): { start: Date; end: Date } | null {
  const today = parseLocalDate(new Date());
  const future = bookings.filter((b) => parseLocalDate(b.checkIn) >= today);

  if (future.length === 0) {
    return null;
  }

  let start = parseLocalDate(future[0].checkIn);
  let end = parseLocalDate(future[0].checkOut);

  for (const booking of future) {
    const checkIn = parseLocalDate(booking.checkIn);
    const checkOut = parseLocalDate(booking.checkOut);
    if (checkIn < start) start = checkIn;
    if (checkOut > end) end = checkOut;
  }

  return { start, end };
}

function getLatestPastRange(ranges: FestivalDateRange[]): FestivalDateRange | null {
  const today = parseLocalDate(new Date());
  const pastRanges = ranges
    .filter((range) => parseLocalDate(range.endDate) < today)
    .sort(
      (a, b) =>
        parseLocalDate(b.endDate).getTime() - parseLocalDate(a.endDate).getTime()
    );

  return pastRanges[0] ?? null;
}

export function getCurrentFestivalVisibleMonths(
  bookings: Array<{ checkIn: string; checkOut: string }>,
  activeRanges: FestivalDateRange[],
  allRanges: FestivalDateRange[],
  margin = FESTIVAL_MONTH_MARGIN
): Set<string> {
  const today = parseLocalDate(new Date());

  const upcomingActive = getUpcomingRanges(activeRanges);
  if (upcomingActive.length > 0) {
    const months = new Set<string>();
    upcomingActive.forEach((range) => {
      addMonthsWithMargin(
        months,
        parseLocalDate(range.startDate),
        parseLocalDate(range.endDate),
        margin
      );
    });
    return months;
  }

  const upcomingAny = getUpcomingRanges(allRanges);
  if (upcomingAny.length > 0) {
    const months = new Set<string>();
    upcomingAny.forEach((range) => {
      addMonthsWithMargin(
        months,
        parseLocalDate(range.startDate),
        parseLocalDate(range.endDate),
        margin
      );
    });
    return months;
  }

  const inferredFromBookings = inferFestivalWindowFromFutureBookings(bookings);
  if (inferredFromBookings) {
    return monthsFromRange(inferredFromBookings.start, inferredFromBookings.end, margin);
  }

  const latestPastRange = getLatestPastRange(allRanges);
  if (latestPastRange) {
    return monthsFromRange(
      parseLocalDate(latestPastRange.startDate),
      parseLocalDate(latestPastRange.endDate),
      margin
    );
  }

  return monthsFromRange(today, today, margin);
}

export function isBookingOutsideCurrentFestival(
  booking: { checkIn: string; checkOut: string },
  visibleMonths: Set<string>
): boolean {
  const checkIn = parseLocalDate(booking.checkIn);
  const checkOut = parseLocalDate(booking.checkOut);
  const checkInMonth = monthKey(checkIn);
  const checkOutMonth = monthKey(checkOut);

  return !visibleMonths.has(checkInMonth) && !visibleMonths.has(checkOutMonth);
}

export function isPastFestivalBooking(
  booking: { checkIn: string; checkOut: string },
  allRanges: FestivalDateRange[],
  currentFestivalVisibleMonths: Set<string>
): boolean {
  const today = parseLocalDate(new Date());
  const checkIn = parseLocalDate(booking.checkIn);

  const pastRanges = allRanges.filter((range) => parseLocalDate(range.endDate) < today);
  const inPastFestivalRange = pastRanges.some((range) => {
    const start = parseLocalDate(range.startDate);
    const end = parseLocalDate(range.endDate);
    return checkIn >= start && checkIn <= end;
  });

  if (inPastFestivalRange) {
    return true;
  }

  return isBookingOutsideCurrentFestival(booking, currentFestivalVisibleMonths);
}
