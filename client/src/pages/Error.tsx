import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError() as Error;
  return (
    <main className="min-h-screen w-full grid place-content-center">
      <div className="flex flex-col items-center">
        <span className="grid place-items-center bg-red-50 h-24 w-24 rounded-md mb-6">
          <AlertTriangleIcon className="h-16 w-16 text-red-400" />
        </span>
        <h2 className="text-2xl font-bold">Algo salio mal</h2>
        <p>{error?.message}</p>
        <Link to={".."}>
          <Button variant={"link"}>Volver al inicio</Button>
        </Link>
      </div>
    </main>
  );
}

export default ErrorPage;
