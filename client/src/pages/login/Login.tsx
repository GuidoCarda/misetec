import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientsLoginForm, {
  ClientLoginConfirmationForm,
  clientLoginConfirmationFormSchema,
  clientLoginFormSchema,
} from "@/pages/login/ClientsLoginForm";
import StaffLoginForm, { loginFormSchema } from "@/pages/login/StaffLoginForm";

import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import {
  clientLogin,
  clientLoginConfirmation,
  staffLogin,
} from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

import { ROLES } from "@/constants";

function LoginPage() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { auth, signIn } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const staffLoginMutation = useMutation({
    mutationFn: staffLogin,
    onError: (error) => {
      console.log("login error", error);

      handleShowLoginError();
    },
    onSuccess: (user) => {
      console.log("login success", user);
      signIn(user);
      navigate("/orders", { replace: true });
    },
  });

  const clientLoginMutation = useMutation({
    mutationFn: clientLogin,
    onError: (error) => {
      console.log("login error", error);

      handleShowLoginError();
    },
    onSuccess: () => {
      setIsEmailSent(true);
    },
  });

  const clientLoginConfirmationMutation = useMutation({
    mutationFn: clientLoginConfirmation,
    onError: (error) => {
      console.log("login error", error);
      handleShowLoginError();
    },
    onSuccess: (user) => {
      console.log("login success", user);
      signIn(user);
      navigate(from, { replace: true });
    },
  });

  if (auth?.token) {
    navigate(from, { replace: true });
  }

  const handleStaffLogin = (values: z.infer<typeof loginFormSchema>) => {
    setShowAlert(false);
    console.log(values);
    staffLoginMutation.mutate(values);
  };

  const handleClientLogin = (values: z.infer<typeof clientLoginFormSchema>) => {
    setShowAlert(false);
    console.log(values);
    clientLoginMutation.mutate(values);
  };

  const handleClientLoginCofirmation = (
    values: z.infer<typeof clientLoginConfirmationFormSchema>
  ) => {
    setShowAlert(false);
    console.log(values);
    clientLoginConfirmationMutation.mutate(values);
  };

  const handleShowLoginError = () => {
    if (showAlert) return;

    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
      <main className="relative px-4 grid place-items-center min-h-[calc(100vh-4rem)]">
        {showAlert && (
          <Alert
            variant={"destructive"}
            className="absolute mb-2 top-10 max-w-fit"
          >
            {staffLoginMutation.error?.message ||
              clientLoginMutation.error?.message ||
              clientLoginConfirmationMutation.error?.message}
          </Alert>
        )}
        <Card className="min-w-full md:min-w-[500px]">
          <Tabs defaultValue={ROLES.CLIENT}>
            <TabsList className="max-w-fit mt-6 ml-6">
              <TabsTrigger value={ROLES.CLIENT}>Clientes</TabsTrigger>
              <TabsTrigger value={ROLES.STAFF}>Personal</TabsTrigger>
            </TabsList>

            <TabsContent value={ROLES.CLIENT}>
              <CardHeader>
                <CardTitle className="2xl">Ingresa al sistema</CardTitle>
                <CardDescription>
                  {isEmailSent
                    ? "Ingresa el codigo de confirmacion que te enviamos a tu email"
                    : `Ingresa tu email para poder consultar las ordenes de servicio
                a tu nombre`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEmailSent ? (
                  <ClientLoginConfirmationForm
                    onSubmit={handleClientLoginCofirmation}
                  />
                ) : (
                  <ClientsLoginForm
                    onSubmit={handleClientLogin}
                    isPending={clientLoginMutation.isPending}
                  />
                )}
              </CardContent>
            </TabsContent>
            <TabsContent value={ROLES.STAFF}>
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

export default LoginPage;
