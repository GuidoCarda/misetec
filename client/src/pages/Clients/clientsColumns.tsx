import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export type Client = {
  id: number;
  firstname: string;
  lastname: string;
  dni: string;
  address: string;
  phone_number: string;
  email: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <div>{id}</div>;
    },
  },
  {
    id: "Nombre",
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
  },
  {
    accessorKey: "phone_number",
    header: "Telefono",
    cell: ({ row }) => {
      const phoneNumber = row.getValue("phone_number") as string;
      return <div>{phoneNumber}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <div>{email}</div>;
    },
  },
  {
    accessorKey: "address",
    header: "Direccion",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return <div>{address}</div>;
    },
  },
  {
    accessorKey: "postal_code",
    header: "Codigo postal",
    cell: ({ row }) => {
      const postalCode = row.getValue("postal_code") as string;
      return <div>{postalCode}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(client.id.toString())
                }
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={`${client.id}/edit`}>Editar datos</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
