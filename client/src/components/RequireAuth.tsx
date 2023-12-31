// import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type RequireAuthProps = {
  allowedRoles: string[];
};

function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { auth, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (!auth?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAllowed = allowedRoles.includes(auth?.role);

  if (!isAllowed) {
    if (auth.role === ROLES.CLIENT) {
      return <Navigate to="/portal" state={{ from: location }} replace />;
    }

    if (auth.role === ROLES.STAFF) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
}

export default RequireAuth;
