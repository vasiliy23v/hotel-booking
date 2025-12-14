"use client"

import * as React from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  allowedDateRanges?: Array<{ startDate: string; endDate: string }>
  bookedDateRanges?: Array<{ startDate: string; endDate: string }>
  defaultMonth?: Date
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Выберите дату",
  disabled = false,
  minDate,
  maxDate,
  className,
  allowedDateRanges,
  bookedDateRanges,
  defaultMonth,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Функция для проверки, разрешена ли дата
  const isDateAllowed = (dateToCheck: Date): boolean => {
    const dateOnly = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());

    // Проверка minDate/maxDate
    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (dateOnly < minDateOnly) return false;
    }
    if (maxDate) {
      const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (dateOnly > maxDateOnly) return false;
    }

    // Проверка занятых дат (бронирования комнаты)
    // Если дата попадает в диапазон занятых дат, она недоступна
    if (bookedDateRanges && bookedDateRanges.length > 0) {
      const isBooked = bookedDateRanges.some(range => {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        const rangeStartOnly = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
        const rangeEndOnly = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
        // Проверяем пересечение: дата должна быть >= startDate и < endDate (не включая дату выезда)
        return dateOnly >= rangeStartOnly && dateOnly < rangeEndOnly;
      });
      if (isBooked) return false;
    }

    // Проверка диапазонов дат фестиваля (разрешенные диапазоны)
    // Если allowedDateRanges передан (даже если пустой массив), это означает что есть ограничения
    // Если allowedDateRanges === undefined, значит ограничений нет
    if (allowedDateRanges !== undefined) {
      // Если массив пустой, значит нет разрешенных диапазонов - блокируем все даты
      if (allowedDateRanges.length === 0) {
        return false;
      }
      // Проверяем, что дата входит в один из разрешенных диапазонов
      const isInAnyRange = allowedDateRanges.some(range => {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        const rangeStartOnly = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
        const rangeEndOnly = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
        return dateOnly >= rangeStartOnly && dateOnly <= rangeEndOnly;
      });
      return isInAnyRange;
    }

    // Если allowedDateRanges === undefined, значит ограничений по диапазонам нет, разрешаем дату
    return true;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-white dark:bg-input text-gray-900 dark:text-foreground border-gray-300 dark:border-border hover:bg-gray-50 dark:hover:bg-accent hover:text-gray-900 dark:hover:text-foreground",
            !date && "text-gray-500 dark:text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {date ? format(date, "PPP", { locale: ru }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg z-[10000]" align="center">
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date || defaultMonth || minDate || new Date()}
          onSelect={(selectedDate) => {
            onSelect?.(selectedDate)
            if (selectedDate) {
              setOpen(false)
            }
          }}
          disabled={(dateToCheck) => {
            return !isDateAllowed(dateToCheck);
          }}
          modifiersClassNames={{
            disabled: "opacity-50 cursor-not-allowed text-gray-400 dark:text-muted-foreground",
          }}
          initialFocus
          locale={ru}
          className="bg-white dark:bg-card text-gray-900 dark:text-foreground"
        />
      </PopoverContent>
    </Popover>
  )
}

// Хелпер для форматирования даты в локальный формат YYYY-MM-DD
export function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

interface DateRangePickerProps {
  dateFrom?: Date
  dateTo?: Date
  onSelect?: (from: Date | undefined, to: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
  allowedDateRanges?: Array<{ startDate: string; endDate: string }>
  bookedDateRanges?: Array<{ startDate: string; endDate: string }>
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onSelect,
  placeholder = "Выберите даты",
  disabled = false,
  minDate,
  maxDate,
  className,
  allowedDateRanges,
  bookedDateRanges,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  const dateRange: DateRange | undefined = dateFrom || dateTo 
    ? { from: dateFrom, to: dateTo } 
    : undefined

  const handleSelect = (range: DateRange | undefined) => {
    onSelect?.(range?.from, range?.to)
    // Закрываем только когда выбран полный диапазон
    if (range?.from && range?.to) {
      setOpen(false)
    }
  }

  // Функция для проверки, разрешена ли дата
  const isDateAllowed = (dateToCheck: Date): boolean => {
    const dateOnly = new Date(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());

    // Проверка minDate/maxDate
    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (dateOnly < minDateOnly) return false;
    }
    if (maxDate) {
      const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (dateOnly > maxDateOnly) return false;
    }

    // Проверка занятых дат (бронирования комнаты)
    if (bookedDateRanges && bookedDateRanges.length > 0) {
      const isBooked = bookedDateRanges.some(range => {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        const rangeStartOnly = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
        const rangeEndOnly = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
        return dateOnly >= rangeStartOnly && dateOnly < rangeEndOnly;
      });
      if (isBooked) return false;
    }

    // Проверка диапазонов дат фестиваля (разрешенные диапазоны)
    // Если allowedDateRanges передан (даже если пустой массив), это означает что есть ограничения
    // Если allowedDateRanges === undefined, значит ограничений нет
    if (allowedDateRanges !== undefined) {
      // Если массив пустой, значит нет разрешенных диапазонов - блокируем все даты
      if (allowedDateRanges.length === 0) {
        return false;
      }
      // Проверяем, что дата входит в один из разрешенных диапазонов
      const isInAnyRange = allowedDateRanges.some(range => {
        const rangeStart = new Date(range.startDate);
        const rangeEnd = new Date(range.endDate);
        const rangeStartOnly = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
        const rangeEndOnly = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());
        return dateOnly >= rangeStartOnly && dateOnly <= rangeEndOnly;
      });
      return isInAnyRange;
    }

    // Если allowedDateRanges === undefined, значит ограничений по диапазонам нет, разрешаем дату
    return true;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-white dark:bg-input text-gray-900 dark:text-foreground border-gray-300 dark:border-border hover:bg-gray-50 dark:hover:bg-accent hover:text-gray-900 dark:hover:text-foreground",
            !dateFrom && "text-gray-500 dark:text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {dateFrom ? (
            dateTo ? (
              <>
                {format(dateFrom, "d MMM", { locale: ru })} - {format(dateTo, "d MMM yyyy", { locale: ru })}
              </>
            ) : (
              format(dateFrom, "d MMM yyyy", { locale: ru })
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg z-[10000]" align="center">
        <Calendar
          mode="range"
          defaultMonth={dateFrom || minDate || new Date()}
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={(dateToCheck) => {
            return !isDateAllowed(dateToCheck);
          }}
          modifiersClassNames={{
            disabled: "opacity-50 cursor-not-allowed text-gray-400 dark:text-muted-foreground",
          }}
          initialFocus
          locale={ru}
          className="bg-white dark:bg-card text-gray-900 dark:text-foreground rounded-lg border-0 shadow-sm"
        />
      </PopoverContent>
    </Popover>
  )
}

