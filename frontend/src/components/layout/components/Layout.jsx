
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useUser } from "../../../contexts/UserContext";
import {
  adminSidebarMenu,
  doctorSidebarMenu,
  patientSidebarMenu,
} from "../configs/sidebarConfig";

const NAVBAR_HEIGHT = "h-16";
const SIDEBAR_WIDTH = "w-64";

const Layout = () => {
  const { role } = useUser();

  const config =
    role === "patient"
      ? patientSidebarMenu
      : role === "doctor"
      ? doctorSidebarMenu
      : adminSidebarMenu;

  return (
    <div className="h-screen overflow-hidden">
      <header className={`fixed top-0 left-0 right-0 z-50 ${NAVBAR_HEIGHT}`}>
        <Navbar />
      </header>

      <aside
        className={`fixed top-16 left-0 ${SIDEBAR_WIDTH} bottom-0 z-40`}
      >
        <Sidebar config={config} />
      </aside>

      <main
        className={`ml-64 mt-16 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
