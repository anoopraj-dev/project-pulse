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
      // Desktop: Sidebar open by default
      // Tablet/Mobile: Sidebar closed by default
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config =
    role === "patient"
      ? patientSidebarMenu
      : role === "doctor"
        ? doctorSidebarMenu
        : adminSidebarMenu;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Navbar - Fixed top */}
      <header className="fixed top-0 left-0 right-0 z-[100] h-14 sm:h-16">
        <Navbar toggleSidebar={toggleSidebar} />
      </header>

      {/* Content Wrapper */}
      <div className="flex flex-1 pt-14 sm:pt-16 overflow-hidden relative">
        
        {/* Mobile Sidebar Overlay */}
        <div 
          className={`
            fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] lg:hidden transition-all duration-500
            ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar - Modern transitions */}
        <aside
          className={`
            fixed lg:static z-[100] lg:z-40
            top-0 lg:top-auto bottom-0 left-0
            bg-[#0096C7] text-white
            transition-all duration-300 ease-in-out
            shadow-2xl lg:shadow-none
            ${isSidebarOpen ? "translate-x-0 w-72 lg:w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
          `}
        >
          {/* Top padding on mobile to clear fixed navbar if needed */}
          <div className="h-full pt-14 sm:pt-16 lg:pt-0">
            <Sidebar
              config={config}
              isOpen={isSidebarOpen}
              toggleSidebar={setIsSidebarOpen}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50">
          <div className="min-h-full flex flex-col p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full space-y-8 flex-1">
              <Outlet />
            </div>
            
            {/* Protected Footer within main scroll */}
            <div className="max-w-7xl mx-auto w-full border-t border-slate-200 mt-12 pt-8">
              <ProtectedFooter />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
