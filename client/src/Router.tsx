import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PrivateLayout from "./components/PrivateLayout";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import PublicLayout from "./components/PublicLayout";
import ClientOrders from "./pages/ClientOrders";
import NewClient from "./pages/NewClient";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "clients",
        element: <Clients />,
        children: [
          {
            path: "new",
            element: <NewClient />,
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
