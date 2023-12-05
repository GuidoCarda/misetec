import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Layouts
import PrivateLayout from "@/components/PrivateLayout";
import PublicLayout from "@/components/PublicLayout";

//Pages
import StaffLoginPage from "@/pages/login/Login";
import ClientOrders from "@/pages/ClientOrders";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/orders/Orders";
import Home from "@/pages/Home";
import RequireAuth from "@/components/RequireAuth";
import ErrorPage from "@/pages/Error";
import NewOrderPage from "@/pages/orders/NewOrder";
import NewClientPage from "@/pages/clients/NewClient";
import ClientsPage from "@/pages/clients/Clients";
import EditClientPage from "@/pages/clients/EditClient";

export const ROLES = {
  staff: "staff",
  client: "client",
} as const;

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth allowedRoles={[ROLES.staff]} />,
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
              { path: ":id/edit", element: <EditClientPage /> },
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
    path: "/portal",
    // element: <RequireAuth allowedRoles={[ROLES.client]} />,
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
  {
    path: "/unauthorized",
    element: <div>Unauthorized</div>,
  },
  {
    path: "/login",
    element: <StaffLoginPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
