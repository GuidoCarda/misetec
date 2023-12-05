import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Layouts
import PrivateLayout from "@/components/PrivateLayout";
import PublicLayout from "@/components/PublicLayout";

//Pages
import ClientsLoginPage from "@/pages/ClientsLogin";
import StaffLoginPage, { action as staffLoginAction } from "@/pages/StaffLogin";
import ClientOrders from "@/pages/ClientOrders";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/orders/Orders";
import Home from "@/pages/Home";
import RequireAuth from "@/components/RequireAuth";
import ErrorPage from "@/pages/Error";
import NewOrderPage from "@/pages/orders/NewOrder";
import ClientsPage from "@/pages/clients/Clients";
import NewClientPage from "@/pages/clients/NewClient";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      {
        element: <PrivateLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "orders",
            children: [
              {
                index: true,
                element: <Orders />,
              },
              {
                path: "new",
                element: <NewOrderPage />,
              },
              {
                path: ":id",
                element: <div>Detalle orden x</div>,
              },
              {
                path: ":id/edit",
                element: <div>Editar orden x</div>,
              },
            ],
          },
          {
            path: "clients",
            children: [
              {
                index: true,
                element: <ClientsPage />,
              },
              {
                path: "new",
                element: <NewClientPage />,
              },
              { path: ":id", element: <div>Detalle cliente x</div> },
              { path: ":id/edit", element: <div>Editar cliente x</div> },
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
