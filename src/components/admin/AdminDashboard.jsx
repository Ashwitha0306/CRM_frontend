import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import DashboardHome from './DashboardHome';
import UserManagement from './UserManagement';
import TaskManager from './TaskManager';
import RoleEditor from './RoleEditor';

export default function AdminDashboard() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader username="Master Admin" />
        <main className="p-4 space-y-6">
          <DashboardHome />
          <UserManagement />
          <RoleEditor />
          <TaskManager />
        </main>
      </div>
    </div>
  );
}