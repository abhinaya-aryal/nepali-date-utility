import React, { useState, useRef, useEffect } from "react";
import { formatDate } from "../utils/formatter";
import { isValidBsDate } from "../utils/converter";
import { DateInputProps } from "../types";

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  formatOptions = { format: "YYYY-MM-DD" },
  className = "border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ",
  onFocus,
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value ? formatDate(value, formatOptions) : "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when the value prop changes
  useEffect(() => {
    if (value && isValidBsDate(value)) {
      setInputValue(formatDate(value, formatOptions));
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
      className={`px-3 py-2 rounded-md shadow-sm block w-full ${className}`}
    />
  );
};

export default DateInput;
