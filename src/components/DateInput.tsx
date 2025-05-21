import React, { useState, useRef, useEffect } from "react";
import { NepaliDate, NepaliDateFormatOptions } from "../types";
import { formatBSDate } from "../utils/formatter";
import { isValidBsDate } from "../utils/converter";

interface DateInputProps {
  value?: NepaliDate | null;
  onChange?: (value: string) => void;
  onSelect?: (date: NepaliDate | null) => void;
  placeholder?: string;
  disabled?: boolean;
  formatOptions?: NepaliDateFormatOptions;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  formatOptions = { format: "YYYY-MM-DD" },
  className = "",
  onFocus,
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value ? formatBSDate(value, formatOptions) : "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when the value prop changes
  useEffect(() => {
    if (value && isValidBsDate(value)) {
      setInputValue(formatBSDate(value, formatOptions));
    } else if (value === null) {
      setInputValue("");
    }
  }, [value, formatOptions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full ${className}`}
    />
  );
};

export default DateInput;

