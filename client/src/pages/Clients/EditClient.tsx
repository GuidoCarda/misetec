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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

function EditClientPage() {
  const params = useParams();
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ["clients", params.id],
    queryFn: () =>
      fetch(`http://localhost:3000/api/v1/clients/${params.id}`).then((res) =>
        res.json()
      ),
  });

  const updateClientMutation = useMutation({
    mutationFn: (values: z.infer<typeof editClientFormSchema>) =>
      updateClient(values),
    onSuccess: () => {
      navigate(-1);
    },
  });

  async function updateClient(values: z.infer<typeof editClientFormSchema>) {
    const res = await fetch(
      `http://localhost:3000/api/v1/clients/${params.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    if (res.status !== 200) {
      throw new Error("Error al actualizar cliente");
    }

    const data = await res.json();
    return data;
  }

  const onSubmit = (values: z.infer<typeof editClientFormSchema>) => {
    console.log(values);
    updateClientMutation.mutate(values);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
        Editar Cliente
      </h2>
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
});

type EditClientProps = {
  onSubmit: (values: z.infer<typeof editClientFormSchema>) => void;
  client: Record<string, unknown>;
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