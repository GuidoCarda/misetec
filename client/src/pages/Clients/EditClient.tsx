import { Alert } from "@/components/ui/alert";
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
import { provinces } from "@/constants";
import { getClient, updateClient } from "@/services/clients";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Client } from "./clientsColumns";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { SectionTitle } from "@/components/PrivateLayout";

function EditClientPage() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery<Client>({
    queryKey: ["client", params.id],
    queryFn: () => getClient(params.id as string),
    retry: false,
  });

  const updateClientMutation = useMutation({
    mutationFn: (values: z.infer<typeof editClientFormSchema>) =>
      updateClient(params.id as string, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", params.id] });
      navigate(-1);
    },
  });

  const onSubmit = (values: z.infer<typeof editClientFormSchema>) => {
    console.log(values);
    updateClientMutation.mutate(values);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <Alert
        variant={"destructive"}
        className="mb-6 flex items-center justify-between"
      >
        {error?.message}
        <div>
          <Link to={".."}>
            <Button
              variant={"ghost"}
              className="hover:bg-red-50 hover:text-red-600"
            >
              Volver al inicio
            </Button>
          </Link>
        </div>
      </Alert>
    );
  }

  if (!data) {
    return <Navigate to={"..."} />;
  }

  return (
    <>
      <Link
        to=".."
        className="group rounded-sm flex text-sm items-center text-slate-400 select-none  hover:text-slate-600 focus-within:outline-slate-100"
      >
        <CaretLeftIcon className="group-hover:-translate-x-1 transition-all duration-200" />
        <span className="">Volver</span>
      </Link>
      <SectionTitle
        title="Editar cliente"
        description="Modificá los datos del cliente para tener su informacion actualizada"
      />
      {updateClientMutation.isError && (
        <Alert
          variant={"destructive"}
          className="mb-6 flex items-center justify-between"
        >
          {updateClientMutation.error.message}
          <div>
            <Link to={".."}>
              <Button
                variant={"ghost"}
                className="hover:bg-red-50 hover:text-red-600"
              >
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Alert>
      )}
      <EditClientForm onSubmit={onSubmit} client={data} />
    </>
  );
}

export default EditClientPage;

const editClientFormSchema = z.object({
  firstname: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastname: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  address: z.string().min(2, {
    message: "La direccion debe tener al menos 2 caracteres.",
  }),
  phone_number: z.string().min(2, {
    message: "El telefono debe tener al menos 2 caracteres.",
  }),
  postal_code: z.string().min(2, {
    message: "El codigo postal debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "El email debe ser valido.",
  }),
  province: z.string({
    required_error: "Debe seleccionar una provincia.",
  }),
});

type EditClientProps = {
  onSubmit: (values: z.infer<typeof editClientFormSchema>) => void;
  client: Client;
};

export function EditClientForm({ onSubmit, client }: EditClientProps) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof editClientFormSchema>>({
    resolver: zodResolver(editClientFormSchema),
    defaultValues: client,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  w-full"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nro telefono</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direccion</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo postal</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 justify-end">
          <Button onClick={() => navigate(-1)} type="button" variant={"ghost"}>
            Cancelar
          </Button>
          <Button type="submit">Actualizar cliente</Button>
        </div>
      </form>
    </Form>
  );
}
