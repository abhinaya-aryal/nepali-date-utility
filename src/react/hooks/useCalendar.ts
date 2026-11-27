import { useCallback, useMemo, useState } from "react";
import type { BSDate } from "../../core/types";
import {
  MIN_BS_YEAR,
  MAX_BS_YEAR,
  getDaysInMonth,
} from "../../core/calendar-data";
import { getFirstDayOfMonth, todayBS } from "../../core/converter";
import { isDateInRange, isSameDay, isValidBSDate } from "../../core/compare";
import { addMonths } from "../../core/math";
import type {
  CalendarDay,
  UseCalendarOptions,
  UseCalendarReturn,
} from "../types";

export function useCalendar(
  options: UseCalendarOptions = {},
): UseCalendarReturn {
  const {
    value,
    viewDate: controlledViewDate,
    defaultViewDate,
    onViewDateChange,
    minDate,
    maxDate,
    onSelect,
  } = options;

  const today = useMemo(() => todayBS(), []);

  const [internalViewDate, setInternalViewDate] = useState<BSDate>(() => {
    if (controlledViewDate && isValidBSDate(controlledViewDate)) {
      return controlledViewDate;
    }
    if (value && isValidBSDate(value)) {
      return value;
    }
    if (defaultViewDate && isValidBSDate(defaultViewDate)) {
      return defaultViewDate;
    }
    return today;
  });

  const viewDate = controlledViewDate ?? internalViewDate;

  const setViewDate = useCallback(
    (next: BSDate) => {
      if (!controlledViewDate) {
        setInternalViewDate(next);
      }
      onViewDateChange?.(next);
    },
    [controlledViewDate, onViewDateChange],
  );

  const canGoPrev = viewDate.year > MIN_BS_YEAR || viewDate.month > 1;
  const canGoNext = viewDate.year < MAX_BS_YEAR || viewDate.month < 12;

  const goToPrevMonth = useCallback(() => {
    if (!canGoPrev) return;
    setViewDate(addMonths(viewDate, -1));
  }, [canGoPrev, setViewDate, viewDate]);

  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return;
    setViewDate(addMonths(viewDate, 1));
  }, [canGoNext, setViewDate, viewDate]);

  const selectMonth = useCallback(
    (month: number) => {
      const maxDay = getDaysInMonth(viewDate.year, month);
      setViewDate({
        year: viewDate.year,
        month,
        day: Math.min(viewDate.day, maxDay),
      });
    },
    [setViewDate, viewDate],
  );

  const selectYear = useCallback(
    (year: number) => {
      const maxDay = getDaysInMonth(year, viewDate.month);
      setViewDate({
        year,
        month: viewDate.month,
        day: Math.min(viewDate.day, maxDay),
      });
    },
    [setViewDate, viewDate],
  );

  const selectDate = useCallback(
    (date: BSDate) => {
      if (!isDateInRange(date, minDate, maxDate)) return;
      onSelect?.(date);
    },
    [minDate, maxDate, onSelect],
  );

  const weeks = useMemo(() => {
    const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);
    const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    const rows: (CalendarDay | null)[][] = [];
    for (let i = 0; i < totalCells; i += 7) {
      const row: (CalendarDay | null)[] = [];
      for (let j = 0; j < 7; j++) {
        const dayNum = i + j - firstDay + 1;
        if (dayNum < 1 || dayNum > daysInMonth) {
          row.push(null);
        } else {
          const date: BSDate = {
            year: viewDate.year,
            month: viewDate.month,
            day: dayNum,
          };
          row.push({
            date,
            isSelected: Boolean(value && isSameDay(value, date)),
            isToday: isSameDay(date, today),
            isDisabled: !isDateInRange(date, minDate, maxDate),
          });
        }
      }
      rows.push(row);
    }

    return rows;
  }, [viewDate.year, viewDate.month, value, today, minDate, maxDate]);

  return {
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
    today,
  };
}
