import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const Layout = ({ children }) => {
  //------- State variable dependent on screensize------
  const [openSidebar, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //----- Sidebar toggle function ------
  const toggleSidebar = (state) => {
    setSidebarOpen(state);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`fixed h-screen bg-white transition-all duration-300  ease-in-out border border-[#b4e3f3] ${
          openSidebar ? "w-64" : "w-0"
        }`}
      >
        {openSidebar ? (
          <Sidebar toggleSidebar={toggleSidebar} />
        ) : (
          <div
            className="flex mt-16 justify-center h-full w-8 cursor-pointer"
            onClick={() => toggleSidebar(true)}
          >
            <Icon
              icon={"mingcute:square-arrow-right-line"}
              className="w-8 h-8 text-[#7bcbe6]"
            />
          </div>
        )}
      </div>

      <div
        className={`flex-1 flex flex-col overflow-auto transition-all duration-300 ${
          openSidebar ? "ml-64" : "ml-0"
        }`}
      >
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
