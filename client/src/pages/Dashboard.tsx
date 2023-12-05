function Dashboard() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
      <div className="grid lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-md shadow-sm border p-4 flex flex-col space-y-4"
          >
            <h2 className="text-xl font-semibold">Titulo</h2>
            <p className="text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              voluptatum.
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;
