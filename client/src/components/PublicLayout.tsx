import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen container py-10">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
