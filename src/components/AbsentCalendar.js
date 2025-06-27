import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Example absent dates
const absentDates = [
  new Date(2024, 2, 24),
  new Date(2024, 1, 16),
  new Date(2024, 1, 10)
];

export default function AbsentCalendar() {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formatted = date.toDateString();
      return absentDates.some(d => d.toDateString() === formatted)
        ? 'bg-red-400 text-white font-bold rounded-full'
        : null;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Absent Days Calendar</h1>
      <div className="bg-white p-4 rounded-lg shadow w-full max-w-6xl h-[75vh]">
        <Calendar
          tileClassName={tileClassName}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
