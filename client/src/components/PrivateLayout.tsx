import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";

function PrivateLayout() {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0  min-h-screen">
      <aside className=" lg:w-1/5 lg:py-10 lg:px-6 border-r bg-white min-h-full">
        <h3 className="text-2xl font-bold ml-4 mb-10">Misetec</h3>
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
      <main className="flex-1 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;

type SectionTitleProps = {
  title?: string;
  description?: string;
};

export function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {title ?? "Settings"}
        </h2>
        <p className="text-muted-foreground">
          {description ??
            "Manage your account settings and set e-mail preferences."}
        </p>
      </div>
      <Separator className="my-6" />
    </>
  );
}
