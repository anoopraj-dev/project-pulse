import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useUser } from "../../../contexts/UserContext";
import { useState, useEffect } from "react";
import { getDeviceTypes } from "@/utilis/deviceTypes";

import {
  adminSidebarMenu,
  doctorSidebarMenu,
  patientSidebarMenu,
} from "../configs/sidebarConfig";
import ProtectedFooter from "./ProtectedFooter";

const NAVBAR_HEIGHT = "h-16"; // navbar height

const Layout = () => {
  const { role } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const device = getDeviceTypes(window.innerWidth);

      if (device === "desktop") {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config =
    role === "patient"
      ? patientSidebarMenu
      : role === "doctor"
        ? doctorSidebarMenu
        : adminSidebarMenu;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${NAVBAR_HEIGHT}`}>
        <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
      </header>

      {/* Sidebar */}
      <aside
        className={`
    fixed z-40
    top-[4.9rem] left-0 bottom-0
     md:top-[7rem] sm:top-[5rem]
    md:left-6 sm:left-2
    bottom-2 sm:bottom-4

    flex flex-col
    bg-[#0096C7] text-white
    transition-all duration-300
    shadow-2xl
    rounded-2xl
    overflow-hidden
    backdrop-blur-sm

    ${isSidebarOpen ? "w-60 sm:w-64" : "w-16 sm:w-20"}
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
    mt-26 h-[calc(100vh-4rem)] overflow-y-auto
    transition-all duration-300
    px-2 sm:px-4 md:px-6 lg:px-8 xl:px-32
    ${isSidebarOpen ? "ml-60 sm:ml-64" : "ml-16 sm:ml-20"}
  `}
      >
        <Outlet />
        <ProtectedFooter/>
      </main>
    </div>
  );
};

export default Layout;
