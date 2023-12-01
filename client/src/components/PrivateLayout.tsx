import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const sidebarNavItems = [
  {
    to: "/orders",
    label: "Ordenes",
  },
  {
    to: "/clients",
    label: "Clientes",
  },
  {
    to: "/dashboard",
    label: "Dashboard",
  },
];

function PrivateLayout() {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0  min-h-screen">
      <aside className=" lg:w-1/5 lg:py-10 lg:px-6 border-r flex flex-col bg-white min-h-full">
        <h3 className="text-2xl font-bold ml-4 mb-10">Misetec</h3>
        <SidebarNav items={sidebarNavItems} />
      </aside>
      <main className="flex-1 lg:max-w-6xl p-4 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;

type SidebarProps = {
  items: {
    to: string;
    label: string;
  }[];
};

function SidebarNav({ items }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <nav className="flex lg:flex-col gap-4 flex-1">
      {items.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-slate-100 hover:bg-slate-100"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )
          }
        >
          {label}
        </NavLink>
      ))}
      <Button
        className="mt-auto"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Cerrar sesion
      </Button>
    </nav>
  );
}

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
        <p className="text-muted-foreground text-slate-400">
          {description ??
            "Manage your account settings and set e-mail preferences."}
        </p>
      </div>
      <Separator className="my-6" />
    </>
  );
}
