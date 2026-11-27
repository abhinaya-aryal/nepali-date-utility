# nepali-date-utility

Zero-dependency Nepali Bikram Sambat (BS) date library with accessible, customizable React components. Works in Node.js, Next.js (RSC/SSR), Vue, Svelte, vanilla TypeScript, and React.

> [Live Demo »](https://date.aryalabhinaya.com.np)

## Features

- **Zero-dependency core**: Import pure BS ↔ AD conversion, date math, formatting, and parsing without pulling in React or DOM dependencies.
- **Minimal bundle size**: Compact 2-bit packed BS calendar table (2000–2090 BS), `sideEffects: false`, and ESM + CJS dual exports.
- **First-class React UI (`nepali-date-utility/react`)**: Accessible WAI-ARIA `dialog`/`grid` `NepaliDatePicker`, full keyboard navigation, `ref` forwarding, `clearable`, `classNames` slots, `unstyled` mode, and a headless `useCalendar` hook.
- **Localization**: Built-in English (`en`) and Nepali (`ne`) month names, weekday names, and Devanagari digit conversion.

## Installation

```bash
bun add nepali-date-utility
# or
npm install nepali-date-utility
```

## Core Usage (Node, Next.js, Vue, Vanilla TS/JS)

Import from the root (`nepali-date-utility`) or `nepali-date-utility/core` — zero React dependencies included:

```ts
import {
  adToBS,
  bsToAD,
  todayBS,
  formatBS,
  parseBS,
  addDays,
  addMonths,
  diffDays,
  isValidBSDate,
} from "nepali-date-utility";

const today = todayBS();
// { year: 2083, month: 8, day: 11 }

const bs = adToBS(new Date(2025, 3, 14));
// { year: 2082, month: 1, day: 1 }

const ad = bsToAD(bs);
// JS Date: 2025-04-14 (local)

formatBS(bs, { format: "MMMM DD, YYYY", locale: "ne" });
// "बैशाख ०१, २०८२"

parseBS("२०८२-०१-०१");
// { year: 2082, month: 1, day: 1 }

const nextWeek = addDays(bs, 7);
diffDays(nextWeek, bs); // 7
```

## React Usage (`nepali-date-utility/react`)

If you use Tailwind CSS, include the package in your Tailwind config:

```js
// tailwind.config.js
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/nepali-date-utility/**/*.{js,ts,jsx,tsx}",
]
```

Or with Tailwind v4 / Vite in your main stylesheet:

```css
@source "../node_modules/nepali-date-utility";
```

```tsx
import { useState } from "react";
import { type BSDate, formatBS, bsToAD } from "nepali-date-utility";
import { NepaliDatePicker } from "nepali-date-utility/react";

export function App() {
  const [date, setDate] = useState<BSDate | null>(null);

  return (
    <div className="p-4">
      <NepaliDatePicker
        value={date}
        onChange={setDate}
        placeholder="Select Nepali Date"
        format="YYYY-MM-DD"
        locale="en"
        clearable
      />

      {date && (
        <p className="mt-4">
          BS: {formatBS(date)} | AD: {bsToAD(date).toDateString()}
        </p>
      )}
    </div>
  );
}
```

### Headless Hook (`useCalendar`)

Build a completely custom calendar UI while reusing all BS grid, range, and navigation logic:

```tsx
import { useCalendar } from "nepali-date-utility/react";

const { viewDate, weeks, canGoPrev, canGoNext, goToPrevMonth, goToNextMonth } =
  useCalendar({ value, onSelect, minDate, maxDate });
```

## API Reference

### Core Functions (`nepali-date-utility` / `nepali-date-utility/core`)

| Function | Signature | Description |
| --- | --- | --- |
| `adToBS` | `(adDate: Date) => BSDate` | Convert Gregorian `Date` to BS |
| `bsToAD` | `(bsDate: BSDate) => Date` | Convert BS date to local Gregorian `Date` |
| `todayBS` | `() => BSDate` | Get today's date in BS |
| `getDaysInMonth` | `(year: number, month: number) => number` | Days in a BS month (29–32) |
| `getDaysInYear` | `(year: number) => number` | Total days in a BS year |
| `getDayOfWeek` | `(bsDate: BSDate) => number` | Day of week (`0 = Sun .. 6 = Sat`) |
| `getFirstDayOfMonth` | `(year: number, month: number) => number` | Weekday of the 1st of a BS month |
| `isValidBSDate` | `(date: unknown) => date is BSDate` | Type guard validating a BS date |
| `compareBS` | `(a: BSDate, b: BSDate) => -1 \| 0 \| 1` | Compare two BS dates |
| `isSameDay` | `(a: BSDate, b: BSDate) => boolean` | Equality check |
| `isBefore` / `isAfter` | `(a: BSDate, b: BSDate) => boolean` | Ordering checks |
| `isDateInRange` | `(date: BSDate, min?: BSDate, max?: BSDate) => boolean` | Inclusive range check |
| `addDays` | `(date: BSDate, days: number) => BSDate` | Add/subtract days |
| `addMonths` | `(date: BSDate, months: number) => BSDate` | Add/subtract months (clamping day) |
| `addYears` | `(date: BSDate, years: number) => BSDate` | Add/subtract years (clamping day) |
| `diffDays` | `(a: BSDate, b: BSDate) => number` | Signed day difference (`a - b`) |
| `startOfMonth` / `endOfMonth` | `(date: BSDate) => BSDate` | First / last day of month |
| `formatBS` | `(date: BSDate, options?: FormatOptions) => string` | Format BS date (`YYYY`, `YY`, `MMMM`, `MMM`, `MM`, `M`, `DD`, `D`, `dddd`, `ddd`) |
| `parseBS` | `(input: string, options?: ParseOptions) => BSDate \| null` | Parse English or Nepali date strings |
| `toNepaliDigits` / `toEnglishDigits` | `(value: string \| number) => string` | Convert between `0-9` and `०-९` |

### `NepaliDatePicker` Props (`nepali-date-utility/react`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `BSDate \| null` | — | Controlled selected date |
| `defaultValue` | `BSDate \| null` | `null` | Uncontrolled initial date |
| `onChange` | `(date: BSDate \| null) => void` | — | Callback on selection or clear |
| `minDate` / `maxDate` | `BSDate` | — | Inclusive date bounds |
| `format` | `string` | `"YYYY-MM-DD"` | Display and parse format |
| `locale` | `"en" \| "ne"` | `"en"` | Digit & month/weekday language |
| `separator` | `string` | — | Custom separator for numeric formats |
| `clearable` | `boolean` | `false` | Show clear button and allow clearing |
| `disabled` / `readOnly` / `required` | `boolean` | `false` | Standard form input states |
| `id` / `name` / `placeholder` | `string` | — | Standard input attributes |
| `position` | `"bottom" \| "top" \| "auto"` | `"bottom"` | Popup placement |
| `open` / `onOpenChange` | `boolean` / `(open: boolean) => void` | — | Controlled popup visibility |
| `unstyled` | `boolean` | `false` | Disable default Tailwind classes |
| `className` | `string` | — | Class name for root wrapper |
| `classNames` | `DatePickerClassNames` | — | Slot classes (`root`, `input`, `popup`, `calendar`, `header`, `day`, `selectedDay`, `today`, `disabledDay`, etc.) |

`NepaliDatePicker` and `DateInput` forward `ref` to the underlying `<input>` element.

## Migrating from v1 to v2

| v1 | v2 |
| --- | --- |
| `import { NepaliDatePicker } from "nepali-date-utility"` | `import { NepaliDatePicker } from "nepali-date-utility/react"` |
| `CustomDate` | `BSDate` |
| `convertADToBS(ad)` / `convertBSToAD(bs)` | `adToBS(ad)` / `bsToAD(bs)` (now returns native `Date`) |
| `getTodayBS()` | `todayBS()` |
| `formatDate(d, opts)` / `parseDate(str, fmt)` | `formatBS(d, opts)` / `parseBS(str, opts)` |
| `isValidBsDate(d)` | `isValidBSDate(d)` |
| `formatOptions={{ format, locale, separator }}` | Top-level `format`, `locale`, `separator` props |
| `inputClassName`, `calendarClassName`, `dayClassName`, ... | `classNames={{ input, calendar, day, selectedDay, today, disabledDay, ... }}` |

## Maintaining Calendar Data (Adding / Removing BS Years)

The supported BS calendar data (currently `2000–2090 BS`) is stored in a compact packed table in `src/core/calendar-data.ts`. You can append a new year or remove the last year using the built-in interactive scripts:

```bash
# Append the next BS year (prompts for each month Baishakh → Chaitra and asks to confirm)
bun run add-year

# Remove the last BS year (shows the year's data and asks for confirmation)
bun run remove-year
```

After updating the calendar data, run `bun run test` to verify all years and date conversions.

## License

[MIT](./LICENSE)
