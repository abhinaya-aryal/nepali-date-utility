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
import { NepaliDatePicker, CustomDate, formatDate } from "nepali-date-utility";
import "nepali-date-utility/styles.css";

function App() {
  const [selectedDate, setSelectedDate] = useState<CustomDate | null>(null);

  const handleDateChange = (date: CustomDate) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
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
  calendarClassName="text-blue-500"
  dayClassName="text-blue-500"
  selectedDayClassName="bg-red-500 text-white"
  todayClassName="border-blue-500 border-2"
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

### 💻Code of demo site

```tsx
import React, { useState } from "react";
import {
  NepaliDatePicker,
  CustomDate,
  formatDate,
  getTodayBS,
  convertADToBS,
  convertBSToAD,
} from "./index";

function App() {
  const [selectedDate, setSelectedDate] = useState<CustomDate | null>(
    getTodayBS(),
  );
  const [locale, setLocale] = useState<"en" | "ne">("en");
  const [format, setFormat] = useState<string>("YYYY-MM-DD");
  const [adToBs, setAdToBs] = useState<CustomDate | null>(null);
  const [bsToAd, setBsToAd] = useState<CustomDate | null>(null);

  const handleDateChange = (date: CustomDate) => {
    setSelectedDate(date);
  };

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as "en" | "ne");
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Nepali DatePicker Demo
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Basic Usage
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <NepaliDatePicker
              value={selectedDate}
              onChange={handleDateChange}
              formatOptions={{ format, locale }}
              className="w-full"
            />
          </div>

          {selectedDate && (
            <div className="bg-gray-50 rounded p-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">Selected Date</p>
              <p className="font-medium">
                {formatDate(selectedDate, { format, locale })}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Format
              </label>
              <select
                value={format}
                onChange={handleFormatChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                <option value="MMMM DD, YYYY">MMMM DD, YYYY</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locale
              </label>
              <select
                value={locale}
                onChange={handleLocaleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
              >
                <option value="en">English</option>
                <option value="ne">नेपाली</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Customization Examples
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Input Style
              </label>
              <NepaliDatePicker
                value={getTodayBS()}
                inputClassName="text-red-500 bg-purple-50 border-2 border-indigo-500 focus:outline-none focus:ring-1 ring-indigo-500"
                calendarClassName="text-blue-500"
                dayClassName="text-blue-500"
                selectedDayClassName="bg-red-500 text-white"
                todayClassName="border-blue-500 border-2"
                placeholder="Custom Input Style"
                disabledDayClassName="opacity-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                With Min/Max Date
              </label>
              <NepaliDatePicker
                value={null}
                minDate={{ year: 2082, month: 1, day: 1 }}
                maxDate={{ year: 2082, month: 1, day: 31 }}
                placeholder="2082 BS Baishakh only"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                With Top Position
              </label>
              <div className="mt-32">
                <NepaliDatePicker
                  value={null}
                  position="top"
                  placeholder="Calendar opens above"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disabled State
              </label>
              <NepaliDatePicker
                value={null}
                disabled={true}
                placeholder="This is disabled"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            BS ↔ AD Conversion
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gregorian (AD) to Nepali (BS)
              </label>
              <input
                type="date"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border"
                onChange={(e) => {
                  const ad = new Date(e.target.value);
                  const bs = convertADToBS(ad);
                  setAdToBs(bs);
                }}
              />
              {adToBs && (
                <p className="mt-2 text-gray-600">
                  BS: {formatDate(adToBs, { separator: "/" })}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nepali (BS) to Gregorian (AD)
              </label>
              <NepaliDatePicker
                placeholder="Select BS date"
                onChange={(bsDate) => {
                  const ad = convertBSToAD(bsDate);
                  setBsToAd(ad);
                }}
                position="top"
                className="w-full"
              />
              {bsToAd && (
                <p className="mt-2 text-gray-600">AD: {formatDate(bsToAd)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
```

## 📄 License

[MIT](./LICENSE)
