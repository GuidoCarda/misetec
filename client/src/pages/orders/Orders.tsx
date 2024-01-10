import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getOrderStatusList,
  getOrders,
  updateOrderStatus,
} from "@/services/orders";
import { OrderStatus, OrderWithClientDetails } from "@/types";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUS, allowedTransitions } from "@/constants";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import OrdersTable from "@/components/OrdersTable";

function Orders() {
  const [search, setSearch] = useState("");

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    select: (data) => {
      console.log(data);
      return data.filter(
        (order: OrderWithClientDetails) =>
          order.id.toString().toLowerCase().includes(search.toLowerCase()) ||
          order.description.toLowerCase().includes(search.toLowerCase()) ||
          order?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
          order?.lastname?.toLowerCase().includes(search.toLowerCase())
      );
    },
  });

  if (!isPending && !data) {
    return <div>No hay datos</div>;
  }

  return (
    <div className="w-full">
      <header className="flex items-center justify-between md:mb-10">
        <h2 className="text-2xl font-bold tracking-tight">Ordenes</h2>
        <Link to={"new"}>
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Nueva orden
          </Button>
        </Link>
      </header>

      <div className="mt-5 mb-4">
        <Label className="mb-2 block">Buscar orden</Label>
        <Input
          className="w-1/2"
          type="search"
          name="q"
          id="q"
          placeholder="nombre cliente, nro cliente, nro orden"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isError && <div>Error: {error.message}</div>}

      {!isPending && <OrdersTable data={data} />}
    </div>
  );
}

type SelectDemoProps = {
  disabled: boolean;
  defaultValue: string;
  items: { id: number; denomination: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export function SelectDemo({
  disabled,
  defaultValue,
  items,
  placeholder,
  onChange,
}: SelectDemoProps) {
  // console.log(items, defaultValue);
  return (
    <Select
      disabled={disabled}
      defaultValue={defaultValue}
      onValueChange={onChange}
    >
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

  if (orderStatusList.isPending) {
    return <Skeleton className="w-[160px] h-10" />;
  }

  if (orderStatusList.isError) {
    return <div>Error: {orderStatusList.error.message}</div>;
  }

  const allowedStatusList = orderStatusList?.data.filter(
    (status: OrderStatus) =>
      allowedTransitions[defaultValue].includes(status.id.toString()) ||
      status.id.toString() === defaultValue
  );

  if (mutation.isPending) {
    return (
      <Skeleton className="w-[160px] text-slate-500 select-none cursor-wait h-10 flex items-center px-2">
        Actualizando..
      </Skeleton>
    );
  }

  const isDisabled =
    Number(defaultValue) === ORDER_STATUS.CANCELLED ||
    Number(defaultValue) === ORDER_STATUS.FINISHED;

  return (
    <SelectDemo
      disabled={isDisabled}
      defaultValue={defaultValue}
      items={allowedStatusList}
      onChange={onChange}
    />
  );
}

export default Orders;
