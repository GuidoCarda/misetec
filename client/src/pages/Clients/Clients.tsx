import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from "@/pages/clients/clientsColumns";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import ClientsTable from "@/components/ClientsTable";
import { getClients } from "@/services/clients";
import { PlusIcon } from "@radix-ui/react-icons";

function ClientsPage() {
  const [search, setSearch] = useState("");

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
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

  return (
    <>
      <header className="flex items-center justify-between md:mb-10">
        <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
        <Link to={"new"}>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Nuevo cliente
          </Button>
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
      <ClientsTable data={data} />
    </>
  );
}

export default ClientsPage;
