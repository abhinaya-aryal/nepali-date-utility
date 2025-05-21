# 🌸 Nepali DatePicker

A beautiful and customizable React date picker component along with other utilities for the Nepali Bikram Sambat calendar system.

> ✨ [Live Demo »](https://date.aryalabhinaya.com.np)

## ✨ Features

- 🌿 Modern, clean UI with Tailwind CSS
- 📅 Full support for the Bikram Sambat calendar
- 🔁 Seamless BS ↔ AD conversion utilities
- 🌐 Localization (English + Nepali)
- 🎨 Highly customizable theming
- 📱 Responsive and accessible design
- 🧠 Simple and powerful API

## 📦 Installation

```bash
npm install nepali-date-utlity
```

## 🚀 Usage

```tsx
import React, { useState } from "react";
import { NepaliDatePicker, NepaliDate } from "nepali-date-utility";
import "nepali-date-utility/styles.css";

function App() {
  const [selectedDate, setSelectedDate] = useState<NepaliDate | null>(null);

  const handleDateChange = (date: NepaliDate) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
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

## 🧾 API Reference

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

### 🧱 Type Definitions

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

### 🔧 Utility Functions

- `convertADToBS(adDate: Date): NepaliDate` - Convert AD date to BS date
- `convertBSToAD(bsDate: NepaliDate): GregorianDate` - Convert BS date to AD date
- `getTodayBS(): NepaliDate` - Get today's date in BS
- `formatBSDate(date: NepaliDate, options?: NepaliDateFormatOptions): string` - Format BS date to string
- `parseBSDate(dateStr: string, format?: string): NepaliDate | null` - Parse string to BS date
- `isValidBsDate(date: NepaliDate): boolean` - Check if BS date is valid

## 🎨 Customization Examples

You can customize the appearance using Tailwind classes:

```jsx
<NepaliDatePicker
  className="w-full"
  inputClassName="border-2 border-indigo-500 rounded-lg"
  calendarClassName="border border-indigo-200"
/>
```

```jsx
<NepaliDatePicker
  value={null}
  minDate={{ year: 2080, month: 1, day: 1 }}
  maxDate={{ year: 2080, month: 12, day: 30 }}
  placeholder="2080 BS only"
/>
```

```jsx
<NepaliDatePicker value={null} disabled={true} placeholder="This is disabled" />
```

```jsx
<NepaliDatePicker
  value={null}
  position="top"
  placeholder="Calendar opens above"
/>
```

## 🌐 Demo

> 📍 **Live Preview**: [https://date.aryalabhinaya.com.np](https://date.aryalabhinaya.com.np)

Explore the component’s features interactively.

## 📄 License

[MIT](./LICENSE)
