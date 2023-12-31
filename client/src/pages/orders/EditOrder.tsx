import { SectionTitle } from "@/components/PrivateLayout";
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
import { SERVICE_TYPES, allowedTransitions } from "@/constants";
import { getOrder, getOrderStatusList, updateOrder } from "@/services/orders";
import { OrderStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["updateOrder", id],
    queryFn: () => getOrder(id || ""),
  });

  const orderMutation = useMutation({
    mutationFn: (values: z.infer<typeof orderEditFormSchema>) =>
      updateOrder(id || "", values),
    onSuccess: () => {
      console.log("Orden actualizada");
      queryClient.invalidateQueries({ queryKey: ["updateOrder", id] });
      navigate("..");
    },
  });

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

  return (
    <div>
      <Link
        to=".."
        className="group rounded-sm flex text-sm items-center text-slate-400 select-none  hover:text-slate-600 focus-within:outline-slate-100"
      >
        <CaretLeftIcon className="group-hover:-translate-x-1 transition-all duration-200" />
        <span className="">Volver</span>
      </Link>
      <SectionTitle
        title="Editar orden"
        description="Actualiza los datos de la orden de servicio seleccionada"
      />

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

        <p className="mb-2">
          <span className="font-semibold">Provincia: </span>
          {orderQuery.data.province}
        </p>
      </div>

      <Separator className={"my-6"} />

      <EditOrderForm
        defaultValues={formDefaultValues}
        serviceTypeId={orderQuery.data.service_type_id}
        onSubmit={onSubmit}
      />
    </div>
  );
}

const orderEditFormSchema = z.object({
  description: z.string().min(1, {
    message: "La descripcion es requerida",
  }),
  accesories: z.string().optional(),
  device_failure: z.string().optional(),
  status_id: z.coerce.number(),
  report: z.string().optional(),
});

type EditOrderFormProps = {
  defaultValues: z.infer<typeof orderEditFormSchema>;
  onSubmit: (values: z.infer<typeof orderEditFormSchema>) => void;
  serviceTypeId: number;
};

export function EditOrderForm({
  defaultValues,
  serviceTypeId,
  onSubmit,
}: EditOrderFormProps) {
  const navigate = useNavigate();
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

  const isAccessoryFieldVisible =
    serviceTypeId === SERVICE_TYPES.REPAIR ||
    serviceTypeId === SERVICE_TYPES.MAINTENANCE;

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
              <FormLabel>Estado</FormLabel>
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

        {isAccessoryFieldVisible && (
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
        )}

        <FormField
          control={form.control}
          name="device_failure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Falla encontrada | Primer analisis</FormLabel>
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
        <div className="flex gap-4 justify-end">
          <Button onClick={() => navigate(-1)} type="button" variant={"ghost"}>
            Cancelar
          </Button>
          <Button type="submit">Actualizar orden</Button>
        </div>
      </form>
    </Form>
  );
}

export default EditOrderPage;
