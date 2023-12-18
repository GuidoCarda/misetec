import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NewClientForm, newClientFormSchema } from "../clients/NewClient";
import { useState } from "react";
import { Client } from "../clients/clientsColumns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { createClient } from "@/services/clients";
import { createOrder } from "@/services/orders";
import { ServiceType } from "@/types";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { SectionTitle } from "@/components/PrivateLayout";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z
  .object({
    client_id: z.coerce.number(),
    description: z
      .string()
      .min(1, {
        message: "La descripcion es requerida",
      })
      .max(255),
    service_type_id: z.coerce.number(),
    accesories: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    serial_number: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.service_type_id === 1 || data.service_type_id === 2) {
        return data.brand;
      }
      return true;
    },
    {
      message: "La marca es requerida para este tipo de servicio.",
      path: ["brand"],
    }
  )
  .refine(
    (data) => {
      console.log(data);
      if (data.service_type_id === 1 || data.service_type_id === 2) {
        return data.model;
      }
      return true;
    },
    {
      message: "El modelo es requerido para este tipo de servicio.",
      path: ["model"],
    }
  )
  .refine(
    (data) => {
      if (data.service_type_id === 1 || data.service_type_id === 2) {
        return data.serial_number;
      }
      return true;
    },
    {
      message: "El numero de serie es requerido para este tipo de servicio.",
      path: ["serial_number"],
    }
  );

