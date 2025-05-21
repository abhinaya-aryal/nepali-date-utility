import React, { useState } from "react";
import { NepaliDate } from "../types";
import { bsMonthsEn, bsMonthsNe, toNepaliDigits } from "../data/bs-calendar";
import { addMonths } from "../utils/converter";

interface MonthNavigationProps {
  viewDate: NepaliDate;
  onViewDateChange: (date: NepaliDate) => void;
  locale?: "en" | "ne";
  className?: string;
}

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  viewDate,
  onViewDateChange,
  locale = "en",
  className = "",
}) => {
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const monthNames = locale === "ne" ? bsMonthsNe : bsMonthsEn;

  const handlePrevMonth = () => {
    onViewDateChange(addMonths(viewDate, -1));
  };

  const handleNextMonth = () => {
    onViewDateChange(addMonths(viewDate, 1));
  };

  const handleYearSelect = (year: number) => {
    onViewDateChange({ ...viewDate, year });
    setShowYearDropdown(false);
  };

  const handleMonthSelect = (month: number) => {
    onViewDateChange({ ...viewDate, month });
    setShowMonthDropdown(false);
  };

  const yearOptions = Array.from({ length: 91 }, (_, i) => 2000 + i);

  return (
    <div className={`flex items-center justify-between p-2 ${className}`}>
      <button
        type="button"
        onClick={handlePrevMonth}
        className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Previous month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className="flex items-center space-x-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            {monthNames[viewDate.month - 1]}
          </button>

          {showMonthDropdown && (
            <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {monthNames.map((month, index) => (
                <div
                  key={month}
                  onClick={() => handleMonthSelect(index + 1)}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 ${
                    viewDate.month === index + 1
                      ? "bg-indigo-50 text-indigo-700"
                      : ""
                  }`}
                >
                  {month}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            {locale === "ne" ? toNepaliDigits(viewDate.year) : viewDate.year}
          </button>

          {showYearDropdown && (
            <div className="absolute z-10 mt-1 w-24 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {yearOptions.map((year) => (
                <div
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 ${
                    viewDate.year === year ? "bg-indigo-50 text-indigo-700" : ""
                  }`}
                >
                  {locale === "ne" ? toNepaliDigits(year) : year}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextMonth}
        className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Next month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default MonthNavigation;

