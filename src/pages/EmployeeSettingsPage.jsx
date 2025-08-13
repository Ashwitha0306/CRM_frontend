import React, { useState, useContext } from 'react';
import { CheckCircleIcon, XCircleIcon, MoonIcon, SunIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '../components/ThemeContext';
import axiosInstance from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeSettingsPage = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const employeeId = localStorage.getItem('employeeId');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
    setPreviewUrl('');
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

const handleSave = async () => {
  try {
    setLoading(true);
    let passwordChanged = false;

    if (oldPassword && newPassword) {
      await axiosInstance.post('employees/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      
      toast.success('Password changed successfully! Please login again.', {
        autoClose: 3000,
      });
      
      passwordChanged = true;
    }

    if (avatar) {
      const formData = new FormData();
      formData.append('profile_picture', avatar);

      if (!employeeId) {
        toast.error('Employee ID not found. Please login again.', {
          autoClose: 3000,
        });
        return;
      }

      await axiosInstance.patch(
        `/employees/employees/${employeeId}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      toast.success('Profile picture updated!', {
        autoClose: 3000,
      });
    }

    // Logout if password was changed
    if (passwordChanged) {
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/employees/login';
      }, 3000);
    }

  } catch (err) {
    console.error(err);
    
    const errorMessage = 
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.response?.data?.detail ||
      'Failed to save changes.';
    
    toast.error(errorMessage, {
      autoClose: 5000,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-300">
         {/* Add ToastContainer here */}
    <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={darkMode ? "dark" : "light"}
    />
     <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 w-full"></div>
        
        <div className="p-10 space-y-8">
          <div className="text-center relative">
            <button
              onClick={handleThemeToggle}
              className="absolute top-0 right-0 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Employee Settings</h2>
            <p className="text-base text-gray-600 dark:text-gray-400">Manage your preferences and profile</p>
          </div>

          <div className="flex flex-col items-center">
            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Avatar"
                  className="h-24 w-24 rounded-full object-cover border-2 border-blue-500 shadow"
                />
                <button
                  onClick={handleDeleteAvatar}
                  className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-red-600 hover:text-white transition"
                  title="Remove Avatar"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 bg-blue-100 dark:bg-blue-300 text-blue-600 rounded-full flex items-center justify-center text-3xl font-semibold shadow-inner">
                👤
              </div>
            )}
            <label className="mt-4 text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:underline">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-3">
              Change Password
            </h3>
            
            <div>
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-5 py-4 text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-5 py-4 text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full py-4 px-6 text-lg rounded-lg font-medium text-white transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>

        
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettingsPage;