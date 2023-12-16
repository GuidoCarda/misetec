import { SectionTitle } from "@/components/PrivateLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClient } from "@/services/clients";
import { getOrdersByClientId } from "@/services/orders";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function ClientOrders() {
  const navigate = useNavigate();

  const clientQuery = useQuery({
    queryKey: ["client"],
    queryFn: () => getClient("1"),
  });

  const { data, isPending } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrdersByClientId("1"),
  });

  if (isPending || clientQuery.isPending) return <div>Loading...</div>;

  const currentOrder = data.at(-1);

  return (
    <>
      <SectionTitle
        title={`Bienvenido ${clientQuery.data?.firstname} ${clientQuery.data?.lastname}`}
        description="Aca podras ver todas las ordenes a tu nombre"
      />

      <Button
        className="mt-auto"
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/");
        }}
      >
        Cerrar sesion
      </Button>
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
          {data.map((order: Order) => (
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
                  {format(new Date(order.created_at), "yyyy-MM-dd")}
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
