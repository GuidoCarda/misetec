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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createStaffAccount, getStaffMembers } from "@/services/staff";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

function SettingsPage() {
  const staffQuery = useQuery({
    queryKey: ["staffMembers"],
    queryFn: getStaffMembers,
  });

  return (
    <>
      <SectionTitle
        title="Configuraciones"
        description="Crea una cuenta de tecnicos para poder acceder a la aplicacion"
      />
      <div className="grid gap-2 lg:grid-cols-2 lg:gap-10">
        <NewStaffUserForm />
        <StaffMembersList members={staffQuery.data} />
      </div>
    </>
  );
}

const newStaffUserFormSchema = z.object({
  firstname: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastname: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "El email debe ser valido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
});

function NewStaffUserForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newStaffUserFormSchema>>({
    resolver: zodResolver(newStaffUserFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  const userMutation = useMutation({
    mutationFn: (values: z.infer<typeof newStaffUserFormSchema>) =>
      createStaffAccount(values),
    onSuccess: (data) => {
      console.log(data);
      form.reset();
      toast({
        title: "Cuenta creada",
        description: "La cuenta fue creada correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof newStaffUserFormSchema>) => {
    console.log(values);
    userMutation.mutate(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4 ">
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
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <footer className="flex mt-10">
            <Button
              disabled={userMutation.isPending}
              type="submit"
              className="ml-auto"
            >
              {userMutation.isPending ? "Creando..." : "Crear"}
            </Button>
          </footer>
        </form>
      </Form>
    </>
  );
}

function StaffMembersList({ members }: { members: Record<string, string>[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Tecnicos</h2>
      <ul className="flex flex-col gap-2">
        {members?.map((member) => (
          <li
            key={member.id}
            className="flex flex-col gap-2 border p-4 rounded-md"
          >
            <span className="block leading-none">
              {member.firstname} {member.lastname}
            </span>

            <span className="text-sm text-slate-500">{member.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SettingsPage;
