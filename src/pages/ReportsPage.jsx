import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ReportsPage = () => {
  const [headcountData, setHeadcountData] = useState({});
  const [attritionData, setAttritionData] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [reportType, setReportType] = useState('headcount');

  // Fetch analytics and certificate data from Django API
  useEffect(() => {
    axios.get('http://localhost:8000/api/analytics/headcount/').then(res => {
      setHeadcountData({
        labels: res.data.labels,
        datasets: [{
          label: 'Employees',
          data: res.data.values,
          backgroundColor: '#3b82f6',
        }]
      });
    });

    axios.get('http://localhost:8000/api/analytics/attrition/').then(res => {
      setAttritionData({
        labels: res.data.labels,
        datasets: [{
          label: 'Attrition Rate (%)',
          data: res.data.values,
          backgroundColor: ['#f87171', '#fb923c', '#facc15', '#34d399', '#60a5fa'],
        }]
      });
    });

    axios.get('http://localhost:8000/api/certificates/expiring/').then(res => {
      setCertificates(res.data);
    });
  }, []);

  const handleExport = (type) => {
    // Example placeholder: hit endpoint to trigger export
    axios.get(`http://localhost:8000/api/reports/export/?type=${type}`, {
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-800">
      <h2 className="text-3xl font-bold mb-6">Analytics & Reports</h2>

      {/* 1. HR Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Headcount by Department</h3>
          <Bar data={headcountData} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Monthly Attrition Rate</h3>
          <Pie data={attritionData} />
        </div>
      </div>

      {/* 2. Certificate Expiry Tracker */}
      <div className="bg-white p-4 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Expiring Certificates</h3>
        <table className="w-full text-sm table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Certificate</th>
              <th className="px-4 py-2 text-left">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length > 0 ? (
              certificates.map(cert => (
                <tr key={cert.id} className="border-t">
                  <td className="px-4 py-2">{cert.employee_name}</td>
                  <td className="px-4 py-2">{cert.name}</td>
                  <td className="px-4 py-2">{cert.expiry_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  No expiring certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Report Builder */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Custom Report Builder</h3>
        <div className="flex space-x-4 items-center">
          <select
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="headcount">Headcount</option>
            <option value="attrition">Attrition</option>
            <option value="certificates">Certificates</option>
          </select>
          <button
            onClick={() => handleExport('pdf')}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
