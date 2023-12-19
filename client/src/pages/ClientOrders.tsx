import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { getClient } from "@/services/clients";
import { getOrder, getOrdersByClientId } from "@/services/orders";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, LogOut, PlusIcon, TextSelect } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientOrders() {
  const [orderSheet, setOrderSheet] = useState<number | null>(null);

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

  // console.log(clientQuery.data);
  console.log(data);

  if (isPending || clientQuery.isPending) return <div>Loading...</div>;

  const clientHasOrders = data.length > 0;
  const currentOrder = clientHasOrders && data.at(0);

  console.log(data.find((order: Order) => order.status_id === 3) || data.at(0));

  const handleOrderSheet = (order: Order) => {
    setOrderSheet(order.id);
  };

  return (
    <>
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">
            {`Bienvenido/a ${clientQuery.data?.firstname} ${clientQuery.data?.lastname}`}
          </h2>
          <p className="text-muted-foreground text-slate-400">
            Aca podras ver todas las ordenes a tu nombre
          </p>
        </div>
        <Button
          className="mt-4 md:mt-0"
          size={"sm"}
          variant={"secondary"}
          onClick={() => {
            signOut();
            navigate("/");
          }}
        >
          Cerrar sesion
          <LogOut className="w-4 h-4 ml-2" />
        </Button>
      </header>
      <Separator className="my-6" />
      <div>
        {currentOrder && (
          <div className="w-full mb-10 ">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                Ultima orden
                <span className="bg-slate-200 ml-2 text-slate-600 font-semibold px-4  text-lg rounded-sm ">
                  {" "}
                  #{currentOrder.id}{" "}
                </span>
              </h3>
              <Badge className="rounded-md h-max">En espera</Badge>
            </div>
            <h2 className="text-lg font-semibold leading-none mb-2">
              Descripcion
            </h2>
            <div className="text-zinc-500 max-w-[70ch] space-y-2  ">
              {currentOrder.description.split("\n").map((line: string) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {currentOrder.report && (
              <>
                <h2 className="text-lg font-semibold leading-none mt-6 mb-2">
                  Informe
                </h2>
                <div className="text-zinc-500 max-w-[70ch] space-y-2  ">
                  {currentOrder.report.split("\n").map((line: string) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </>
            )}
            <Button
              className="mt-4"
              size={"sm"}
              variant={"secondary"}
              onClick={() => handleOrderSheet(currentOrder)}
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Ver más
            </Button>
          </div>
        )}

        {!currentOrder && (
          <Card className="w-full h-60 grid place-content-center mb-10">
            <TextSelect className="h-20 w-20 text-black mx-auto mb-4" />
            <p className="text-slate-500">
              No tienes ordenes pendientes a tu nombre
            </p>
          </Card>
        )}
      </div>
      {data.length ? (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Historial ordenes</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y pt-4">
            {data.map((order: Order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between  border-gray-200  py-4"
              >
                <div className="flex flex-col md:w-1/2">
                  <span className="text-sm font-semibold text-gray-800">
                    Orden #{order.id} - {order?.service_type}
                  </span>
                  <span className=" mt-1 line-clamp-2 overflow-hidden text-ellipsis text-sm text-gray-600  ">
                    {order.description}
                  </span>
                </div>
                <Badge className="rounded-md h-max w-fit hidden md:block">
                  {order.status}
                </Badge>

                <span className="flex gap-1 text-sm text-gray-500 mt-4 md:mt-0">
                  <span className="">Creada el</span>
                  <span className="hidden md:block">
                    {format(new Date(order.created_at), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </span>
                  <span className="md:hidden">
                    {format(
                      new Date(order.created_at),
                      "dd 'de' MMMM 'de' yyyy",
                      {
                        locale: es,
                      }
                    )}
                  </span>
                </span>
                <Button
                  className="mt-4 md:mt-0"
                  size={"sm"}
                  variant={"secondary"}
                  onClick={() => handleOrderSheet(order)}
                >
                  Ver detalles
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full h-96 grid place-content-center">
          <TextSelect className="h-20 w-20 text-black mx-auto mb-4" />
          <p className="text-slate-500">No tienes ordenes a tu nombre</p>
        </Card>
      )}
      <OrderDetailSheet
        isOpen={orderSheet !== null}
        onOpenChange={(isOpen) => {
          if (isOpen === true) return;
          setOrderSheet(null);
        }}
        orderId={orderSheet}
      />
    </>
  );
}

type OrderDetailSheetProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  orderId: number | null;
};

function OrderDetailSheet({
  isOpen,
  onOpenChange,
  orderId,
}: OrderDetailSheetProps) {
  const { data, isPending, isRefetching } = useQuery({
    queryKey: ["client-order-detail", orderId],
    queryFn: () => getOrder(orderId?.toString() || ""),
    enabled: !!orderId,
  });

  console.log({ data, isPending, isRefetching });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] items-start">
        <SheetHeader>
          {isPending && (
            <>
              <div className="flex gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="animate-pulse">Cargando</span>
              </div>
            </>
          )}
          {isRefetching && (
            <div className="flex gap-2 items-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="animate-pulse block heading-none">
                Actualizando
              </span>
            </div>
          )}
          {!isPending && (
            <div className="flex flex-col   justify-between mt-4">
              <header className="space-y-2 mb-4">
                <h2 className="text-2xl mb-2 font-semibold text-gray-800">
                  Orden #{data.id}
                </h2>
                <p className="text-zinc-600">
                  Creada el:{" "}
                  <span className="text-black">
                    {format(
                      new Date(data.created_at),
                      "dd 'de' MMMM 'de' yyyy",
                      {
                        locale: es,
                      }
                    )}
                  </span>
                </p>

                {data.finished_at && (
                  <p className="text-zinc-600">
                    Finalizada el:{" "}
                    <span className="text-black">
                      {format(
                        new Date(data.finished_at),
                        "dd 'de' MMMM 'de' yyyy",
                        {
                          locale: es,
                        }
                      )}
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
              </header>
              <Separator />

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-1 leading-none">
                  Descripcion
                </h3>
                <p className="max-w-[60ch] text-gray-500 ">
                  {data.description}
                </p>
              </div>
              {data.report && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-1 leading-none">
                    Informe
                  </h3>
                  <p className="max-w-[60ch] text-gray-500">{data.report}</p>
                </div>
              )}
            </div>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default ClientOrders;
