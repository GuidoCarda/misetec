import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient, getProvinces } from "@/services/clients";
import { SectionTitle } from "@/components/PrivateLayout";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { Province } from "@/types";

export const newClientFormSchema = z.object({
  firstname: z.string().min(2, {
    message: "El name debe tener al menos 2 caracteres.",
  }),
  lastname: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  address: z.string().min(2, {
    message: "La direccion debe tener al menos 2 caracteres.",
  }),
  phone_number: z
    .string()
    .min(6, { message: "Debe contener al menos 6 digitos" })
    .regex(/^\d{6,10}$/, { message: "Debe contener maximo 10 digitos" }),
  postal_code: z
    .string()
    .min(1, { message: "El codigo postal es requerido" })
    .regex(/^\d{1,4}$/, { message: "Debe contener maximo 4 digitos" }),
  email: z.string().email({
    message: "El email debe ser valido.",
  }),
  province_id: z.coerce.number({
    required_error: "Debe seleccionar una provincia.",
  }),
});

function NewClientPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof newClientFormSchema>) =>
      createClient(values),
    onSuccess: () => {
      console.log("Cliente creado");
      navigate("..");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function onSubmit(values: z.infer<typeof newClientFormSchema>) {
    mutation.mutate(values);
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
        title="Nuevo Cliente"
        description="Carga los datos del cliente para hacer seguimiento de sus ordenes de servicio"
      />
      {mutation.isError && (
        <Alert className="mb-4" variant={"destructive"}>
          {mutation.error.message}
        </Alert>
      )}
      <NewClientForm onSubmit={onSubmit} isPending={mutation.isPending} />
    </>
  );
}

type NewClientFormProps = {
  onSubmit: (values: z.infer<typeof newClientFormSchema>) => void;
  isPending: boolean;
};

export function NewClientForm({ onSubmit, isPending }: NewClientFormProps) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof newClientFormSchema>>({
    resolver: zodResolver(newClientFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      address: "",
      phone_number: "",
      postal_code: "",
      email: "",
      province_id: 1,
    },
  });

  const provincesQuery = useQuery({
    queryKey: ["provinces"],
    queryFn: () => getProvinces(),
  });

  if (provincesQuery.isError) {
    return <p>Hubo un error</p>;
  }

  if (provincesQuery.isPending) {
    return <p>Cargando...</p>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8  w-full"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ejemplo@hotmail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            disabled={isPending}
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
            name="province_id"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field?.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {provincesQuery.data.map((province: Province) => (
                        <SelectItem
                          key={province.id}
                          value={province.id.toString()}
                        >
                          {province.denomination}
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
            disabled={isPending}
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
            disabled={isPending}
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
          <Button type="submit" disabled={isPending}>
            Cargar cliente
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default NewClientPage;
