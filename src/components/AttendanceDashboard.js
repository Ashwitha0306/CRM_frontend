// src/components/AttendanceDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const attendanceData = [
  { date: '2024-03-25', status: 'Present', checkIn: '9:00 AM', checkOut: '6:00 PM' },
  { date: '2024-03-24', status: 'Absent', checkIn: '9:15 AM', checkOut: '—' },
  { date: '2024-03-23', status: 'Late', checkIn: '8:55 AM', checkOut: '6:00 PM' },
  { date: '2024-03-22', status: 'Present', checkIn: '9:02 AM', checkOut: '6:00 PM' },
  { date: '2024-03-21', status: 'Present', checkIn: '9:02 AM', checkOut: '—' }
];

export default function AttendanceDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div
          onClick={() => navigate('/present-calendar')}
          className="bg-teal-500 text-white p-6 rounded-lg shadow cursor-pointer hover:scale-105 transition"
        >
          <p className="text-xl font-medium">Present</p>
          <p className="text-4xl font-bold">20</p>
        </div>
        <div
          onClick={() => navigate('/absent-calendar')}
          className="bg-purple-500 text-white p-6 rounded-lg shadow cursor-pointer hover:scale-105 transition"
        >
          <p className="text-xl font-medium">Absent</p>
          <p className="text-4xl font-bold">2</p>
        </div>
        <div
          onClick={() => navigate('/late-calendar')}
          className="bg-yellow-400 text-white p-6 rounded-lg shadow cursor-pointer hover:scale-105 transition"
        >
          <p className="text-xl font-medium">Late</p>
          <p className="text-4xl font-bold">3</p>
        </div>
      </div>

      {/* Overview Graph Placeholder */}
      <div className="bg-white rounded-lg p-6 shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Attendance Overview</h2>
        <div className="h-32 flex items-center justify-center text-gray-400 border rounded">
          Graph Coming Soon...
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Attendance Record</h2>
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="pb-2">Date</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Check In</th>
              <th className="pb-2">Check Out</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 text-sm">
                <td className="py-2">{item.date}</td>
                <td className="py-2">{item.status}</td>
                <td className="py-2">{item.checkIn}</td>
                <td className="py-2">{item.checkOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
