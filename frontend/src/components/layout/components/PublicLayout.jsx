import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";


const PublicLayout = () => {
  
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PublicLayout;
