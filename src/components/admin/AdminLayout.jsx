import React, { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { Outlet } from 'react-router-dom';
import useTheme from '../../hooks/useTheme'; // Import your useTheme hook

const AdminLayout = () => {
  const { theme } = useTheme(); // Get the current theme

  // Apply theme class to the root element
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      <AdminSidebar />
      
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;