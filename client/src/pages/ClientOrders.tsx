import { SectionTitle } from "@/components/PrivateLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

function ClientOrders() {
  const { data, isPending } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  async function getOrders() {
    const res = await fetch("http://localhost:3000/api/v1/orders?user_id=5");
    const data = await res.json();
    return data.data;
  }

  if (isPending) return <div>Loading...</div>;

  const currentOrder = data.at(-1);

  return (
    <>
      <SectionTitle
        title="Bienvenido usuario x"
        description="Aca podras ver todas las ordenes a tu nombre"
      />

      <div>
        <h2 className="text-2xl font-bold mb-4">Ultima orden</h2>
        {currentOrder && (
          <div className="w-full mb-10 border-2 p-4 rounded-md">
            <div className="flex gap-4 mb-4">
              <h3>Orden #{currentOrder.id}</h3>
              <Badge>En espera</Badge>
            </div>
            <h2 className="text-lg font-semibold">Descripcion</h2>
            <p className="text-zinc-500">{currentOrder.description}</p>
          </div>
        )}

        {!currentOrder && (
          <div className="w-full mb-10 border-2 p-4 rounded-md">
            <p>No tienes ordenes pendientes</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mis ordenes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col p-4">
          {data.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b border-gray-200 py-4"
            >
              <div className="flex items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-500">
                    Orden #{order.id}
                  </span>
                  <span className="text-sm text-gray-400">
                    {order.description}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-400">
                  {order.created_at}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default ClientOrders;
