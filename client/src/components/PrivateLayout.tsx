import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";

function PrivateLayout() {
  return (
    <div className=" min-h-screen grid grid-cols-[280px,_1fr]">
      <div className="md:container border-r flex flex-col gap-4 pt-10">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Misetec
        </h2>
        <Button variant={"outline"}>Ordenes</Button>
        <Button variant={"outline"}>Clientes</Button>
        <Button variant={"outline"}>Informes</Button>
      </div>
      <div className="md:container  py-10">
        <Outlet />
      </div>
    </div>
  );
}

export default PrivateLayout;
