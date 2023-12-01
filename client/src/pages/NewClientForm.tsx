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

const formSchema = z.object({
  firstname: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastname: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  dni: z.string().length(8, {
    message: "El DNI debe tener 8 caracteres.",
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

function NewClientForm() {
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      dni: "",
      address: "",
      phone_number: "",
      postal_code: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    fetch("http://localhost:3000/api/v1/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
        Nuevo Cliente
      </h2>
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
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nro Documento</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
            <Button
              onClick={() => navigate(-1)}
              type="button"
              variant={"ghost"}
            >
              Cancelar
            </Button>
            <Button type="submit">Cargar</Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default NewClientForm;
