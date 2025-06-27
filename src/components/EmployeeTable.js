function EmployeeTable() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Employee Timesheet</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th>Date</th>
            <th>Employee</th>
            <th>Task</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-50">
            <td>Oct 10</td>
            <td>John Doe</td>
            <td>UI Design</td>
            <td>6h</td>
            <td className="text-green-500">Completed</td>
          </tr>
          <tr className="border-t hover:bg-gray-50">
            <td>Oct 11</td>
            <td>Jane Smith</td>
            <td>API Integration</td>
            <td>5h</td>
            <td className="text-yellow-500">In Progress</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
