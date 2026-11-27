import React, { useMemo, useState } from "react";
import {
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  MIN_BS_YEAR,
  MAX_BS_YEAR,
} from "../../core/calendar-data";
import { toNepaliDigits } from "../../core/formatter";
import { cn } from "../cn";
import type { MonthNavigationProps } from "../types";

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  viewDate,
  locale = "en",
  canGoPrev = viewDate.year > MIN_BS_YEAR || viewDate.month > 1,
  canGoNext = viewDate.year < MAX_BS_YEAR || viewDate.month < 12,
  onPrevMonth,
  onNextMonth,
  onSelectMonth,
  onSelectYear,
  unstyled = false,
  className,
}) => {
  const [openMenu, setOpenMenu] = useState<"month" | "year" | null>(null);

  const monthNames = locale === "ne" ? BS_MONTHS_NE : BS_MONTHS_EN;
  const yearOptions = useMemo(
    () =>
      Array.from(
        { length: MAX_BS_YEAR - MIN_BS_YEAR + 1 },
        (_, i) => MIN_BS_YEAR + i,
      ),
    [],
  );

  const navBtnClass = unstyled
    ? undefined
    : "p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent";

  const triggerBtnClass = unstyled
    ? undefined
    : "px-2 py-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium";

  const menuClass = unstyled
    ? undefined
    : "absolute z-10 mt-1 w-max bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black/10 overflow-auto";

  return (
    <div
      className={cn(
        !unstyled &&
          "flex items-center justify-between p-2 border-b border-gray-200",
        className,
      )}
    >
      <button
        type="button"
        onClick={onPrevMonth}
        disabled={!canGoPrev}
        className={navBtnClass}
        aria-label="Previous month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={unstyled ? undefined : "w-5 h-5"}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div className={unstyled ? undefined : "flex items-center space-x-1"}>
        <div className={unstyled ? undefined : "relative"}>
          <button
            type="button"
            onClick={() =>
              setOpenMenu((cur) => (cur === "month" ? null : "month"))
            }
            aria-expanded={openMenu === "month"}
            aria-haspopup="listbox"
            className={triggerBtnClass}
          >
            {monthNames[viewDate.month - 1]}
          </button>

          {openMenu === "month" && (
            <div role="listbox" aria-label="Select month" className={menuClass}>
              {monthNames.map((month, index) => {
                const isSelected = viewDate.month === index + 1;
                return (
                  <button
                    key={month}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectMonth(index + 1);
                      setOpenMenu(null);
                    }}
                    className={
                      unstyled
                        ? undefined
                        : cn(
                            "block w-full text-left cursor-pointer select-none py-1.5 pl-3 pr-8 hover:bg-indigo-100 font-medium",
                            isSelected &&
                              "bg-indigo-600 text-white hover:bg-indigo-600",
                          )
                    }
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={unstyled ? undefined : "relative"}>
          <button
            type="button"
            onClick={() =>
              setOpenMenu((cur) => (cur === "year" ? null : "year"))
            }
            aria-expanded={openMenu === "year"}
            aria-haspopup="listbox"
            className={triggerBtnClass}
          >
            {locale === "ne" ? toNepaliDigits(viewDate.year) : viewDate.year}
          </button>

          {openMenu === "year" && (
            <div role="listbox" aria-label="Select year" className={menuClass}>
              {yearOptions.map((year) => {
                const isSelected = viewDate.year === year;
                return (
                  <button
                    key={year}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectYear(year);
                      setOpenMenu(null);
                    }}
                    className={
                      unstyled
                        ? undefined
                        : cn(
                            "block w-full text-left cursor-pointer select-none py-1.5 pl-3 pr-8 hover:bg-indigo-100",
                            isSelected &&
                              "bg-indigo-600 text-white hover:bg-indigo-600",
                          )
                    }
                  >
                    {locale === "ne" ? toNepaliDigits(year) : year}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onNextMonth}
        disabled={!canGoNext}
        className={navBtnClass}
        aria-label="Next month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={unstyled ? undefined : "w-5 h-5"}
          aria-hidden="true"
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
