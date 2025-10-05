import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 fixed h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col overflow-auto">
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
