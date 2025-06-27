import React from 'react';

const EmployeeCard = ({ employee, onView, onEdit }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{employee.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {employee.designation_name} – {employee.department_name}
      </p>
      <p className="text-sm text-gray-500 mt-1">{employee.contact}</p>
      <div className="mt-4 space-x-3">
        <button
          onClick={() => onView(employee.id)}
          className="text-blue-600 hover:underline"
        >
          View
        </button>
        <button
          onClick={() => onEdit(employee.id)}
          className="text-green-600 hover:underline"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
