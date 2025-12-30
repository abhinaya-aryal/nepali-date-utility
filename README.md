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
npm install nepali-date-utility
```

## 🚀 Usage

In `tailwind.config.js`, add `"./node_modules/nepali-date-utlity/**/*.{js,ts,jsx,tsx}"`

```js
// tailwind.config.js

...
content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/nepali-date-utility/**/*.{js,ts,jsx,tsx}"
],
...
```

Or if you are working in vite app, then in your main styleshteet add the following:

```css
@source "../node_modules/nepali-date-utility";
```

```tsx
import React, { useState } from "react";
import {
  NepaliDatePicker,
  CustomDate,
  formatDate,
  convertBSToAD,
} from "nepali-date-utility";

function App() {
  const [selectedDate, setSelectedDate] = useState<CustomDate | null>(null);

  const handleDateChange = (date: CustomDate) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
    console.log("Formatted date:", formatDate(date));
    console.log("Converted date:", formatDate(convertBSToAD(date)));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Nepali Date Utility Demo</h1>

      <NepaliDatePicker
        value={selectedDate}
        onChange={handleDateChange}
        placeholder="Select Nepali Date"
      />

      {selectedDate && (
        <p className="mt-4">Selected: {formatDate(selectedDate)}</p>
      )}
    </div>
  );
}

export default App;
```

## 🧾 API Reference

### NepaliDatePicker Props

| Prop                   | Type                          | Default                    | Description                                                     |
| ---------------------- | ----------------------------- | -------------------------- | --------------------------------------------------------------- |
| `value`                | `CustomDate \| null`          | `null`                     | Selected date                                                   |
| `onChange`             | `(date: CustomDate) => void`  | -                          | Callback when date changes                                      |
| `placeholder`          | `string`                      | `"YYYY-MM-DD"`             | Placeholder text for input                                      |
| `disabled`             | `boolean`                     | `false`                    | Disable the datepicker                                          |
| `minDate`              | `CustomDate`                  | -                          | Min date (inclusive)                                            |
| `maxDate`              | `CustomDate`                  | -                          | Max date (inclusive)                                            |
| `formatOptions`        | `CustomDateFormatOptions`     | `{ format: "YYYY-MM-DD" }` | Format options for date display                                 |
| `className`            | `string`                      | -                          | Additional class name for the widget (mainly used for `w-full`) |
| `inputClassName`       | `string`                      | -                          | Override class name for input field                             |
| `calendarClassName`    | `string`                      | -                          | Override class name for calendar popup                          |
| `dayClassName`         | `string`                      | -                          | Override class name for the days in calendar                    |
| `selectedDayClassName` | `string`                      | -                          | Override class name for the selected day in calendar popup      |
| `todayClassName`       | `string`                      | -                          | Override class name for the today date in calendar popup        |
| `disabledDayClassName` | `string`                      | -                          | Override class name for the disabled day in calendar popup      |
| `position`             | `"bottom" \| "top" \| "auto"` | `"bottom"`                 | Position of the calendar popup                                  |

### 🧱 Type Definitions

```typescript
interface CustomDate {
  year: number;
  month: number;
  day: number;
}

interface CustomDateFormatOptions {
  format?: "YYYY-MM-DD" | "DD-MM-YYYY" | "MM/DD/YYYY" | "YYYY/MM/DD" | string;
  locale?: "en" | "ne";
  separator?: string;
}
```

### 🔧 Utility Functions

- `convertADToBS(adDate: Date): CustomDate` - Convert AD date to BS date
- `convertBSToAD(bsDate: CustomDate): CustomDate` - Convert BS date to AD date
- `getTodayBS(): NepaliDate` - Get today's date in BS
- `formatDate(date: CustomDate, options?: CustomDateFormatOptions): string` - Format `customDate` type to string
- `parseDate(dateStr: string, format?: string): CustomDate | null` - Parse string to `CustomDate` format
- `isValidBsDate(date: NepaliDate): boolean` - Check if BS date is valid

## 🎨 Customization Examples

You can customize the appearance using Tailwind classes:

```jsx
<NepaliDatePicker
  value={getTodayBS()}
  inputClassName="text-red-500 bg-purple-50 border-2 border-indigo-500 focus:outline-none focus:ring-1 ring-indigo-500"
  calendarClassName="text-blue-500 border-2 border-red-500"
  dayClassName="text-blue-500"
  selectedDayClassName="bg-red-500 text-white hover:bg-red-500"
  todayClassName="border-red-500 border-2"
  placeholder="Custom Input Style"
  disabledDayClassName="opacity-20"
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
