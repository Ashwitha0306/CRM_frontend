import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Example present dates
const presentDates = [
  new Date(2024, 2, 21),
  new Date(2024, 2, 22),
  new Date(2024, 2, 25)
];

export default function PresentCalendar() {
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formatted = date.toDateString();
      return presentDates.some(d => d.toDateString() === formatted)
        ? 'bg-green-300 text-black font-bold rounded-full'
        : null;
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Present Days Calendar</h1>
      <div className="bg-white p-4 rounded-lg shadow w-full max-w-6xl h-[75vh]">
        <Calendar
          tileClassName={tileClassName}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
