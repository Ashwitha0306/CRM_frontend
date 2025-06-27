import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-white p-4 shadow-md min-h-screen">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4 text-gray-700">
        <li>
          <Link to="/dashboard" className="hover:text-blue-600">Home</Link>
        </li>
        <li>
          <Link to="/employees" className="hover:text-blue-600">Employees</Link>
        </li>
        <li>
          <Link to="/projects" className="hover:text-blue-600">Projects</Link>
        </li>
        <li>
          <Link to="/attendance" className="hover:text-blue-600">Attendance</Link>
        </li>
        <li>
          <Link to="/reports" className="hover:text-blue-600">Reports</Link>
        </li>
        <li>
          <Link to="/settings" className="hover:text-blue-600">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
