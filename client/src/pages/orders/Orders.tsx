import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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
  firstname?: string;
  lastname?: string;
  service_type?: string;
};

const columns: ColumnDef<Order>[] = [
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
      const formattedDate = formatTimeStamp(createdAt);

      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Descripcion",
    cell: ({ row }) => {
      // console.log(row);
      const description = row.getValue("description") as string;
      const serviceType = row.original.service_type;

      return (
        <div className="w-[350px]">
          {serviceType && (
            <TooltipDemo tooltipContent={serviceType}>
              <Badge className="rounded-md" variant={"outline"}>
                {serviceType.split(" ").at(0)}
              </Badge>
            </TooltipDemo>
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
                <Link to={`${client.id}`}>Ver detalle</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`${client.id}/edit`}>Editar</Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to={`/clients/${client.client_id}`}>Ver cliente</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTimeStamp } from "@/utils";
import { useToast } from "@/components/ui/use-toast";

type SelectDemoProps = {
  defaultValue: string;
  items: { id: string; denomination: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export function SelectDemo({
  defaultValue,
  items,
  placeholder,
  onChange,
}: SelectDemoProps) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Estados</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.denomination}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

type OrderStatus = {
  id: string;
  denomination: string;
  description: string;
};

export function UpdateOrderStatus({
  defaultValue,
  orderId,
}: {
  defaultValue: string;
  orderId: string;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const orderStatusList = useQuery({
    queryKey: ["orderStatusList"],
    queryFn: getOrderStatusList,
  });

  const mutation = useMutation({
    mutationFn: (status: string) => {
      console.log("status dentro mutacion", status);
      return updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      console.log("Orden actualizada");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Orden actualizada",
        description: "El estado de la orden fue actualizado correctamente",
      });
    },
  });

  const onChange = (status: string) => {
    mutation.mutate(status);
  };

  if (orderStatusList.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SelectDemo
      defaultValue={defaultValue}
      items={orderStatusList.data.data}
      onChange={onChange}
    />
  );
}

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipDemo({
  children,
  tooltipContent,
}: {
  children: React.ReactNode;
  tooltipContent: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default Orders;
