import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
  UserPlus,
  ArrowUpRight,
  XCircle,
  Shield,
  ChevronRight,
  Calendar,
  Clock,
  Activity,
  Filter,
  Loader2
} from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState(null);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/activity-logs/');
      
      if (response.data && Array.isArray(response.data)) {
        setLogs(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setLogs(response.data.results);
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('Unexpected data format from server');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to load activity logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const getEventDetails = (action) => {
    const event = (action || '').toUpperCase().trim();

    const styles = {
      CREATE: { 
        description: 'created a new', 
        icon: <UserPlus className="text-green-500 dark:text-green-400" size={18} />,
        color: 'bg-green-100 dark:bg-green-900/30'
      },
      UPDATE: { 
        description: 'updated a', 
        icon: <ArrowUpRight className="text-blue-500 dark:text-blue-400" size={18} />,
        color: 'bg-blue-100 dark:bg-blue-900/30'
      },
      DELETE: { 
        description: 'deleted a', 
        icon: <XCircle className="text-red-500 dark:text-red-400" size={18} />,
        color: 'bg-red-100 dark:bg-red-900/30'
      },
      LOGIN: { 
        description: 'logged in', 
        icon: <Shield className="text-green-500 dark:text-green-400" size={18} />,
        color: 'bg-green-100 dark:bg-green-900/30'
      },
      LOGOUT: { 
        description: 'logged out', 
        icon: <Shield className="text-red-500 dark:text-red-400" size={18} />,
        color: 'bg-red-100 dark:bg-red-900/30'
      }
    };

    return styles[event] || {
      description: 'performed an action',
      icon: <Activity className="text-gray-500 dark:text-gray-400" size={18} />,
      color: 'bg-gray-100 dark:bg-gray-800'
    };
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => (log.action || '').toUpperCase() === filter);

  const eventTypes = [
    { value: 'ALL', label: 'All Activities', icon: <Activity size={16} /> },
    { value: 'CREATE', label: 'Creations', icon: <UserPlus size={16} /> },
    { value: 'UPDATE', label: 'Updates', icon: <ArrowUpRight size={16} /> },
    { value: 'DELETE', label: 'Deletions', icon: <XCircle size={16} /> },
    { value: 'LOGIN', label: 'Logins', icon: <Shield size={16} /> },
    { value: 'LOGOUT', label: 'Logouts', icon: <Shield size={16} /> }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-1 dark:text-white">
          <Activity className="text-indigo-600 dark:text-indigo-400" size={24} />
          Activity Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Track all user activities and system changes</p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md mb-4 border-l-4 border-red-500 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 dark:shadow-gray-800/30">
        <h2 className="font-medium flex items-center gap-2 mb-3 dark:text-white">
          <Filter size={18} />
          Filter Activities
        </h2>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                filter === value 
                  ? 'bg-indigo-600 dark:bg-indigo-700 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-200'
              } transition-colors`}
            >
              {React.cloneElement(icon, {
                className: filter === value ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              })}
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const { description, icon, color } = getEventDetails(log.action);
            const timestamp = new Date(log.timestamp);
            const userName = log.user || log.employee_first_name || 'System';

            return (
              <div 
                key={log.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border hover:shadow-md transition dark:border-gray-700 dark:hover:shadow-gray-800/30"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${color}`}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="dark:text-gray-200">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">{userName}</span>{' '}
                        {description} {log.model_name || 'record'}{' '}
                        {log.description && (
                          <span className="text-gray-500 dark:text-gray-400">({log.description})</span>
                        )}
                      </p>
                      <ChevronRight className="text-gray-400 dark:text-gray-500" size={18} />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{timestamp.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {log.object_id && (
                        <div className="flex items-center gap-1">
                          <span>ID: {log.object_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center dark:shadow-gray-800/30">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Activity className="text-gray-400 dark:text-gray-500" size={24} />
          </div>
          <h3 className="text-lg font-medium mb-1 dark:text-white">No activities found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'ALL'
              ? 'There are no activity logs available.'
              : `No activities match the "${eventTypes.find(t => t.value === filter)?.label}" filter.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityLogs;