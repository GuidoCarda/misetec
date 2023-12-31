import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Layouts
import PrivateLayout from "@/components/PrivateLayout";
import PublicLayout from "@/components/PublicLayout";

//Pages
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
import OrderDetailsPage from "@/pages/orders/OrderDetails";
import EditOrderPage from "@/pages/orders/EditOrder";
import LoginPage from "@/pages/login/Login";

//Constants
import { ROLES } from "@/constants";
import SettingsPage from "@/pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RequireAuth allowedRoles={[ROLES.STAFF]} />,
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
                element: <OrderDetailsPage />,
              },
              {
                path: ":id/edit",
                element: <EditOrderPage />,
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
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/portal",
    element: <RequireAuth allowedRoles={[ROLES.CLIENT]} />,
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
    path: "/login",
    element: <LoginPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
