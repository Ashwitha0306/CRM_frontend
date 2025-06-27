import React from 'react';

const TaskManager = () => (
  <div className="bg-white p-6 shadow-md rounded-xl">
    <h3 className="text-lg font-semibold mb-4">Task Assignment</h3>
    <form className="space-y-4">
      <input type="text" placeholder="Task Title" className="w-full border p-2 rounded" />
      <textarea placeholder="Description" className="w-full border p-2 rounded"></textarea>
      <input type="date" className="w-full border p-2 rounded" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Assign Task</button>
    </form>
  </div>
);

export default TaskManager;