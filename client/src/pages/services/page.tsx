import { useQuery } from "@tanstack/react-query";

type ServiceType = {
  id: number;
  denomination: string;
  description: string;
};

function ServicesPage() {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["services"],
    queryFn: () =>
      fetch("http://localhost:3000/api/v1/services").then((res) => res.json()),
  });

  return (
    <div>
      <h1 className="font-bold text-2xl mb-10">Services</h1>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error.message} </div>}
      {data?.data && (
        <div className="grid lg:grid-cols-3 gap-4">
          {data.data.map((service: ServiceType) => (
            <div
              key={service.id}
              className="bg-white rounded-md shadow-sm border p-4 flex flex-col space-y-4"
            >
              <h2 className="text-xl font-semibold">{service.denomination}</h2>
              <p className="text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ServicesPage;
