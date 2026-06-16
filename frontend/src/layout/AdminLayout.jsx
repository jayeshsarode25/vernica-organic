import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="min-w-0 flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
