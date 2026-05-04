import { Outlet} from "react-router-dom";
import Navbar from "../components/Navbar";


const PublicLayout = () => {
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-14 sm:pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
