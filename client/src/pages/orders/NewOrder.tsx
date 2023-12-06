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

const formSchema = z.object({
  description: z.string().min(2, {
    message: "La descripcion debe tener al menos 2 caracteres.",
  }),
  service_type_id: z.coerce.number(),
  accesories: z.string().optional(),
  brand: z.string().optional(),
  client_id: z.coerce.number(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
});

function NewOrderPage() {
  const [client, setClient] = useState<Client>();
  const [search, setSearch] = useState("");
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
    mutationFn: (values: z.infer<typeof formSchema>) => newOrder(values),
  });

  const clientMutation = useMutation({
    mutationFn: (values: z.infer<typeof newClientFormSchema>) =>
      newClient(values),
    onSuccess: (data) => {
      setClient(data);
    },
  });

  const newOrder = async function (values: z.infer<typeof formSchema>) {
    console.log(values);
    const res = await fetch("http://localhost:3000/api/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      navigate("..");
    }
  };

  const newClient = async function (
    values: z.infer<typeof newClientFormSchema>
  ) {
    // console.log(values);
    const res = await fetch("http://localhost:3000/api/v1/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      throw new Error("Error al crear cliente");
    }

    const data = await res.json();
    console.log(data);
    return data.data;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!client) return;
    console.log(values);

    const parsedValues = {
      ...values,
      client_id: client.id,
      staff_id: 1,
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
      <header className="relative">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
          Nueva orden
        </h2>
        <Link
          to=".."
          className="absolute flex -top-5 text-sm items-center text-zinc-400 hover:text-zinc-800 transition-colors"
        >
          Volver
        </Link>
      </header>

      {!client ? (
        <Tabs defaultValue="search">
          <TabsList>
            <TabsTrigger value="search">Buscar cliente</TabsTrigger>
            <TabsTrigger value="create">Cargar cliente</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <div className="mt-6 mb-4">
              <h2 className="font-bold text-xl">Buscar cliente</h2>
              <p className="text-tremor-content">
                Busca y selecciona un cliente para asignarlo a la orden
              </p>
            </div>
            <Label>Nombre cliente</Label>
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
              <h2 className="font-bold text-xl">Cargar cliente</h2>
              <p className="text-tremor-content">
                Carga un nuevo cliente para asignarlo a la orden
              </p>
            </div>
            <NewClientForm onSubmit={onSubmitNewClient} />
          </TabsContent>
        </Tabs>
      ) : (
        <OrderClientDetails client={client} />
      )}

      <NewOrderForm onSubmit={onSubmit} />
    </div>
  );
}

type OrderClientDetailsProps = {
  client: Client;
};

function OrderClientDetails({ client }: OrderClientDetailsProps) {
  console.log(client);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del cliente</CardTitle>
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

type ServiceType = {
  id: number;
  denomination: string;
  description: string;
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

  const selectedServiceType = form.watch("service_type_id", undefined);

  const showDeviceFieldsAndAccesories =
    selectedServiceType === 1 || selectedServiceType === 2;

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
                  <Input placeholder="" {...field} />
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
                  <Input placeholder="" {...field} />
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
                  <Input placeholder="" {...field} />
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
