import type { BSDate, FormatOptions, Locale } from "../core/types";

export interface DatePickerClassNames {
  root?: string;
  inputWrapper?: string;
  input?: string;
  clearButton?: string;
  toggleButton?: string;
  popup?: string;
  calendar?: string;
  header?: string;
  weekdayRow?: string;
  weekday?: string;
  grid?: string;
  day?: string;
  selectedDay?: string;
  today?: string;
  disabledDay?: string;
}

export interface CalendarDay {
  date: BSDate;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
}

export interface UseCalendarOptions {
  value?: BSDate | null;
  viewDate?: BSDate;
  defaultViewDate?: BSDate;
  onViewDateChange?: (date: BSDate) => void;
  minDate?: BSDate;
  maxDate?: BSDate;
  onSelect?: (date: BSDate) => void;
}

export interface UseCalendarReturn {
  viewDate: BSDate;
  setViewDate: (date: BSDate) => void;
  weeks: (CalendarDay | null)[][];
  canGoPrev: boolean;
  canGoNext: boolean;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  selectMonth: (month: number) => void;
  selectYear: (year: number) => void;
  selectDate: (date: BSDate) => void;
  today: BSDate;
}

export interface MonthNavigationProps {
  viewDate: BSDate;
  locale?: Locale;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectMonth: (month: number) => void;
  onSelectYear: (year: number) => void;
  unstyled?: boolean;
  className?: string;
}

export interface CalendarProps {
  value?: BSDate | null;
  viewDate?: BSDate;
  defaultViewDate?: BSDate;
  onSelect?: (date: BSDate) => void;
  onViewDateChange?: (date: BSDate) => void;
  minDate?: BSDate;
  maxDate?: BSDate;
  locale?: Locale;
  unstyled?: boolean;
  className?: string;
  classNames?: Pick<
    DatePickerClassNames,
    | "calendar"
    | "header"
    | "weekdayRow"
    | "weekday"
    | "grid"
    | "day"
    | "selectedDay"
    | "today"
    | "disabledDay"
  >;
}

export interface DateInputProps {
  id?: string;
  name?: string;
  value?: BSDate | null;
  onChange?: (rawValue: string) => void;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  format?: FormatOptions["format"];
  locale?: Locale;
  separator?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "dialog";
}

export interface NepaliDatePickerProps {
  /** Controlled selected date */
  value?: BSDate | null;
  /** Uncontrolled initial selected date */
  defaultValue?: BSDate | null;
  /** Called when the selected date changes or is cleared */
  onChange?: (date: BSDate | null) => void;

  /** Minimum selectable BS date (inclusive) */
  minDate?: BSDate;
  /** Maximum selectable BS date (inclusive) */
  maxDate?: BSDate;

  /** Display and input format pattern (default: "YYYY-MM-DD") */
  format?: FormatOptions["format"];
  /** Locale for digits and month/weekday names (default: "en") */
  locale?: Locale;
  /** Custom separator for standard numeric formats */
  separator?: string;

  /** Standard input/form attributes */
  id?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  clearable?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;

  /** Popup placement preference (default: "bottom") */
  position?: "bottom" | "top" | "auto";
  /** Controlled open state */
  open?: boolean;
  /** Called when popup open state changes */
  onOpenChange?: (open: boolean) => void;

  /** Disable default Tailwind classes for full custom styling */
  unstyled?: boolean;
  /** Class name applied to the root wrapper */
  className?: string;
  /** Slot-level class names for every internal element */
  classNames?: DatePickerClassNames;
}
