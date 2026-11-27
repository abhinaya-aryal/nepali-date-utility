import { forwardRef, useEffect, useState } from "react";
import {
  autoUpdate,
  autoPlacement,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  FloatingPortal,
} from "@floating-ui/react";
import type { BSDate } from "../../core/types";
import { todayBS } from "../../core/converter";
import { isDateInRange, isValidBSDate } from "../../core/compare";
import { parseBS } from "../../core/formatter";
import { cn } from "../cn";
import { Calendar } from "./Calendar";
import { DateInput } from "./DateInput";
import type { NepaliDatePickerProps } from "../types";

export const NepaliDatePicker = forwardRef<
  HTMLInputElement,
  NepaliDatePickerProps
>(function NepaliDatePicker(
  {
    value,
    defaultValue = null,
    onChange,
    minDate,
    maxDate,
    format = "YYYY-MM-DD",
    locale = "en",
    separator,
    id,
    name,
    placeholder = "YYYY-MM-DD",
    disabled = false,
    readOnly = false,
    required = false,
    clearable = false,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    position = "bottom",
    open: controlledOpen,
    onOpenChange,
    unstyled = false,
    className,
    classNames,
  },
  ref,
) {
  const isControlledValue = value !== undefined;
  const isControlledOpen = controlledOpen !== undefined;

  const [internalValue, setInternalValue] = useState<BSDate | null>(
    isControlledValue ? value : defaultValue,
  );
  const selectedDate = isControlledValue ? value : internalValue;

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlledOpen ? controlledOpen : internalOpen;

  const [viewDate, setViewDate] = useState<BSDate>(() => {
    if (selectedDate && isValidBSDate(selectedDate)) return selectedDate;
    return todayBS();
  });

  const setOpen = (next: boolean) => {
    if (!isControlledOpen) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (selectedDate && isValidBSDate(selectedDate)) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if ((disabled || readOnly) && isOpen) {
      setOpen(false);
    }
  }, [disabled, readOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAuto = position === "auto";
  const placement = position === "top" ? "top-start" : "bottom-start";

  const middleware = isAuto
    ? [
        offset(4),
        autoPlacement({ alignment: "start" }),
        shift({ padding: 8 }),
      ]
    : [
        offset(4),
        ...(position === "top" ? [] : [flip()]),
        shift({ padding: 8 }),
      ];

  const {
    refs,
    floatingStyles,
    context,
    placement: finalPlacement,
  } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const commitDate = (next: BSDate | null) => {
    if (!isControlledValue) {
      setInternalValue(next);
    }
    if (next) {
      setViewDate(next);
    }
    onChange?.(next);
  };

  const handleDateSelect = (date: BSDate) => {
    commitDate(date);
    setOpen(false);
  };

  const handleClear = () => {
    if (disabled || readOnly) return;
    commitDate(null);
  };

  const handleInputFocus = () => {
    if (!disabled && !readOnly) {
      setOpen(true);
    }
  };

  const handleInputChange = (rawValue: string) => {
    if (rawValue.trim() === "" && clearable) {
      commitDate(null);
      return;
    }

    const parsed = parseBS(rawValue, { format, separator });
    if (parsed && isDateInRange(parsed, minDate, maxDate)) {
      commitDate(parsed);
    }
  };

  const showClear = clearable && Boolean(selectedDate) && !disabled && !readOnly;

  return (
    <div
      ref={refs.setReference}
      className={cn(
        !unstyled && "relative inline-block",
        classNames?.root,
        className,
      )}
    >
      <div className={cn(!unstyled && "relative", classNames?.inputWrapper)}>
        <DateInput
          ref={ref}
          id={id}
          name={name}
          value={selectedDate}
          onChange={handleInputChange}
          onClick={handleInputFocus}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          format={format}
          locale={locale}
          separator={separator}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={cn(
            !unstyled &&
              "px-3 py-2 rounded-md shadow-sm block w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
            !unstyled && (showClear ? "pr-16" : "pr-10"),
            classNames?.input,
          )}
        />

        <div
          className={
            unstyled
              ? undefined
              : "absolute inset-y-0 right-0 pr-2 flex items-center gap-1"
          }
        >
          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear date"
              className={cn(
                !unstyled &&
                  "p-1 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded",
                classNames?.clearButton,
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={unstyled ? undefined : "w-4 h-4"}
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => !disabled && !readOnly && setOpen(!isOpen)}
            disabled={disabled || readOnly}
            aria-label="Toggle calendar"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            className={cn(
              !unstyled &&
                "p-1 text-gray-600 cursor-pointer hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded",
              classNames?.toggleButton,
            )}
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
                d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            role="dialog"
            aria-modal="false"
            aria-label="Choose date"
            style={{ ...floatingStyles, zIndex: 9999 }}
            data-placement={finalPlacement}
            className={cn(
              !unstyled && "w-72 bg-white rounded-md shadow-lg",
              classNames?.popup,
            )}
            {...getFloatingProps()}
          >
            <Calendar
              value={selectedDate}
              viewDate={viewDate}
              onSelect={handleDateSelect}
              onViewDateChange={setViewDate}
              minDate={minDate}
              maxDate={maxDate}
              locale={locale}
              unstyled={unstyled}
              classNames={classNames}
            />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
});
