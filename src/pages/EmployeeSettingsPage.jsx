import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // ✅ optional: heroicons for success icon

const EmployeeSettingsPage = () => {
  const [profileVisible, setProfileVisible] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    try {
      const payload = {
        profile_visible: profileVisible,
        notifications_enabled: notifications,
        preferred_language: language,
        password: newPassword
      };

      await axios.put('http://localhost:8000/api/employee/settings/', payload);
      setMessage('Settings saved successfully!');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Failed to save settings.');
      setSuccess(false);
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-12 text-gray-800">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-8 space-y-6 relative">
        {/* Profile Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-semibold shadow-inner">
            👤
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold">Employee Settings</h2>

        {/* Profile Visibility */}
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Make Profile Public</label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={profileVisible}
              onChange={() => setProfileVisible(!profileVisible)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full relative transition-all duration-300">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>

        {/* Notifications */}
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Enable Notifications</label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full relative transition-all duration-300">
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>

        {/* Language Preference */}
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
          </select>
        </div>

        {/* Password Update */}
        <div>
          <label className="block text-sm font-medium mb-1">Change Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Save Settings
        </button>

        {/* Message */}
        {message && (
          <div className="text-sm text-center mt-2 text-green-600 flex items-center justify-center space-x-2">
            {success && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSettingsPage;
