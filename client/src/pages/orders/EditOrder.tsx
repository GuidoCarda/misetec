import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { allowedTransitions } from "@/constants";
import { getOrderStatusList } from "@/services/orders";
import { OrderStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log(id);

  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["updateOrder", id],
    queryFn: () =>
      fetch(`http://localhost:3000/api/v1/orders/${id}`).then((res) =>
        res.json()
      ),
  });

  const orderMutation = useMutation({
    mutationFn: (values: z.infer<typeof orderEditFormSchema>) =>
      updateOrder(values),
    onSuccess: () => {
      console.log("Orden actualizada");
      queryClient.invalidateQueries({ queryKey: ["updateOrder", id] });
      navigate("..");
    },
  });

  async function updateOrder(values: z.infer<typeof orderEditFormSchema>) {
    const res = await fetch(`http://localhost:3000/api/v1/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (res.status !== 200) {
      throw new Error("Error al actualizar la orden");
    }
    const data = await res.json();
    return data;
  }

  const onSubmit = (values: z.infer<typeof orderEditFormSchema>) => {
    console.log(values);
    orderMutation.mutate(values);
  };

  if (orderQuery.isPending) {
    return <p>Cargando...</p>;
  }

  if (orderQuery.isError) {
    return <p>Hubo un error</p>;
  }

  const formDefaultValues: z.infer<typeof orderEditFormSchema> = {
    description: orderQuery?.data?.description ?? "",
    device_failure: orderQuery?.data?.device_failure ?? "",
    status_id: orderQuery?.data?.status_id,
    accesories: orderQuery?.data?.accesories ?? "",
    report: orderQuery?.data?.report ?? "",
  };

  console.log(orderQuery.data);

  return (
    <div>
      <Link to="../">Volver</Link>
      <h2 className="text-2xl font-bold mb-4">Editar Orden #{id}</h2>
      <div>
        <h3 className="text-xl font-bold mb-4">Datos del cliente</h3>
        <p className="mb-2">
          <span className="font-semibold">Nombre: </span>
          {orderQuery.data.firstname} {orderQuery.data.lastname}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email: </span>
          {orderQuery.data.email}
        </p>
      </div>
      {/* Datos orden */}
      <Separator className={"my-6"} />
      <EditOrderForm defaultValues={formDefaultValues} onSubmit={onSubmit} />
    </div>
  );
}

const orderEditFormSchema = z.object({
  description: z.string().min(2, {
    message: "La descripcion debe tener al menos 10 caracteres",
  }),
  accesories: z.string().optional(),
  device_failure: z.string().optional(),
  status_id: z.coerce.number(),
  report: z.string().optional(),
});

type EditOrderFormProps = {
  defaultValues: z.infer<typeof orderEditFormSchema>;
  onSubmit: (values: z.infer<typeof orderEditFormSchema>) => void;
};

export function EditOrderForm({ defaultValues, onSubmit }: EditOrderFormProps) {
  const form = useForm<z.infer<typeof orderEditFormSchema>>({
    resolver: zodResolver(orderEditFormSchema),
    defaultValues,
  });

  const orderStatusQuery = useQuery<OrderStatus[]>({
    queryKey: ["orderStatusList"],
    queryFn: getOrderStatusList,
  });

  if (orderStatusQuery.isPending) {
    return <p>Cargando...</p>;
  }

  if (orderStatusQuery.isError) {
    return <p>Hubo un error</p>;
  }

  const allowedStatusList = orderStatusQuery.data.filter(
    (status: OrderStatus) =>
      allowedTransitions[defaultValues.status_id].includes(
        status.id.toString()
      ) || status.id === defaultValues.status_id
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripcion</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status_id"
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
                  {allowedStatusList.map(
                    ({ id, denomination }: OrderStatus) => {
                      return (
                        <SelectItem
                          key={denomination.split(" ").join("")}
                          value={id.toString()}
                        >
                          {denomination}
                        </SelectItem>
                      );
                    }
                  )}
                </SelectContent>
              </Select>
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
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="device_failure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Falla encontrada</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="report"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informe</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex justify-end mt-4">
          <Button type="submit">Actualizar orden</Button>
        </footer>
      </form>
    </Form>
  );
}

export default EditOrderPage;
