function Header() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Employee Details</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded-lg text-sm"
        />
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="rounded-full"
        />
      </div>
    </div>
  );
}

export default Header;
