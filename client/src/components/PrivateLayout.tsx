import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";

function PrivateLayout() {
  return (
    <div className="px-10 lg:px-20  py-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5 ">
          <nav className="flex lg:flex-col gap-4">
            <Button className="justify-start" variant={"ghost"}>
              Ordenes
            </Button>
            <Button className="justify-start" variant={"ghost"}>
              Clientes
            </Button>
            <Button className="justify-start" variant={"ghost"}>
              Informes
            </Button>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default PrivateLayout;
