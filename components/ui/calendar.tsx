"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-white dark:bg-card text-gray-900 dark:text-foreground group/calendar p-4 [--cell-size:3rem]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "h-8 w-8 select-none p-0 aria-disabled:opacity-50 rounded-md inline-flex items-center justify-center border border-transparent hover:border-gray-300 dark:hover:border-border transition-colors bg-white dark:bg-card text-gray-900 dark:text-foreground",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "h-8 w-8 select-none p-0 aria-disabled:opacity-50 rounded-md inline-flex items-center justify-center border border-transparent hover:border-gray-300 dark:hover:border-border transition-colors bg-white dark:bg-card text-gray-900 dark:text-foreground",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-8 w-full items-center justify-center pt-1",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-10 w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium text-gray-900 dark:text-foreground",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-gray-500 dark:[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex justify-between", defaultClassNames.weekdays),
        weekday: cn(
          "text-gray-500 dark:text-muted-foreground w-10 select-none rounded-md text-[0.8rem] font-normal text-center",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full justify-between", defaultClassNames.week),
        week_number_header: cn(
          "w-10 select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative w-10 h-10 select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-gray-100 dark:bg-muted rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-gray-100 dark:bg-muted rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-gray-400 dark:text-muted-foreground aria-selected:text-gray-400 dark:aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-gray-400 dark:text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex w-10 h-10 items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-gray-900 dark:data-[selected-single=true]:bg-primary data-[selected-single=true]:text-white dark:data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-gray-800 dark:data-[selected-single=true]:hover:bg-primary/90",
        "data-[range-middle=true]:bg-gray-100 dark:data-[range-middle=true]:bg-muted data-[range-middle=true]:text-gray-900 dark:data-[range-middle=true]:text-foreground",
        "data-[range-start=true]:bg-gray-900 dark:data-[range-start=true]:bg-primary data-[range-start=true]:text-white dark:data-[range-start=true]:text-primary-foreground data-[range-start=true]:hover:bg-gray-800 dark:data-[range-start=true]:hover:bg-primary/90",
        "data-[range-end=true]:bg-gray-900 dark:data-[range-end=true]:bg-primary data-[range-end=true]:text-white dark:data-[range-end=true]:text-primary-foreground data-[range-end=true]:hover:bg-gray-800 dark:data-[range-end=true]:hover:bg-primary/90",
        "flex items-center justify-center w-10 h-10 rounded-md",
        "font-medium text-base text-gray-900 dark:text-foreground",
        "border border-transparent hover:border-gray-300 dark:hover:border-border transition-colors",
        "data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-primary focus:ring-offset-1",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
