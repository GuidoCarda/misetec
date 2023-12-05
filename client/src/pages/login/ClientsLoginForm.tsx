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
import { useForm } from "react-hook-form";
import { z } from "zod";

export const clientLoginFormSchema = z.object({
  email: z.string().email({
    message: "El email debe ser valido.",
  }),
});

type ClientsLoginFormProps = {
  onSubmit: (values: z.infer<typeof clientLoginFormSchema>) => void;
};

function ClientsLoginForm({ onSubmit }: ClientsLoginFormProps) {
  const form = useForm<z.infer<typeof clientLoginFormSchema>>({
    resolver: zodResolver(clientLoginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="email@email.com" />
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
