// src/components/SchedulePanel.js

import React from 'react';

function SchedulePanel() {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-full">
      {/* Title + Plus Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Schedule</h2>
        <button
          onClick={() => alert('Open Add Schedule Modal')}
          className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600"
          title="Add Schedule"
        >
          +
        </button>
      </div>

      {/* Schedule Entries */}
      <div className="space-y-3 text-sm">
        <div className="p-2 bg-orange-100 rounded">
          <p className="font-semibold">10:00 AM</p>
          <p>Team Standup</p>
        </div>
        <div className="p-2 bg-blue-100 rounded">
          <p className="font-semibold">12:30 PM</p>
          <p>UI Review</p>
        </div>
        <div className="p-2 bg-green-100 rounded">
          <p className="font-semibold">03:00 PM</p>
          <p>Client Meeting</p>
        </div>
      </div>
    </div>
  );
}

export default SchedulePanel;
