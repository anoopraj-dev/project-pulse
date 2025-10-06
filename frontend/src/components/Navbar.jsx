import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { api } from "../api/api.js";

const Navbar = () => {
  const { email, role, name, dispatch, isLoading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isLoggedIn = !!email;


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout =async () => {
    const response = await api.
    dispatch({ type: "CLEAR_USER" });
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white fixed w-full shadow-md z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex justify-between items-center py-4">
          <div className="text-xl font-bold text-[#0096C7] w-lg">PULSE 360</div>

          {!isLoading && (
            <>
              {!isLoggedIn ? (
                <ul className="flex space-x-6">
                  <Link to="/"><li className="hover:text-[#0096C7] cursor-pointer">Home</li></Link>
                  <li className="hover:text-[#0096C7] cursor-pointer">About Us</li>
                  <li className="hover:text-[#0096C7] cursor-pointer">Services</li>
                  <li className="hover:text-[#0096C7] cursor-pointer">Find a doctor</li>
                  <Link to="/signin"><li className="hover:text-[#0096C7] cursor-pointer">Login</li></Link>
                  <Link to="/admin/login"><li className="hover:text-[#0096C7] cursor-pointer">Admin</li></Link>
                </ul>
              ) : (
                <div className="flex justify-between items-center w-full">

                  {/* Search bar and filter */}
                  <div className="flex items-center space-x-2 flex-grow max-w-3xl">
                    <input
                      type="text"
                      placeholder="Search doctors, services..."
                      className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0096C7]"
                    />
                    <select className="px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0096C7]">
                      <option>Location</option>
                      <option>Bangalore</option>
                      <option>Kochi</option>
                    </select>
                    <button className="px-4 py-2 bg-[#0096C7] text-white rounded-full hover:bg-[#0077A3]">Search</button>
                  </div>

                  {/* notification & avatar */}
                  <div className="flex items-center space-x-8 relative">
                    <Icon icon="mdi-notifications" className="w-7 h-7 text-[#0096C7] cursor-pointer" />

                    <div ref={menuRef} className="relative">
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => setMenuOpen((prev) => !prev)}
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-md font-bold text-gray-700">{name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-gray-700 text-xl font-semibold">{name.toUpperCase()}</span>
                      </div>

                      {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
