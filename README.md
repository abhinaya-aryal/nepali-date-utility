# Nepali DatePicker

A beautiful and customizable React date picker component for the Nepali Bikram Sambat calendar system.

## Features

- Modern, clean UI with Tailwind CSS styling
- Full support for Bikram Sambat (BS) calendar
- Conversion utilities between BS and Gregorian dates
- Localization support (English and Nepali)
- Highly customizable theming
- Responsive design
- Accessibility features
- Comprehensive API

## Installation

```bash
npm install nepali-date-utlity
```

## Usage

```jsx
import React, { useState } from 'react';
import { NepaliDatePicker, NepaliDate } from 'nepali-date-utility';
import 'nepali-date-utility/styles.css'; // Optional: Import default styles

function App() {
  const [selectedDate, setSelectedDate] = useState<NepaliDate | null>(null);

  const handleDateChange = (date: NepaliDate) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Nepali Date Picker Demo</h1>

      <NepaliDatePicker
        value={selectedDate}
        onChange={handleDateChange}
        placeholder="Select Nepali Date"
      />

      {selectedDate && (
        <p className="mt-4">
          Selected: {selectedDate.year}-{selectedDate.month}-{selectedDate.day}
        </p>
      )}
    </div>
  );
}

export default App;
```

## API Reference

### NepaliDatePicker Props

| Prop                | Type                          | Default                    | Description                              |
| ------------------- | ----------------------------- | -------------------------- | ---------------------------------------- |
| `value`             | `NepaliDate \| null`          | `null`                     | Selected date                            |
| `onChange`          | `(date: NepaliDate) => void`  | -                          | Callback when date changes               |
| `placeholder`       | `string`                      | `"YYYY-MM-DD"`             | Placeholder text for input               |
| `disabled`          | `boolean`                     | `false`                    | Disable the datepicker                   |
| `minDate`           | `NepaliDate`                  | -                          | Min date (inclusive)                     |
| `maxDate`           | `NepaliDate`                  | -                          | Max date (inclusive)                     |
| `formatOptions`     | `NepaliDateFormatOptions`     | `{ format: "YYYY-MM-DD" }` | Format options for date display          |
| `className`         | `string`                      | `""`                       | Additional class names                   |
| `inputClassName`    | `string`                      | `""`                       | Additional class name for input field    |
| `calendarClassName` | `string`                      | `""`                       | Additional class name for calendar popup |
| `position`          | `"bottom" \| "top" \| "auto"` | `"bottom"`                 | Position of the calendar popup           |

### Type Definitions

```typescript
interface NepaliDate {
  year: number;
  month: number;
  day: number;
}

interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

interface NepaliDateFormatOptions {
  format?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD" | string;
  locale?: "en" | "ne";
  separator?: string;
}
```

### Utility Functions

- `convertADToBS(adDate: Date): NepaliDate` - Convert AD date to BS date
- `convertBSToAD(bsDate: NepaliDate): GregorianDate` - Convert BS date to AD date
- `getTodayBS(): NepaliDate` - Get today's date in BS
- `formatBSDate(date: NepaliDate, options?: NepaliDateFormatOptions): string` - Format BS date to string
- `parseBSDate(dateStr: string, format?: string): NepaliDate | null` - Parse string to BS date
- `isValidBsDate(date: NepaliDate): boolean` - Check if BS date is valid

## Customization

You can customize the appearance using Tailwind classes:

```jsx
<NepaliDatePicker
  className="w-full"
  inputClassName="border-2 border-indigo-500 rounded-lg"
  calendarClassName="border border-indigo-200"
/>
```

## License

MIT

