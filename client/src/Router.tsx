import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Layouts
import PrivateLayout from "@/components/PrivateLayout";
import PublicLayout from "@/components/PublicLayout";

//Pages
import ClientsLoginPage from "@/pages/ClientsLogin";
import StaffLoginPage, { action as staffLoginAction } from "@/pages/StaffLogin";
import ClientOrders from "@/pages/ClientOrders";
import Dashboard from "@/pages/Dashboard";
import NewClientForm, {
  action as newClientFormAction,
} from "@/pages/NewClientForm";
import Orders from "@/pages/Orders";
import Home from "@/pages/Home";
import Clients, { loader as clientsLoader } from "@/pages/Clients/Clients";
import NewOrderForm from "@/pages/NewOrderForm";
import ErrorPage from "@/pages/Error";
import RequireAuth from "@/components/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <PrivateLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "orders",
            element: <Orders />,
            children: [{ path: "new", element: <NewOrderForm /> }],
          },
          {
            path: "clients",
            element: <Clients />,
            loader: clientsLoader,
            children: [
              {
                path: "new",
                element: <NewClientForm />,
                action: newClientFormAction,
              },
            ],
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "/staff-login",
    element: <StaffLoginPage />,
    action: staffLoginAction,
  },
  {
    path: "/clients-login",
    element: <ClientsLoginPage />,
  },
  {
    path: "/portal",
    element: <RequireAuth />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <ClientOrders />,
          },
        ],
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
