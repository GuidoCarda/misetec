import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { columns } from "@/pages/clients/clientsColumns";
import { useQuery } from "@tanstack/react-query";
import { Form, Link, useLocation } from "react-router-dom";

function ClientsPage() {
  const {
    isPending,
    isError,
    data: clients,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () =>
      fetch("http://localhost:3000/api/v1/clients").then((res) => res.json()),
  });

  const location = useLocation();
  console.log(location);

  console.log(clients);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

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
        <Form id="search-form" role="search">
          <Label className="mb-2 block">Buscar cliente</Label>
          <Input
            className="w-1/2"
            type="search"
            name="q"
            id="q"
            placeholder="nombre, email, nro cliente"
          />
        </Form>
      </div>

      <DataTable columns={columns} data={clients} />
    </>
  );
}

export default ClientsPage;
