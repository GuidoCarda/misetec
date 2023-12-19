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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const clientLoginFormSchema = z.object({
  email: z.string().email({
    message: "El email debe ser valido.",
  }),
});

type ClientsLoginFormProps = {
  onSubmit: (values: z.infer<typeof clientLoginFormSchema>) => void;
  isPending: boolean;
};

function ClientsLoginForm({ onSubmit, isPending }: ClientsLoginFormProps) {
  const form = useForm<z.infer<typeof clientLoginFormSchema>>({
    resolver: zodResolver(clientLoginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@email.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isPending}
            className={cn("mt-6 w-full", isPending ? "animate-pulse" : "")}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ingresando...
              </>
            ) : (
              "Ingresar al sistema"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}

export const clientLoginConfirmationFormSchema = z.object({
  otp: z.string().regex(/^\d{4}$/, { message: "Debe contener 4 digitos" }),
});

export function ClientLoginConfirmationForm({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof clientLoginConfirmationFormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof clientLoginConfirmationFormSchema>>({
    resolver: zodResolver(clientLoginConfirmationFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codigo unico</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="xxxx" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-6 w-full" type="submit">
          Ingresar al sistema
        </Button>
      </form>
    </Form>
  );
}

export default ClientsLoginForm;
