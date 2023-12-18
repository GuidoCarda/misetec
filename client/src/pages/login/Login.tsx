import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/hooks/useAuth";

import ClientsLoginForm, {
  clientLoginFormSchema,
} from "@/pages/login/ClientsLoginForm";
import StaffLoginForm, { loginFormSchema } from "@/pages/login/StaffLoginForm";

import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { clientLogin, staffLogin } from "@/services/auth";

import { ROLES } from "@/constants";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { auth, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const clientToken = location?.search?.split("?token=")[1];
  console.log(clientToken);

  if (clientToken) {
    const decoded = jwtDecode(clientToken);
    console.log(decoded);
  }

  const staffLoginMutation = useMutation({
    mutationFn: staffLogin,
    onError: (error) => {
      console.log("login error", error);
    },
    onSuccess: (user) => {
      console.log("login success", user);
      signIn(user);
      navigate(from, { replace: true });
    },
  });

  const clientLoginMutation = useMutation({
    mutationFn: clientLogin,
    onError: (error) => {
      console.log("login error", error);
    },
    onSuccess: (user) => {
      console.log("login success", user);
      setIsEmailSent(true);
      // signIn(user);
      // navigate(from, { replace: true });
    },
  });

  if (auth?.token) {
    navigate(from, { replace: true });
  }

  const handleStaffLogin = (values: z.infer<typeof loginFormSchema>) => {
    console.log(values);
    staffLoginMutation.mutate(values);
  };

  const handleClientLogin = (values: z.infer<typeof clientLoginFormSchema>) => {
    console.log(values);
    clientLoginMutation.mutate(values);
  };

  const isLoginError =
    staffLoginMutation.isError || clientLoginMutation.isError;

  if (isEmailSent) {
    return <CheckEmail handleRetry={() => setIsEmailSent(false)} />;
  }

  return (
    <>
      <main className="relative px-4 grid place-items-center min-h-[calc(100vh-4rem)]">
        {isLoginError && (
          <Alert
            variant={"destructive"}
            className="absolute mb-2 top-10 max-w-fit"
          >
            {staffLoginMutation.error?.message ||
              clientLoginMutation.error?.message}
          </Alert>
        )}
        <Card className="min-w-full md:min-w-[500px]">
          <Tabs defaultValue={ROLES.client}>
            <TabsList className="max-w-fit mt-6 ml-6">
              <TabsTrigger value={ROLES.client}>Clientes</TabsTrigger>
              <TabsTrigger value={ROLES.staff}>Personal</TabsTrigger>
            </TabsList>

            <TabsContent value={ROLES.client}>
              <CardHeader>
                <CardTitle className="2xl">Ingresa al sistema</CardTitle>
                <CardDescription>
                  Ingresa tu email para poder consultar las ordenes de servicio
                  a tu nombre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientsLoginForm onSubmit={handleClientLogin} />
              </CardContent>
            </TabsContent>
            <TabsContent value={ROLES.staff}>
              <CardHeader>
                <CardTitle className="text-2xl">Ingresar al sistema</CardTitle>
                <CardDescription>
                  Ingresa tu email y contraseña para continuar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StaffLoginForm onSubmit={handleStaffLogin} />
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
      <footer className="text-black h-16 border-t grid place-items-center">
        Misetec soluciones informaticas
      </footer>
    </>
  );
}

type CheckEmailProps = {
  handleRetry: () => void;
};

function CheckEmail({ handleRetry }: CheckEmailProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Revisa tu email</h1>
      <p className="text-gray-500 text-center mb-10">
        Te enviamos un email con un link para que puedas ingresar al sistema
      </p>
      <Button onClick={handleRetry}>Intentar nuevamente</Button>
    </div>
  );
}

export default LoginPage;
