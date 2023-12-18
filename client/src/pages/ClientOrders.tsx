import { SectionTitle } from "@/components/PrivateLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getClient } from "@/services/clients";
import { getOrdersByClientId } from "@/services/orders";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function ClientOrders() {
  const navigate = useNavigate();
  const { signOut, auth } = useAuth();

  const id = auth?.userId.toString();

  const clientQuery = useQuery({
    queryKey: ["client"],
    queryFn: () => getClient(id!),
  });

  const { data, isPending } = useQuery({
    queryKey: ["client-orders"],
    initialData: [],
    queryFn: () => getOrdersByClientId(id!),
  });

  if (isPending || clientQuery.isPending) return <div>Loading...</div>;

  const clientHasOrders = data.length > 0;
  const currentOrder = clientHasOrders && data.at(0);

  return (
    <>
      <SectionTitle
        title={`Bienvenido/a ${clientQuery.data?.firstname} ${clientQuery.data?.lastname}`}
        description="Aca podras ver todas las ordenes a tu nombre"
      />

      <div>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold ">Ultima orden</h2>
          <Button
            className="mt-auto"
            size={"sm"}
            variant={"secondary"}
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            Cerrar sesion
          </Button>
        </div>
        {currentOrder && (
          <Card className="w-full mb-10 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                Orden{" "}
                <span className="bg-slate-200 ml-1 text-slate-600 font-semibold px-4   text-lg rounded-sm ">
                  {" "}
                  #{currentOrder.id}{" "}
                </span>
              </h3>
              <Badge className="rounded-md h-max">En espera</Badge>
            </div>
            <h2 className="text-lg font-semibold mb-4">Descripcion</h2>
            <div className="text-zinc-500 max-w-[70ch] space-y-2  ">
              {currentOrder.description.split("\n").map((line: string) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Card>
        )}

        {!currentOrder && (
          <div className="w-full mb-10 border-2 p-4 rounded-md">
            <p>No tienes ordenes pendientes</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Historial ordenes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y pt-4">
          {data.map((order: Order) => (
            <div
              key={order.id}
              className="flex items-start justify-between  border-gray-200  py-4"
            >
              <div className="flex flex-col w-1/2">
                <span className="text-sm font-semibold text-gray-800">
                  Orden #{order.id}
                </span>
                <span className="text-sm text-gray-500 ">
                  {order.description}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                {format(new Date(order.created_at), "yyyy-MM-dd")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default ClientOrders;
