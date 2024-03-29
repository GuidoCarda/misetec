import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import ConfirmationDialog from "./ConfirmationDialog";
import DataTable from "./ui/data-table";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "./ui/use-toast";
import { deleteClient } from "@/services/clients";
import { MoreHorizontal } from "lucide-react";
import { Client } from "@/types";

function ClientsTable({ data }: { data: Client[] }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDeleteDialog = (client: Client | null) => {
    setClient(client);
    setDeleteDialogOpen((prev) => !prev);
  };

  const columns: ColumnDef<Client>[] = useMemo(
    () => [
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
        header: "Cod. Postal",
        cell: ({ row }) => {
          const postalCode = row.getValue("postal_code") as string;
          return <div>{postalCode}</div>;
        },
      },
      {
        id: "actions",
        cell: (props) => {
          const client = props.row.original;

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
                  <DropdownMenuItem onClick={() => handleDeleteDialog(client)}>
                    Dar de baja
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
    ],
    []
  );

  const deleteClientMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Cliente dado de baja",
        description: "El cliente fue dado de baja correctamente",
      });
    },
  });

  return (
    <>
      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Dar de baja cliente"
        description="Esta seguro que desea dar de baja el cliente?"
        onConfirm={() => {
          if (!client) return;
          deleteClientMutation.mutate(client.id.toString());
          handleDeleteDialog(null);
        }}
        onOpenChange={(isOpen) => {
          if (isOpen === true) return;
          setClient(null);
          setDeleteDialogOpen(false);
        }}
      />
      <DataTable columns={columns} data={data} />
    </>
  );
}

export default ClientsTable;
