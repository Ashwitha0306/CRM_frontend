import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, CalendarDays, Clock, CheckCircle, XCircle, Loader2, Download, PlaneTakeoff } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import dayjs from 'dayjs';
import useTheme from '../../hooks/useTheme';

const DashboardPanel = () => {
  const { theme } = useTheme();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [employeeCount, setEmployeeCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setTokenError(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [attendanceRes, employeesRes] = await Promise.all([
          axiosInstance.get('employees/attendance/'),
          axiosInstance.get('employees/employees/')
        ]);
        
        setAttendance(attendanceRes.data || []);
        setEmployeeCount(employeesRes.data?.length || 0);
        setLastUpdated(new Date());

        // Process weekly data
        const now = dayjs();
        const past7Days = Array.from({ length: 7 }).map((_, i) =>
          now.subtract(6 - i, 'day').format('YYYY-MM-DD')
        );

        const summary = past7Days.map(date => {
          const present = attendanceRes.data.filter(
            a => a.check_in && dayjs(a.check_in).format('YYYY-MM-DD') === date
          ).length;

          const absent = employeesRes.data?.length - present;

          return {
            day: dayjs(date).format('ddd'),
            date: dayjs(date).format('MMM D'),
            Present: present,
            Absent: absent >= 0 ? absent : 0,
            total: employeesRes.data?.length || 0
          };
        });

        setWeeklyData(summary);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportToExcel = async () => {
    setExporting(true);
    try {
      const today = dayjs().format('YYYY-MM-DD');
      const todayRecords = attendance.filter(record => 
        record.check_in && dayjs(record.check_in).format('YYYY-MM-DD') === today
      );

      const sheetData = todayRecords.map(record => ({
        'Employee Name': record.employee_name || 'N/A',
        'Employee ID': record.employee || 'N/A',
        'Check-In': record.check_in ? dayjs(record.check_in).format('YYYY-MM-DD HH:mm') : '-',
        'Check-Out': record.check_out ? dayjs(record.check_out).format('YYYY-MM-DD HH:mm') : '-',
        'Status': record.check_out ? 'Checked Out' : record.check_in ? 'Present' : 'Absent',
        'Duration (minutes)': record.check_out 
          ? dayjs(record.check_out).diff(dayjs(record.check_in), 'minutes')
          : '-'
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Today\'s Attendance');
      
      // Add weekly summary sheet
      const weeklySummary = weeklyData.map(day => ({
        'Date': day.date,
        'Day': day.day,
        'Present': day.Present,
        'Absent': day.Absent,
        'Total Employees': day.total,
        'Attendance Rate': `${Math.round((day.Present / day.total) * 100)}%`
      }));
      const summarySheet = XLSX.utils.json_to_sheet(weeklySummary);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Weekly Summary');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const fileBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(fileBlob, `Attendance_Report_${dayjs().format('YYYY-MM-DD')}.xlsx`);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (record) => {
    if (record.check_out) {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          theme === 'dark' 
            ? 'bg-blue-900/50 text-blue-200 border-blue-800' 
            : 'bg-blue-100 text-blue-800 border-blue-200'
        }`}>
          <PlaneTakeoff className="mr-1 h-3 w-3" />
          Checked Out
        </span>
      );
    } else if (record.check_in) {
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
          theme === 'dark' 
            ? 'bg-green-900/50 text-green-200 border-green-800' 
            : 'bg-green-100 text-green-800 border-green-200'
        }`}>
          <CheckCircle className="mr-1 h-3 w-3" />
          Present
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
        theme === 'dark' 
          ? 'bg-red-900/50 text-red-200 border-red-800' 
          : 'bg-red-100 text-red-800 border-red-200'
      }`}>
        <XCircle className="mr-1 h-3 w-3" />
        Absent
      </span>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dayData = weeklyData.find(d => d.day === label);
      return (
        <div className={`p-4 rounded-lg border shadow-md ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{dayData?.date}</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Present: {payload[0].value}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Absent: {payload[1].value}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm">
                <span className="font-medium">Total: </span>
                {dayData?.total} employees
              </p>
              <p className="text-sm">
                <span className="font-medium">Attendance Rate: </span>
                {Math.round((payload[0].value / dayData?.total) * 100)}%
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (tokenError) {
    return (
      <div className={`flex items-center justify-center min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-md w-full p-8 rounded-xl shadow-lg text-center transition-all hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <div className="text-indigo-600 dark:text-indigo-400 text-6xl mb-6">🔒</div>
          <h2 className="text-2xl font-bold mb-3">Authentication Required</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Your session has expired or you need to log in to access this dashboard
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const today = dayjs().format('YYYY-MM-DD');
  const todayAttendance = attendance.filter(
    record => record.check_in && dayjs(record.check_in).format('YYYY-MM-DD') === today
  );

  const presentCount = todayAttendance.filter(r => r.check_in).length;
  const checkedOutCount = todayAttendance.filter(r => r.check_out).length;
  const absentCount = employeeCount - presentCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`space-y-8 p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Employee Attendance Dashboard</h1>
          <p className={`mt-1 flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            <CalendarDays className="h-4 w-4" />
            {dayjs().format('dddd, MMMM D, YYYY')}
          </p>
        </div>
        <div className={`flex items-center gap-3 text-sm px-4 py-2 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-gray-800 text-gray-300 border-gray-700' 
            : 'bg-gray-50 text-gray-500 border-gray-200'
        }`}>
          <Clock className="h-4 w-4" />
          <span>Last updated: {dayjs(lastUpdated).format('h:mm A')}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2 }}
          className={`flex items-center gap-4 p-6 rounded-xl shadow-sm ${
            theme === 'dark' ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition-all duration-300 hover:shadow-md`}
        >
          <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
            <User className="opacity-90" />
          </div>
          <div>
            <p className="text-2xl font-bold">{employeeCount}</p>
            <p className="text-sm opacity-90">Total Employees</p>
          </div>
        </motion.div>

        {/* Present Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2 }}
          className={`flex items-center gap-4 p-6 rounded-xl shadow-sm ${
            theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
          } text-white transition-all duration-300 hover:shadow-md`}
        >
          <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
            <CheckCircle className="opacity-90" />
          </div>
          <div>
            <p className="text-2xl font-bold">{presentCount}</p>
            <p className="text-sm opacity-90">Present Today</p>
          </div>
        </motion.div>

        {/* Checked Out Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -2 }}
          className={`flex items-center gap-4 p-6 rounded-xl shadow-sm ${
            theme === 'dark' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-amber-500 hover:bg-amber-600'
          } text-white transition-all duration-300 hover:shadow-md`}
        >
          <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
            <PlaneTakeoff className="opacity-90" />
          </div>
          <div>
            <p className="text-2xl font-bold">{checkedOutCount}</p>
            <p className="text-sm opacity-90">Checked Out Today</p>
          </div>
        </motion.div>

        {/* Absent Today */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -2 }}
          className={`flex items-center gap-4 p-6 rounded-xl shadow-sm ${
            theme === 'dark' ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'
          } text-white transition-all duration-300 hover:shadow-md`}
        >
          <div className="p-3 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
            <XCircle className="opacity-90" />
          </div>
          <div>
            <p className="text-2xl font-bold">{absentCount >= 0 ? absentCount : 0}</p>
            <p className="text-sm opacity-90">Absent Today</p>
          </div>
        </motion.div>
      </div>

      {/* Weekly Attendance Chart */}
      <motion.div 
        className={`p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-6">
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Weekly Attendance Overview
          </h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            Employee presence trends over the past 7 days
          </p>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={4}
              barCategoryGap={16}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
              <XAxis 
                dataKey="day" 
                tick={{ fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: theme === 'dark' ? '#d1d5db' : '#6b7280' }}
                axisLine={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }}
                tickLine={false}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{
                  fill: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {value}
                  </span>
                )}
              />
              <Bar 
                dataKey="Present" 
                name="Present" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                dataKey="Absent" 
                name="Absent" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Today's Attendance Table */}
      <motion.div 
        className={`p-6 rounded-xl shadow-sm border transition-all hover:shadow-md ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Today's Attendance</h2>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
              Showing {todayAttendance.length} check-ins for {dayjs().format('MMMM D, YYYY')}
            </p>
          </div>
          <button
            onClick={exportToExcel}
            disabled={exporting || todayAttendance.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              exporting || todayAttendance.length === 0
                ? theme === 'dark'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export to Excel
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : todayAttendance.length === 0 ? (
          <div className={`text-center py-12 border-2 border-dashed rounded-lg ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`mx-auto h-16 w-16 mb-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <CalendarDays className="h-full w-full" />
            </div>
            <h3 className={`text-lg font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>No check-ins recorded today</h3>
            <p className={`mt-1 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>Check back later or verify your attendance system</p>
          </div>
        ) : (
          <div className={`overflow-x-auto rounded-lg border shadow-xs ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <table className="min-w-full divide-y">
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>Employee</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>Check-In</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>Check-Out</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' 
                  ? 'divide-gray-700 bg-gray-800' 
                  : 'divide-gray-200 bg-white'
              }`}>
                {todayAttendance.map((record, index) => (
                  <tr 
                    key={index} 
                    className={`transition-colors duration-150 ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700/50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border ${
                          theme === 'dark' 
                            ? 'bg-indigo-900/50 border-indigo-800' 
                            : 'bg-indigo-100 border-indigo-200'
                        }`}>
                          <span className={theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}>
                            {record.employee_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                            {record.employee_name || 'N/A'}
                          </div>
                          <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
                            ID: {record.employee}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {record.check_in ? (
                        <span className="inline-flex items-center">
                          <Clock className="mr-1 h-3 w-3 opacity-70" />
                          {dayjs(record.check_in).format('h:mm A')}
                        </span>
                      ) : '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {record.check_out ? (
                        <span className="inline-flex items-center">
                          <PlaneTakeoff className="mr-1 h-3 w-3 opacity-70" />
                          {dayjs(record.check_out).format('h:mm A')}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardPanel;