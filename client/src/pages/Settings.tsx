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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { deleteStaffMember } from "@/services/auth";
import { createStaffAccount, getStaffMembers } from "@/services/staff";
import { StaffMember } from "@/types";
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

function StaffMembersList({ members }: { members: StaffMember[] | undefined }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffMembers"] });
      toast({
        title: "Cuenta eliminada",
        description: "La cuenta fue eliminada correctamente",
      });
    },
    onError: () => {},
  });

  if (!members) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Tecnicos</h2>
      <ScrollArea className="w-full h-72 border rounded-md">
        <ul className="flex flex-col gap-2 py-2 pl-2 pr-4">
          {members?.map((member) => (
            <li
              key={member.id}
              className="flex justify-between gap-2 border p-4 rounded-md"
            >
              <div>
                <span className="block leading-none">
                  {member.firstname} {member.lastname}
                </span>

                <span className="text-sm text-slate-500">{member.email}</span>
              </div>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => mutation.mutate(String(member.id))}
              >
                Eliminar
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

export default SettingsPage;
