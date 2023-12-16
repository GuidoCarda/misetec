import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen max-w-4xl  container py-10">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
