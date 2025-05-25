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
  className,
  inputClassName,
  calendarClassName,
  position = "bottom",
  dayClassName,
  selectedDayClassName,
  todayClassName,
  disabledDayClassName,
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
    <div ref={containerRef} className={`nepali-datepicker ${className || ""}`}>
      <div className="relative">
        <DateInput
          value={selectedDate}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          formatOptions={formatOptions}
          className={`nepali-datepicker-input pr-10 ${inputClassName || ""}`}
        />
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="nepali-datepicker-icon"
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
          className={`nepali-datepicker-calendar ${getCalendarPosition()} ${
            calendarClassName || ""
          }`}
        >
          <Calendar
            calendarClassName={calendarClassName}
            dayClassName={`nepali-datepicker-day ${dayClassName || ""}`}
            selectedDayClassName={`nepali-datepicker-day-selected ${
              selectedDayClassName || ""
            }`}
            todayClassName={`nepali-datepicker-day-today ${
              todayClassName || ""
            }`}
            disabledDayClassName={`nepali-datepicker-day-disabled ${
              disabledDayClassName || ""
            }`}
            selectedDate={selectedDate}
            viewDate={viewDate}
            onDateSelect={handleDateSelect}
            onViewDateChange={setViewDate}
            minDate={minDate}
            maxDate={maxDate}
            locale={formatOptions.locale}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
