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
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { provinces } from "@/constants";
import { createClient } from "@/services/clients";

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
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
        Nuevo Cliente
      </h2>
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
    },
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
            disabled={isPending}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
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
            name="province"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
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
