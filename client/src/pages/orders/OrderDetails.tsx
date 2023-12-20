import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getOrder } from "@/services/orders";
import { useQuery } from "@tanstack/react-query";
import { ComputerIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId || ""),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const isEditable = data.status_id !== 4 && data.status_id !== 5;

  return (
    <div>
      <header className="flex items-center justify-between">
        <div>
          <Link to="../">Volver</Link>
          <h2 className="text-2xl font-bold mb-4">Orden #{data.id}</h2>
        </div>
        {isEditable && (
          <Button asChild>
            <Link to={`edit`}> Editar Orden</Link>
          </Button>
        )}
      </header>

      <Card className="w-full mb-10  p-4 ">
        <div className="flex gap-4 mb-4">
          <h3>Estado</h3>
          <Badge className="rounded-md">{data.status}</Badge>
        </div>
        <h2 className="text-lg font-semibold mb-2">Descripcion</h2>
        <div className="max-w-[60ch] space-y-1">
          {data.description &&
            data.description
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index} className="text-zinc-500">
                  {paragraph}
                </p>
              ))}
        </div>
      </Card>

      {Boolean(data.device_failure) && (
        <div className="w-full mb-10 border-2 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Falla del dispositivo</h3>
          <p className="text-zinc-500">{data.device_failure}</p>
        </div>
      )}

      {Boolean(data.device_id) && (
        <Card className="">
          <CardHeader>
            <ComputerIcon />
            <h2 className="text-xl font-semibold">Dispositivo</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Equipo</span>
                <p className="text-zinc-500">#{data.device_id}</p>
              </div>

              <div className="flex items-center justify-between">
                <span>Marca</span>
                <p className="text-zinc-500">{data.brand}</p>
              </div>

              <div className="flex items-center justify-between">
                <span>Modelo</span>
                <p className="text-zinc-500">{data.model}</p>
              </div>

              <div className="flex items-center justify-between ">
                <span>Numero de serie</span>
                <p className="text-zinc-500">{data.serial_number}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {Boolean(data.report) && (
        <div className="w-full mb-10 border-2 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Informe al cliente</h3>
          <p className="text-zinc-500">{data.report}</p>
        </div>
      )}
    </div>
  );
}

export default OrderDetailsPage;
