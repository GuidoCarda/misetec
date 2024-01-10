import { UpdateOrderStatus } from "@/pages/orders/Orders";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import TooltipWrapper from "./TooltipWrapper";
import { Badge } from "./ui/badge";
import { MoreHorizontal } from "lucide-react";
import DataTable from "./ui/data-table";
import ConfirmationDialog from "./ConfirmationDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "@/services/orders";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ORDER_STATUS } from "@/constants";
import { toast } from "@/components/ui/use-toast";
import { OrderWithClientDetails } from "@/types";

function OrdersTable({ data }: { data: OrderWithClientDetails[] }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleDeleteDialog = (orderId: string | null) => {
    setOrderId(orderId);
    setDeleteDialogOpen((prev) => !prev);
  };

  const columns: ColumnDef<OrderWithClientDetails>[] = [
    {
      accessorKey: "id",
      header: "Codigo",
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <div className="text-center">{id}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Creada el",
      cell: ({ row }) => {
        const createdAt = row.getValue("created_at") as string;
        const formattedDate = format(new Date(createdAt), "dd/MM/yyyy", {
          locale: es,
        });

        return <div>{formattedDate}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Descripcion",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        const serviceType = row.original.service_type;

        return (
          <div className="w-[350px]">
            {serviceType && (
              <TooltipWrapper tooltipContent={serviceType}>
                <Badge className="rounded-md" variant={"outline"}>
                  {serviceType.split(" ").at(0)}
                </Badge>
              </TooltipWrapper>
            )}
            <p className="mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {description}
            </p>
          </div>
        );
      },
    },
    {
      id: "Cliente",
      accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    },
    {
      accessorKey: "status_id",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status_id") as string;
        const orderId = row.original.id;

        if (!status) {
          return null;
        }

        return (
          <UpdateOrderStatus
            defaultValue={status.toString()}
            orderId={orderId.toString()}
          />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;

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
                    navigator.clipboard.writeText(order.id.toString())
                  }
                >
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`${order.id}`}>Ver detalle</Link>
                </DropdownMenuItem>
                {Number(order.status_id) <= ORDER_STATUS.IN_PROGRESS && (
                  <DropdownMenuItem asChild>
                    <Link to={`${order.id}/edit`}>Editar</Link>
                  </DropdownMenuItem>
                )}
                {Number(order.status_id) < ORDER_STATUS.IN_PROGRESS && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteDialog(order.id.toString())}
                  >
                    Dar de baja
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: string) => deleteOrder(orderId),
    onSuccess: () => {
      toast({
        title: "Orden dada de baja",
        description: "La orden fue dada de baja correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return (
    <>
      <ConfirmationDialog
        open={deleteDialogOpen}
        title={`Dar de baja orden`}
        description="Esta seguro que desea dar de baja la orden?"
        onConfirm={() => {
          if (!orderId) return;
          deleteOrderMutation.mutate(orderId.toString());
          handleDeleteDialog(null);
        }}
        onOpenChange={(isOpen) => {
          if (isOpen === true) return;
          setDeleteDialogOpen(false);
          setOrderId(null);
        }}
      />
      <DataTable columns={columns} data={data} />
    </>
  );
}

export default OrdersTable;
