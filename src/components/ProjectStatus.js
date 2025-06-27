function ProjectStatus() {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-4">Projects Tracked</h2>
      <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center text-2xl font-bold">
        03
      </div>
      <p className="mt-2 text-gray-600">Active Projects</p>
    </div>
  );
}

export default ProjectStatus;
