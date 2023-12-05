import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";

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
  const [search, setSearch] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch("http://localhost:3000/api/v1/orders").then((res) => res.json()),
    placeholderData: { data: [] },
    select: (data) => {
      return data.data.filter(
        (order: Order) =>
          order.id.toString().toLowerCase().includes(search.toLowerCase()) ||
          order.description.toLowerCase().includes(search.toLowerCase())
      );
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
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
      <div className="mt-5 mb-4">
        <Label className="mb-2 block">Buscar cliente</Label>
        <Input
          className="w-1/2"
          type="search"
          name="q"
          id="q"
          placeholder="nombre, email, nro cliente"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isError && <div>Error: {error.message}</div>}

      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default Orders;
