import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

//form handling and validation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ActionFunctionArgs,
  redirect,
  useActionData,
  useNavigation,
  // useLocation,
  // useNavigate,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "El email debe ser valido.",
  }),
  password: z.string().min(4, {
    message: "La contraseña debe tener al menos 4 caracteres.",
  }),
});

function StaffLoginPage() {
  const errorMessage = useActionData() as string;
  // const navigate = useNavigate();
  const navigation = useNavigation();
  // const location = useLocation();
  const submit = useSubmit();
  // const from = location.state?.from?.pathname || "/";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    submit(values, { method: "POST", action: "/staff-login" });
  };

  return (
    <>
      <main className="px-4 grid place-items-center min-h-[calc(100vh-4rem)]">
        <Card className="min-w-full md:min-w-[400px]">
          <CardHeader>
            {errorMessage && (
              <Alert variant={"destructive"} className="mb-2">
                {errorMessage}
              </Alert>
            )}
            <CardTitle className="text-2xl">Ingresar al sistema</CardTitle>
            <CardDescription>
              Ingresa tu email y contraseña para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="grid gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="test@gmail.com" {...field} />
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
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={navigation.state === "submitting"}
                  className="w-full mt-4"
                  type="submit"
                >
                  {navigation.state === "submitting"
                    ? "Enviando..."
                    : "Iniciar Sesión"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <footer className="text-black h-16 border-t grid place-items-center">
        Misetec soluciones informaticas
      </footer>
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 400) {
      return "Credeniales invalidas";
    }

    const data = await res.json();

    window.localStorage.setItem("token", data.token);
    return redirect("/");
  } catch (error) {
    return error;
  }
}

export default StaffLoginPage;
