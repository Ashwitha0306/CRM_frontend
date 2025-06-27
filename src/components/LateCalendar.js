import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Example late dates
const lateDates = [
  new Date(2024, 2, 23),
  new Date(2024, 2, 18),
  new Date(2024, 1, 12)
];

export default function LateCalendar() {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formatted = date.toDateString();
      return lateDates.some(d => d.toDateString() === formatted)
        ? 'bg-yellow-400 text-black font-bold rounded-full'
        : null;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Late Days Calendar</h1>
      <div className="bg-white p-4 rounded-lg shadow w-full max-w-6xl h-[75vh]">
        <Calendar
          tileClassName={tileClassName}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
