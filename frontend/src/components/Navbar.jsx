import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="bg-white  fixed w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-bold text-[#0096C7]">PULSE 360</div>
          <ul className="flex space-x-6">
            <Link to ='/'>
            <li className="hover:text-[#0096C7] cursor-pointer">Home</li>
              </Link>
            <li className="hover:text-[#0096C7] cursor-pointer">About Us</li>
            <li className="hover:text-[#0096C7] cursor-pointer">Services</li>
            <li className="hover:text-[#0096C7] cursor-pointer">Find a doctor</li>
            <Link to='/signin'>
               <li className="hover:text-[#0096C7] cursor-pointer">Login</li>
            </Link>
           
            <li className="hover:text-[#0096C7] cursor-pointer">Admin</li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
