import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client, columns } from "@/pages/clients/clientsColumns";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

function ClientsPage() {
  const [search, setSearch] = useState("");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["clients"],
    queryFn: () =>
      fetch("http://localhost:3000/api/v1/clients").then((res) => res.json()),
    placeholderData: [],
    select: (data) =>
      data.filter(
        (client: Client) =>
          client.firstname.toLowerCase().includes(search.toLowerCase()) ||
          client.lastname.toLowerCase().includes(search.toLowerCase()) ||
          client.email.toLowerCase().includes(search.toLowerCase()) ||
          client.id.toString().includes(search.toLowerCase())
      ),
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data);

  return (
    <>
      <header className="flex justify-between ">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-10">
          Clientes
        </h2>
        <Link to={"new"}>
          <Button>Nuevo Cliente</Button>
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

      <DataTable columns={columns} data={data} />
    </>
  );
}

export default ClientsPage;
