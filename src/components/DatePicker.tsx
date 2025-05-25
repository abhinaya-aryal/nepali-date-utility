import React, { useState, useRef, useEffect } from "react";
import { DatePickerProps, CustomDate } from "../types";
import { getTodayBS, isValidBsDate } from "../utils/converter";
import { parseDate } from "../utils/formatter";
import Calendar from "./Calendar";
import DateInput from "./DateInput";

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  minDate,
  maxDate,
  formatOptions = { format: "YYYY-MM-DD" },
  className = "",
  inputClassName = "",
  calendarClassName = "",
  dayClassName = "",
  selectedDayClassName = "",
  todayClassName = "",
  disabledDayClassName = "",
  position = "bottom",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<CustomDate>(value || getTodayBS());
  const [selectedDate, setSelectedDate] = useState<CustomDate | null>(
    value || null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setViewDate(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateSelect = (date: CustomDate) => {
    setSelectedDate(date);
    setIsOpen(false);

    if (onChange) {
      onChange(date);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (value: string) => {
    const date = parseDate(value, formatOptions.format);

    if (date && isValidBsDate(date)) {
      setSelectedDate(date);
      setViewDate(date);

      if (onChange) {
        onChange(date);
      }
    }
  };

  const getCalendarPosition = () => {
    switch (position) {
      case "top":
        return "bottom-full mb-1";
      case "bottom":
      default:
        return "top-full mt-1";
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div className="relative">
        <DateInput
          value={selectedDate}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          formatOptions={formatOptions}
          className={`px-3 py-2 rounded-md shadow-sm block w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10 ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
          aria-label="Toggle calendar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 w-72 bg-white rounded-md shadow-lg ${getCalendarPosition()}`}
        >
          <Calendar
            selectedDate={selectedDate}
            viewDate={viewDate}
            onDateSelect={handleDateSelect}
            onViewDateChange={setViewDate}
            minDate={minDate}
            maxDate={maxDate}
            locale={formatOptions.locale}
            calendarClassName={`border-gray-300 border shadow-lg rounded-md bg-white ${calendarClassName}`}
            dayClassName={`relative h-8 w-8 flex items-center justify-center text-sm text-gray-800 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${dayClassName}`}
            selectedDayClassName={`text-white cursor-not-allowed bg-indigo-500 ${
              selectedDayClassName
            }`}
            todayClassName={`text-indigo-600 border-2 border-indigo-600 font-bold ${todayClassName}`}
            disabledDayClassName={`opacity-50 cursor-not-allowed hover:bg-transparent ${
              disabledDayClassName
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
