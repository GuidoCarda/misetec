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

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  description: z.string().min(2, {
    message: "La descripcion debe tener al menos 2 caracteres.",
  }),
  service_type_id: z.string(),
  accesories: z.string().optional(),
});

function NewOrderForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      service_type_id: "",
      accesories: "",
    },
  });

  const watch = form.watch("service_type_id", "");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("submit");
    console.log(values);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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

          <FormField
            control={form.control}
            name="service_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Light</SelectItem>
                    <SelectItem value="2">Dark</SelectItem>
                    <SelectItem value="3">System</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {watch === "2" && (
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
          )}

          <Button type="submit">Crear orden</Button>
        </form>
      </Form>
    </div>
  );
}

export default NewOrderForm;
