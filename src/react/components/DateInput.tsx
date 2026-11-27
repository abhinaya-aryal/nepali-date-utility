import React, { forwardRef, useEffect, useState } from "react";
import { formatBS } from "../../core/formatter";
import { isValidBSDate } from "../../core/compare";
import type { DateInputProps } from "../types";

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput(
    {
      id,
      name,
      value,
      onChange,
      onClick,
      onFocus,
      onBlur,
      placeholder = "YYYY-MM-DD",
      disabled = false,
      readOnly = false,
      required = false,
      format = "YYYY-MM-DD",
      locale = "en",
      separator,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-expanded": ariaExpanded,
      "aria-haspopup": ariaHasPopup,
    },
    ref,
  ) {
    const [inputValue, setInputValue] = useState<string>(() =>
      value && isValidBSDate(value)
        ? formatBS(value, { format, locale, separator })
        : "",
    );

    useEffect(() => {
      if (value && isValidBSDate(value)) {
        setInputValue(formatBS(value, { format, locale, separator }));
      } else if (value === null) {
        setInputValue("");
      }
    }, [value, format, locale, separator]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setInputValue(next);
      onChange?.(next);
    };

    return (
      <input
        ref={ref}
        id={id}
        name={name}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={className}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
      />
    );
  },
);
