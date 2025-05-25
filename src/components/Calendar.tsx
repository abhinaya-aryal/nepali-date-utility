import React from "react";
import { CustomDate, CalendarProps } from "../types";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isDateInRange,
  compareDates,
  getTodayBS,
} from "../utils/converter";
import {
  bsDaysShortEn,
  bsDaysShortNe,
  toNepaliDigits,
} from "../data/bs-calendar";
import MonthNavigation from "./MonthNavigation";

export const Calendar: React.FC<CalendarProps> = ({
  locale = "en",
  selectedDate,
  viewDate,
  onDateSelect,
  onViewDateChange,
  minDate,
  maxDate,
  calendarClassName,
  dayClassName,
  selectedDayClassName,
  todayClassName,
  disabledDayClassName,
}) => {
  // Get first day of month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = getFirstDayOfMonth(viewDate.year, viewDate.month);

  // Get total days in month
  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const dayNames = locale === "ne" ? bsDaysShortNe : bsDaysShortEn;

    // Add day names header
    days.push(
      <div key="day-names" className="grid grid-cols-7 mb-1">
        {dayNames.map((day, index) => (
          <div key={`day-name-${index}`} className={dayClassName}>
            {day}
          </div>
        ))}
      </div>,
    );

    // Calculate total cells needed (days + empty cells for alignment)
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    // Generate calendar grid
    let cells = [];
    for (let i = 0; i < totalCells; i++) {
      const dayOfMonth = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= daysInMonth;

      if (isCurrentMonth) {
        const date: CustomDate = {
          year: viewDate.year,
          month: viewDate.month,
          day: dayOfMonth,
        };

        const isSelected =
          selectedDate && compareDates(selectedDate, date) === 0;

        const isToday = compareDates(date, getTodayBS()) === 0;

        const isInRange = isDateInRange(date, minDate, maxDate);

        cells.push(
          <button
            key={`day-${i}`}
            type="button"
            disabled={!isInRange}
            onClick={() => isInRange && onDateSelect(date)}
            className={`
              ${isSelected ? selectedDayClassName : dayClassName}
              ${isToday && !isSelected ? todayClassName : ""}
              ${isInRange && !isSelected ? "hover:bg-gray-300" : ""}
              ${!isInRange ? `${disabledDayClassName}` : ""}
            `}
            aria-selected={isSelected ? "true" : "false"}
          >
            {locale === "ne" ? toNepaliDigits(dayOfMonth) : dayOfMonth}
          </button>,
        );
      } else {
        // Empty cell
        cells.push(<div key={`empty-${i}`} className="h-8 w-8" />);
      }
    }

    // Group cells into weeks (rows of 7)
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(
        <div key={`week-${i}`} className="grid grid-cols-7 gap-1">
          {cells.slice(i, i + 7)}
        </div>,
      );
    }

    days.push(
      <div key="calendar-grid" className="mt-2 space-y-1">
        {weeks}
      </div>,
    );

    return days;
  };

  return (
    <div className={calendarClassName}>
      <MonthNavigation
        viewDate={viewDate}
        onViewDateChange={onViewDateChange}
        locale={locale}
      />

      <div className="p-3">{generateCalendarDays()}</div>
    </div>
  );
};

export default Calendar;
