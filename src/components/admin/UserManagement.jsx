import React from 'react';

const UserManagement = () => (
  <div className="bg-white p-6 shadow-md rounded-xl">
    <h3 className="text-lg font-semibold mb-4">User Management</h3>
    <table className="w-full text-left border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-2">John Doe</td>
          <td className="p-2">john@example.com</td>
          <td className="p-2">Admin</td>
          <td className="p-2 space-x-2">
            <button className="text-blue-500">Edit</button>
            <button className="text-red-500">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default UserManagement;