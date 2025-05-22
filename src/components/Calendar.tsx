import React from "react";
import { NepaliDate, CalendarProps } from "../types";
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
  nepaliDigits,
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
  calendarClassName = "text-gray-500 font-medium bg-white",
  dayClassName = "text-gray-900",
  selectedDayClassName = "bg-indigo-600 text-white cursor-not-allowed",
  todayClassName = "text-indigo-600 border-2 border-indigo-600 font-bold",
  disabledDayClassName = "opacity-50 cursor-not-allowed",
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
          <div
            key={`day-name-${index}`}
            className={`text-center py-1 text-xs ${calendarClassName}`}
          >
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
        const date: NepaliDate = {
          year: viewDate.year,
          month: viewDate.month,
          day: dayOfMonth,
        };

        const isSelected =
          selectedDate && compareDates(selectedDate, date) === 0;

        const isToday =
          /* compareDates(date, {
            year: new Date().getFullYear() + 57, // Approximate BS year from AD
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
          }) === 0; */
          compareDates(date, getTodayBS()) === 0;

        const isInRange = isDateInRange(date, minDate, maxDate);

        cells.push(
          <button
            key={`day-${i}`}
            type="button"
            disabled={!isInRange}
            onClick={() => isInRange && onDateSelect(date)}
            className={`
              relative h-8 w-8 flex items-center justify-center text-sm rounded-full
              ${isSelected ? selectedDayClassName : dayClassName}
              ${isToday && !isSelected ? todayClassName : ""}
              ${isInRange && !isSelected ? "hover:bg-gray-200" : ""}
              ${!isInRange ? `${disabledDayClassName} cursor-not-allowed` : ""}
              focus:outline-none focus:ring-2 focus:ring-indigo-500
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
    <div className={`bg-white rounded-md shadow-lg ${calendarClassName}`}>
      <MonthNavigation
        viewDate={viewDate}
        onViewDateChange={onViewDateChange}
        locale={locale}
        className="border-b"
      />

      <div className="p-3">{generateCalendarDays()}</div>
    </div>
  );
};

function toNepaliDigits(num: number): string {
  return num
    .toString()
    .split("")
    .map((c) => {
      if (c >= "0" && c <= "9") {
        return nepaliDigits[parseInt(c)];
      }
      return c;
    })
    .join("");
}

export default Calendar;