function NewOrderPage() {
  const [client, setClient] = useState<Client>();
  const [search, setSearch] = useState("");
  const { auth } = useAuth();

  const { toast } = useToast();
  const navigate = useNavigate();

  const clientsQuery = useQuery({
    queryKey: ["clients"],
    queryFn: () =>
      fetch("http://localhost:3000/api/v1/clients").then((res) => res.json()),
    placeholderData: [],
    select: (data) =>
      data.filter(
        (client: Client) =>
          client.firstname.toLowerCase().includes(search.toLowerCase()) ||
          client.lastname.toLowerCase().includes(search.toLowerCase()) ||
          client.id.toString().includes(search.toLowerCase())
      ),
  });

  const orderMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => createOrder(values),
    onSuccess: () => {
      console.log("Orden creada");
      navigate("..");
    },
  });

  const clientMutation = useMutation({
    mutationFn: (values: z.infer<typeof newClientFormSchema>) =>
      createClient(values),
    onSuccess: (data) => {
      console.log(data);
      setClient(data);
    },
    onError(error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: error.name,
        description: error.message,
      });
    },
  });

  const discardSelectedClient = () => {
    setClient(undefined);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!client) {
      toast({
        variant: "destructive",
        title: "Cliente requerido",
        description:
          "Debe seleccionar un cliente o cargar uno nuevo para generar la orden",
      });
      return;
    }

    if (values.service_type_id === 1 || values.service_type_id === 2) {
      if (!values.brand || !values.model || !values.serial_number) {
        toast({
          variant: "destructive",
          title: "Datos de equipo requeridos",
          description:
            "Debe completar los datos de equipo para generar la orden",
        });
        return;
      }
    }

    console.log(values);

    const parsedValues = {
      ...values,
      client_id: client.id,
      staff_id: auth?.userId,
    };
    orderMutation.mutate(parsedValues);
  };

  const onSubmitNewClient = (values: z.infer<typeof newClientFormSchema>) => {
    console.log(values);
    clientMutation.mutate(values);
    console.log(clientMutation);
    if (client) {
      console.log(client);
    }
  };

  return (
    <div>
      {/* <header className="mb-10">
        <Link
          to=".."
          className="group rounded-sm flex text-sm items-center text-slate-400 select-none  hover:text-slate-600 focus-within:outline-slate-100"
        >
          <CaretLeftIcon className="group-hover:-translate-x-1 transition-all duration-200" />
          <span className="">Volver</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Nueva Orden</h2>
      </header> */}

      <Link
        to=".."
        className="group rounded-sm flex text-sm items-center text-slate-400 select-none  hover:text-slate-600 focus-within:outline-slate-100"
      >
        <CaretLeftIcon className="group-hover:-translate-x-1 transition-all duration-200" />
        <span className="">Volver</span>
      </Link>
      <SectionTitle
        title="Nueva orden"
        description="Complete los datos requeridos para generar una nueva orden de servicio"
      />

      {!client ? (
        <Tabs defaultValue="search">
          <TabsList>
            <TabsTrigger value="search">Buscar cliente</TabsTrigger>
            <TabsTrigger value="create">Cargar cliente</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <div className="mt-6 mb-4">
              <h2 className="font-bold text-xl leading-tight">
                Buscar cliente
              </h2>
              <p className="text-tremor-content">
                Busca y selecciona un cliente para asignarlo a la orden
              </p>
            </div>
            <Label className="block mb-2">Nombre cliente</Label>
            <Input
              type="search"
              role="search"
              className="mb-4 lg:w-1/2"
              onChange={(e) => setSearch(e.target.value)}
            />
            <ScrollArea className="mb-6 w-full border h-72 rounded-md ">
              <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">
                  Clientes
                </h4>
                {clientsQuery.data?.map((client: Client) => {
                  return (
                    <div
                      key={client.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {client.firstname} {client.lastname}
                        </p>
                        <p className="text-sm text-zinc-400">
                          {client.email} - {client.phone_number}
                        </p>
                      </div>
                      <Button onClick={() => setClient(client)}>
                        Seleccionar
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="create">
            <div className="mt-6 mb-4">
              <h2 className="font-bold text-xl leading-tight">
                Cargar cliente
              </h2>
              <p className="text-tremor-content">
                Carga un nuevo cliente para asignarlo a la orden
              </p>
            </div>
            <NewClientForm
              onSubmit={onSubmitNewClient}
              isPending={clientMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <OrderClientDetails client={client} onClose={discardSelectedClient} />
      )}

      <div className="mt-6 mb-4">
        <h2 className="font-semibold text-lg leading-tight">Detalle Orden</h2>
        <p className="text-tremor-content">
          Complete los datos requeridos para generar una nueva orden de servicio
        </p>
      </div>
      <NewOrderForm onSubmit={onSubmit} />
    </div>
  );
}

type OrderClientDetailsProps = {
  client: Client;
  onClose: () => void;
};

function OrderClientDetails({ client, onClose }: OrderClientDetailsProps) {
  console.log(client);
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detalles del cliente</CardTitle>

        <Button
          size={"sm"}
          onClick={onClose}
          variant={"outline"}
          className="w-fit"
        >
          <User className=" mr-2 h-4 w-4 " />
          Seleccionar otro cliente
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="font-semibold">Nombre:</span>
            <span>
              {client.firstname} {client.lastname}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Telefono:</span>
            <span>{client.phone_number}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">Email:</span>
            <span>{client.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type NewOrderFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

function NewOrderForm({ onSubmit }: NewOrderFormProps) {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["service-types"],
    queryFn: () =>
      fetch("http://localhost:3000/api/v1/services").then((res) => res.json()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      service_type_id: 1,
      client_id: 1,
    },
  });

  console.log(form.formState.errors);

  const selectedServiceType = form.watch("service_type_id", undefined);

  console.log(selectedServiceType);

  const showDeviceFieldsAndAccesories =
    Number(selectedServiceType) === 1 || Number(selectedServiceType) === 2;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="service_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de servicio</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data?.data.map(({ id, denomination }: ServiceType) => {
                    return (
                      <SelectItem
                        key={denomination.split(" ").join("")}
                        value={id.toString()}
                      >
                        {denomination}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <Textarea placeholder="Descripcion del problema" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        {showDeviceFieldsAndAccesories && (
          <div className="mt-6 grid gap-4">
            <div>
              <h2 className="text-lg font-semibold">Datos equipo</h2>
              <p className="text-zinc-400">
                Los datos del equipo son opcionales, pero son utiles para
                identificar el equipo.
              </p>
            </div>
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero de serie</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accesories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accesorios</FormLabel>
                  <Textarea
                    placeholder="Accesorios que dejo el cliente"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex gap-4 justify-end">
          <Button onClick={() => navigate(-1)} type="button" variant={"ghost"}>
            Cancelar
          </Button>
          <Button type="submit">Cargar orden</Button>
        </div>
      </form>
    </Form>
  );
}

export default NewOrderPage;
