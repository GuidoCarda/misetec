import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrder } from "@/services/orders";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
      <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to=".."
            className="group rounded-sm flex text-sm items-center text-slate-400 select-none  hover:text-slate-600 focus-within:outline-slate-100"
          >
            <CaretLeftIcon className="group-hover:-translate-x-1 transition-all duration-200" />
            <span className="">Volver</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            Detalle orden #{orderId}
          </h2>
        </div>
        {isEditable && (
          <Button asChild>
            <Link to={`edit`}> Editar Orden</Link>
          </Button>
        )}
      </header>

      <div className="space-y-2 mb-4">
        <p className="text-zinc-600">
          Creada el:{" "}
          <span className="text-black">
            {format(new Date(data.created_at), "dd 'de' MMMM 'de' yyyy", {
              locale: es,
            })}
          </span>
        </p>

        {data.finished_at && (
          <p className="text-zinc-600">
            Finalizada el:{" "}
            <span className="text-black">
              {format(new Date(data.finished_at), "dd 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
            </span>
          </p>
        )}
        <span className=" block text-zinc-600">
          Estado:
          <Badge className="rounded-md ml-2 h-fit">{data.status}</Badge>
        </span>
        <span className=" block text-zinc-600">
          Tipo servicio:
          <Badge variant={"outline"} className="rounded-md ml-2 h-fit">
            {data.service_type}
          </Badge>
        </span>
      </div>
      <Separator className="mb-6" />

      <div className="space-y-4">
        <Card className="w-full p-4">
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
          <Card className="w-full p-4">
            <h3 className="text-lg font-semibold">Falla del dispositivo</h3>
            <p className="text-zinc-500">{data.device_failure}</p>
          </Card>
        )}

        {Boolean(data.device_id) && (
          <Card>
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

        {Boolean(data.accesories) && (
          <Card className="w-full p-4">
            <h3 className="text-lg font-semibold">Accesorios</h3>
            <p className="text-zinc-500">{data.accesories}</p>
          </Card>
        )}

        {Boolean(data.report) && (
          <Card className="w-full  p-4 ">
            <h3 className="text-lg font-semibold">Informe al cliente</h3>
            <p className="text-zinc-500">{data.report}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsPage;
