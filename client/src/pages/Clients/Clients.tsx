import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client, columns } from "@/pages/Clients/columns";
import { useEffect } from "react";
import {
  Form,
  Link,
  LoaderFunctionArgs,
  Outlet,
  useLoaderData,
  useLocation,
  useSubmit,
} from "react-router-dom";

function Clients() {
  const { clients, q } = useLoaderData() as { clients: Client[]; q: string };
  const location = useLocation();
  const submit = useSubmit();

  useEffect(() => {
    const inputElement = document.getElementById("q") as HTMLInputElement;
    inputElement.value = q;
  }, [q]);

  const lastPathnameSlug = location.pathname.split("/").slice(-1)[0];

  if (lastPathnameSlug === "new") {
    return <Outlet />;
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
            defaultValue={q}
            onChange={(e) => submit(e.currentTarget.form)}
          />
        </Form>
      </div>

      <DataTable columns={columns} data={clients} />
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  console.log(url.searchParams.get("q"));
  const q = url.searchParams.get("q") ?? "";

  try {
    const res = await fetch("http://localhost:3000/api/v1/clients");
    const data = await res.json();

    const clients = data.filter((client: Client) => {
      return (
        client.firstname.toLowerCase().includes(q.toLowerCase()) ||
        client.email.toLowerCase().includes(q.toLowerCase()) ||
        client.phone_number.toLowerCase().includes(q.toLowerCase())
      );
    });

    return { clients, q };
  } catch (error) {
    console.error(error);
  }
}

export default Clients;
