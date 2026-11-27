import React, { useCallback, useEffect, useRef } from "react";
import type { BSDate } from "../../core/types";
import {
  BS_DAYS_SHORT_EN,
  BS_DAYS_SHORT_NE,
  BS_MONTHS_EN,
  BS_MONTHS_NE,
} from "../../core/calendar-data";
import { addDays, addMonths } from "../../core/math";
import { toNepaliDigits } from "../../core/formatter";
import { useCalendar } from "../hooks/useCalendar";
import { cn } from "../cn";
import { MonthNavigation } from "./MonthNavigation";
import type { CalendarProps } from "../types";

export const Calendar: React.FC<CalendarProps> = ({
  value,
  viewDate: controlledViewDate,
  defaultViewDate,
  onSelect,
  onViewDateChange,
  minDate,
  maxDate,
  locale = "en",
  unstyled = false,
  className,
  classNames,
}) => {
  const {
    viewDate,
    setViewDate,
    weeks,
    canGoPrev,
    canGoNext,
    goToPrevMonth,
    goToNextMonth,
    selectMonth,
    selectYear,
    selectDate,
  } = useCalendar({
    value,
    viewDate: controlledViewDate,
    defaultViewDate,
    onViewDateChange,
    minDate,
    maxDate,
    onSelect,
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const pendingFocusDate = useRef<BSDate | null>(null);

  useEffect(() => {
    const target = pendingFocusDate.current;
    if (!target || !gridRef.current) return;
    if (target.year === viewDate.year && target.month === viewDate.month) {
      const btn = gridRef.current.querySelector<HTMLButtonElement>(
        `[data-bs-date="${target.year}-${target.month}-${target.day}"]`,
      );
      btn?.focus();
      pendingFocusDate.current = null;
    }
  }, [viewDate]);

  const moveFocusTo = useCallback(
    (next: BSDate) => {
      if (next.year === viewDate.year && next.month === viewDate.month) {
        const btn = gridRef.current?.querySelector<HTMLButtonElement>(
          `[data-bs-date="${next.year}-${next.month}-${next.day}"]`,
        );
        btn?.focus();
      } else {
        pendingFocusDate.current = next;
        setViewDate(next);
      }
    },
    [setViewDate, viewDate.year, viewDate.month],
  );

  const handleDayKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    date: BSDate,
    colIndex: number,
  ) => {
    let next: BSDate;

    try {
      switch (e.key) {
        case "ArrowLeft":
          next = addDays(date, -1);
          break;
        case "ArrowRight":
          next = addDays(date, 1);
          break;
        case "ArrowUp":
          next = addDays(date, -7);
          break;
        case "ArrowDown":
          next = addDays(date, 7);
          break;
        case "Home":
          next = addDays(date, -colIndex);
          break;
        case "End":
          next = addDays(date, 6 - colIndex);
          break;
        case "PageUp":
          next = addMonths(date, -1);
          break;
        case "PageDown":
          next = addMonths(date, 1);
          break;
        default:
          return;
      }
    } catch {
      // Out of supported BS range — ignore movement
      return;
    }

    e.preventDefault();
    moveFocusTo(next);
  };

  const dayNames = locale === "ne" ? BS_DAYS_SHORT_NE : BS_DAYS_SHORT_EN;
  const monthNames = locale === "ne" ? BS_MONTHS_NE : BS_MONTHS_EN;
  const gridLabel = `${monthNames[viewDate.month - 1]} ${
    locale === "ne" ? toNepaliDigits(viewDate.year) : viewDate.year
  }`;

  return (
    <div
      className={cn(
        !unstyled && "border border-gray-200 shadow-lg rounded-md bg-white",
        classNames?.calendar,
        className,
      )}
    >
      <MonthNavigation
        viewDate={viewDate}
        locale={locale}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onSelectMonth={selectMonth}
        onSelectYear={selectYear}
        unstyled={unstyled}
        className={classNames?.header}
      />

      <div
        ref={gridRef}
        role="grid"
        aria-label={gridLabel}
        className={cn(!unstyled && "p-2", classNames?.grid)}
      >
        <div
          role="row"
          className={cn(
            !unstyled && "grid grid-cols-7 gap-1 mb-1",
            classNames?.weekdayRow,
          )}
        >
          {dayNames.map((day, idx) => (
            <div
              key={day}
              role="columnheader"
              aria-label={day}
              data-weekday={idx}
              className={cn(
                !unstyled &&
                  "h-8 w-8 flex items-center justify-center text-xs text-gray-500 font-medium",
                classNames?.weekday,
              )}
            >
              {day}
            </div>
          ))}
        </div>

        <div className={unstyled ? undefined : "space-y-1"}>
          {weeks.map((week, rowIdx) => (
            <div
              key={`week-${rowIdx}`}
              role="row"
              className={unstyled ? undefined : "grid grid-cols-7 gap-1"}
            >
              {week.map((cell, colIdx) => {
                if (!cell) {
                  return (
                    <div
                      key={`empty-${rowIdx}-${colIdx}`}
                      role="gridcell"
                      aria-disabled="true"
                      className={unstyled ? undefined : "h-8 w-8"}
                    />
                  );
                }

                const { date, isSelected, isToday, isDisabled } = cell;
                const dateKey = `${date.year}-${date.month}-${date.day}`;

                return (
                  <div key={dateKey} role="gridcell">
                    <button
                      type="button"
                      data-bs-date={dateKey}
                      disabled={isDisabled}
                      onClick={() => selectDate(date)}
                      onKeyDown={(e) => handleDayKeyDown(e, date, colIdx)}
                      aria-selected={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      className={cn(
                        !unstyled &&
                          "relative h-8 w-8 flex items-center justify-center text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500",
                        !unstyled &&
                          !isSelected &&
                          !isDisabled &&
                          "text-gray-800 cursor-pointer hover:bg-gray-200",
                        classNames?.day,
                        isToday &&
                          !isSelected &&
                          cn(
                            !unstyled &&
                              "text-indigo-600 border-2 border-indigo-600 font-bold",
                            classNames?.today,
                          ),
                        isSelected &&
                          cn(
                            !unstyled &&
                              "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer",
                            classNames?.selectedDay,
                          ),
                        isDisabled &&
                          cn(
                            !unstyled &&
                              "opacity-40 cursor-not-allowed hover:bg-transparent",
                            classNames?.disabledDay,
                          ),
                      )}
                    >
                      {locale === "ne"
                        ? toNepaliDigits(date.day)
                        : date.day}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
