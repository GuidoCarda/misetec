import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Layouts
import PrivateLayout from "@/components/PrivateLayout";
import PublicLayout from "@/components/PublicLayout";

//Pages
import ClientsLoginPage from "@/pages/ClientsLogin";
import StaffLoginPage from "@/pages/StaffLogin";
import ClientOrders from "@/pages/ClientOrders";
import Dashboard from "@/pages/Dashboard";
import NewClientForm from "@/pages/NewClientForm";
import Orders from "@/pages/Orders";
import Home from "@/pages/Home";
import Clients from "@/pages/Clients/Clients";
import NewOrderForm from "@/pages/NewOrderForm";
import ErrorPage from "@/pages/Error";

const router = createBrowserRouter([
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
        children: [
          {
            path: "new",
            element: <NewClientForm />,
          },
        ],
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/staff-login",
    element: <StaffLoginPage />,
  },
  {
    path: "/clients-login",
    element: <ClientsLoginPage />,
  },
  {
    path: "/portal",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <ClientOrders />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
