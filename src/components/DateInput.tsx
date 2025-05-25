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
  className,
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
      className={`${className}`}
    />
  );
};

export default DateInput;
