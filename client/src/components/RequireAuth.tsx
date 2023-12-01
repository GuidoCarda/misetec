import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
  const location = useLocation();
  const token = window.localStorage.getItem("token");

  // Si viene de clients login y tiene token, lo mando a portal de clientes
  // Si viene de staff login y tiene token, lo mando a orders
  // Si viene de cualquier otro lado y no tiene token, lo mando a staff login

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/staff-login" state={{ from: location }} replace />
  );
}

export default RequireAuth;
