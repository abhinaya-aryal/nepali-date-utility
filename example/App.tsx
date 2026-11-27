import React, { useState } from "react";
import {
  type BSDate,
  type Locale,
  adToBS,
  bsToAD,
  formatBS,
  todayBS,
} from "../src/core";
import { NepaliDatePicker } from "../src/react";

function App() {
  const [selectedDate, setSelectedDate] = useState<BSDate | null>(() =>
    todayBS(),
  );
  const [locale, setLocale] = useState<Locale>("en");
  const [format, setFormat] = useState<string>("YYYY-MM-DD");
  const [adToBs, setAdToBs] = useState<BSDate | null>(null);
  const [bsToAd, setBsToAd] = useState<Date | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 pt-8 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Nepali Date Utility v2
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Basic Usage
          </h2>

          <div className="mb-6">
            <label
              htmlFor="basic-date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Date
            </label>
            <NepaliDatePicker
              id="basic-date"
              value={selectedDate}
              onChange={setSelectedDate}
              format={format}
              locale={locale}
              clearable
              className="w-full"
            />
          </div>

          {selectedDate && (
            <div className="bg-gray-50 rounded p-4 mb-4">
              <p className="text-sm text-gray-500 mb-1">Selected Date</p>
              <p className="font-medium">
                {formatBS(selectedDate, { format, locale })}
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
                onChange={(e) => setFormat(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-white"
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
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-white"
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
                Custom Slots via classNames
              </label>
              <NepaliDatePicker
                defaultValue={todayBS()}
                clearable
                placeholder="Custom Input Style"
                classNames={{
                  input:
                    "text-red-500 bg-purple-50 border-2 border-indigo-500 focus:ring-1",
                  calendar: "border-2 border-indigo-500",
                  selectedDay: "bg-red-500 text-white hover:bg-red-600",
                  today: "border-red-500 text-red-600",
                  disabledDay: "opacity-20",
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                With Min/Max Date
              </label>
              <NepaliDatePicker
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
                  position="top"
                  placeholder="Calendar opens above"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disabled State
              </label>
              <NepaliDatePicker disabled placeholder="This is disabled" />
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
                  if (!e.target.value) {
                    setAdToBs(null);
                    return;
                  }
                  const [year, month, day] = e.target.value
                    .split("-")
                    .map(Number);
                  try {
                    setAdToBs(adToBS(new Date(year, month - 1, day)));
                  } catch {
                    setAdToBs(null);
                  }
                }}
              />
              {adToBs && (
                <p className="mt-2 text-gray-600">
                  BS: {formatBS(adToBs, { separator: "/" })}
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
                  setBsToAd(bsDate ? bsToAD(bsDate) : null);
                }}
                position="top"
                clearable
                className="w-full"
              />
              {bsToAd && (
                <p className="mt-2 text-gray-600">
                  AD: {bsToAd.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
