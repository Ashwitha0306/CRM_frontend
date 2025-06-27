import React from 'react';

function ProjectsPage() {
  const ongoing = [
    { name: 'CRM System', status: 'Ongoing', team: 'Dev Team A' },
    { name: 'Mobile App', status: 'Ongoing', team: 'UI/UX + Backend' }
  ];

  const completed = [
    { name: 'HR Portal', status: 'Completed', team: 'Full Stack Team' },
    { name: 'Landing Website', status: 'Completed', team: 'Design Team' }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Projects</h1>

      {/* Ongoing */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Ongoing Projects</h2>
        <div className="space-y-4">
          {ongoing.map((proj, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-bold text-gray-700">{proj.name}</h3>
              <p className="text-sm text-gray-500">Team: {proj.team}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h2 className="text-xl font-semibold text-green-700 mb-2">Completed Projects</h2>
        <div className="space-y-4">
          {completed.map((proj, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-lg font-bold text-gray-700">{proj.name}</h3>
              <p className="text-sm text-gray-500">Team: {proj.team}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
