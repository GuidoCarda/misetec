import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] container max-w-4xl  py-10">
        <Outlet />
      </main>
      <footer className="text-black h-16 border-t grid place-items-center">
        Misetec soluciones informaticas
      </footer>
    </>
  );
}

export default PublicLayout;
