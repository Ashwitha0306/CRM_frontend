import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FiHome,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiMessageSquare,
  FiUsers,
  FiFileText
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
const popupVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};
// Reusable Popup Components
const ConfirmationPopup = ({ message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={popupVariants}
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
  >
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-xl max-w-sm w-full text-gray-800 dark:text-gray-100">
      <h3 className="text-xl font-semibold mb-4">{message}</h3>
      <div className="flex justify-center gap-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition"
        >
          {cancelText}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
        >
          {confirmText}
        </motion.button>
      </div>
    </div>
  </motion.div>
);


const StatusPopup = ({ message, status = 'success' }) => {
  const statusColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-2xl w-[300px]">
        <h3 className={`text-2xl font-bold ${statusColors[status]} mb-2`}>{message}</h3>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = memo(({ path, icon, text, isActive, isOpen }) => {
  const baseClasses = `flex items-center gap-3 py-3 px-4 rounded-lg transition whitespace-nowrap ${
    isActive 
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' 
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
  } ${isOpen ? 'min-w-[180px]' : 'justify-center w-12'}`;

  return (
    <Link to={path} className={baseClasses} title={text} aria-label={text}>
      {React.createElement(icon, { 
        size: isOpen ? 20 : 22,
        'aria-hidden': true,
        className: isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
      })}
      {isOpen && <span className="ml-1 font-medium">{text}</span>}
    </Link>
  );
});

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState({ show: false, message: '', status: 'success' });

  const location = useLocation();
  const navigate = useNavigate();
  const employeeId = localStorage.getItem('employeeId');

  // Toggle handlers
  const toggleSidebar = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const toggleMobileSidebar = useCallback(() => setIsMobileOpen(!isMobileOpen), [isMobileOpen]);

  // Show login success popup once
  useEffect(() => {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      setShowStatusPopup({ show: true, message: 'Login Successful!', status: 'success' });
      localStorage.removeItem('loginSuccess');
      setTimeout(() => setShowStatusPopup(s => ({ ...s, show: false })), 2000);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('employeeId');
    setShowLogoutConfirm(false);
    setShowStatusPopup({ show: true, message: 'Logout Successful', status: 'success' });
    setTimeout(() => {
      setShowStatusPopup(s => ({ ...s, show: false }));
      navigate('/employees/login');
    }, 1500);
  }, [navigate]);

 const navItems = [
    { path: employeeId ? `/employees/employees/${employeeId}` : '/employees/login', 
      icon: FiHome, 
      text: 'Home',
      id: 'home' },
    { path: employeeId ? `/employees/profile/${employeeId}` : '/employees/login', 
      icon: FiUser, 
      text: 'Profile',
      id: 'profile' },
    { path: '/projects', icon: FiBriefcase, text: 'Tasks', id: 'tasks' },
    { path: '/attendance', icon: FiCalendar, text: 'Attendance', id: 'attendance' },
    { path: '/leave', icon: FiCalendar, text: 'Leave', id: 'leave' },
    { path: '/settings', icon: FiSettings, text: 'Settings', id: 'settings' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 p-2 rounded-md focus:outline-none md:hidden z-50 shadow-md"
        aria-label="Toggle sidebar"
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? (
          <FiX size={24} aria-hidden="true" />
        ) : (
          <FiMenu size={24} aria-hidden="true" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ease-in-out z-50
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
        md:translate-x-0 md:relative ${isOpen ? 'md:w-64' : 'md:w-20'}`}
        aria-label="Main navigation"
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header with Toggle */}
          <div className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 ${isOpen ? 'px-6' : 'px-3'}`}>
            {isOpen && (
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 pl-5">
                <span className="text-blue-600 dark:text-blue-400">Live</span>Presence
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? (
                <FiX size={20} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <FiMenu size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                path={item.path}
                icon={item.icon}
                text={item.text}
                isActive={location.pathname === item.path}
                isOpen={isOpen}
              />
            ))}
          </nav>

          {/* Bottom Section - Logout */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex items-center gap-3 w-full py-2 px-3 rounded-lg transition text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                isOpen ? '' : 'justify-center'
              }`}
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut size={isOpen ? 20 : 22} className="text-gray-600 dark:text-gray-300" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <ConfirmationPopup
          message="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
          confirmText="Logout"
        />
      )}

      {/* Status Popup */}
      {showStatusPopup.show && (
        <StatusPopup
          message={showStatusPopup.message}
          status={showStatusPopup.status}
        />
      )}
    </>
  );
};

// PropTypes
ConfirmationPopup.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

StatusPopup.propTypes = {
  message: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['success', 'error', 'info']),
};

NavItem.propTypes = {
  path: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;