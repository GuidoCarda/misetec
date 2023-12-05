import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

type Order = {
  id: string;
  description: string;
  client_id: number;
  created_at: string;
  updated_at: string;
  staff_id: string;
  status_id: string;
};

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Codigo",
  },
  {
    accessorKey: "description",
    header: "Descripcion",
  },
  {
    accessorKey: "status_id",
    header: "Estado",
  },
  {
    accessorKey: "service_type_id",
    header: "Tipo de servicio",
    cell: ({ row }) => {
      const serviceType = row.getValue("service_type_id") as string;
      return <div>{serviceType ?? "-"}</div>;
    },
  },
];

function Orders() {
  const [clients, setClients] = useState<Order[]>([]);
  const location = useLocation();

  // TODO: Check if this is the best way to do this, maybe use a custom hook?
  const lastPathnameSlug = location.pathname.split("/").slice(-1)[0];

  const alreadyFetched = useRef(false);

  useEffect(() => {
    if (alreadyFetched.current) return;

    fetch("http://localhost:3000/api/v1/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    })
      .then((res) => res.json())
      .then((data) => setClients(data.results));

    return () => {
      alreadyFetched.current = true;
    };
  }, []);

  if (lastPathnameSlug === "new") {
    return <Outlet />;
  }

  return (
    <div className="w-full">
      <header className="flex justify-between">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
          Ordenes
        </h2>
        <Link to={"new"}>
          <Button>Nueva orden</Button>
        </Link>
      </header>
      <DataTable columns={columns} data={clients} />
    </div>
  );
}

export default Orders;
