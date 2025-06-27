import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', hours: 6 },
  { name: 'Tue', hours: 7 },
  { name: 'Wed', hours: 5 },
  { name: 'Thu', hours: 8 },
  { name: 'Fri', hours: 4 },
];

function WorkloadChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Workload Overview</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WorkloadChart;
