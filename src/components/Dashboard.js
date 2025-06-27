// src/components/Dashboard.js

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import EmployeeTable from './EmployeeTable';
import WorkloadChart from './WorkloadChart';
import ProjectStatus from './ProjectStatus';
import SchedulePanel from './SchedulePanel';
import EmployeeProfileCard from './EmployeeProfileCard'; // ✅ Import the profile card

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6">
        {/* Header at the top */}
        <Header />

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Left Section: Profile + Table + Charts */}
          <div className="lg:col-span-2 space-y-4">
            <EmployeeProfileCard /> {/* ✅ New profile card */}
            <EmployeeTable />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WorkloadChart />
              <ProjectStatus />
            </div>
          </div>

          {/* Right Section: Schedule Panel */}
          <div>
            <SchedulePanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
