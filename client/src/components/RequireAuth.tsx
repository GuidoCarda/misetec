// import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/Router";
import { Navigate, Outlet, useLocation } from "react-router-dom";

type RequireAuthProps = {
  allowedRoles: string[];
};

function RequireAuth({ allowedRoles }: RequireAuthProps) {
  // const { auth } = useAuth();
  const location = useLocation();
  const auth = JSON.parse(window.localStorage.getItem("user") || "{}");

  if (!auth?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAllowed = allowedRoles.includes(auth?.role);

  if (!isAllowed) {
    if (auth.role === ROLES.client) {
      return <Navigate to="/portal" state={{ from: location }} replace />;
    }

    if (auth.role === ROLES.staff) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }

  return <Outlet />;
}

export default RequireAuth;
