import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useUser } from "../../../contexts/UserContext";
import { useState } from "react";

import {
  adminSidebarMenu,
  doctorSidebarMenu,
  patientSidebarMenu,
} from "../configs/sidebarConfig";

const NAVBAR_HEIGHT = "h-16"; // navbar height

const Layout = () => {
  const { role } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const config =
    role === "patient"
      ? patientSidebarMenu
      : role === "doctor"
      ? doctorSidebarMenu
      : adminSidebarMenu;

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${NAVBAR_HEIGHT}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-18 left-0 bottom-0 z-20 flex flex-col bg-[#0096C7] text-white
          transition-all duration-300 shadow-lg
          ${isSidebarOpen ? "w-64" : "w-20"}
        `}
      >
        <Sidebar
          config={config}
          isOpen={isSidebarOpen}
          toggleSidebar={setIsSidebarOpen}
        />
      </aside>

      {/* Main content */}
      <main
        className={`
          mt-16 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 
          transition-all duration-300
          ${!isSidebarOpen ? "ml-20" : "ml-0"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
