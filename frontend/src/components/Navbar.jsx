import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { api } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useUser as clerkUser, useClerk } from "@clerk/clerk-react";
import useWindowSize from "../customHooks/useWindowSize.jsx";
import logo from '../assets/logoPrimary.png'


const Navbar = () => {
  const { email, role, name, dispatch, isLoading,profilePicture} = useUser();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = clerkUser();
  const { signOut } = useClerk();
  const isLoggedIn = !!email || !!user;
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width > 768 && width < 1300;

 
  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  

  const handleLogout = async () => {
    try {
      if (user) {
        await signOut();
        navigate("/signin");
        return;
      }
      const res = await api.post("/api/auth/logout");
      dispatch({ type: "CLEAR_USER" });
      setProfileMenuOpen(false);
      if (!res.data.success) console.log("Logout failed");
      navigate(role === "admin" ? "/admin/login" : "/signin");
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <nav className="bg-white fixed w-full z-50 shadow-md">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center py-4 px-4">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Icon */}
            <Icon
              icon={"mdi:hamburger-menu"}
              className={`${isMobile ? "block" : "hidden"} text-[#0096C7] cursor-pointer h-8 w-8`}
              onClick={() => {
                setNavMenuOpen((prev) => !prev);
                setProfileMenuOpen(false);
              }}
            />

            {/* Logo */}
            <span className={`${isMobile ? "w-24" : "w-32"} h-auto`}>
              <img src={logo} alt="Logo" />
            </span>
          </div>

          {/* Center + Right Section */}
          {!isLoading && (
            <>
              {/* Logged Out Desktop View */}
              {!isLoggedIn && !isMobile ? (
                <>
                  <div className="flex items-center space-x-2 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 ml-4 mr-auto">
                    <input
                      type="text"
                      placeholder="Search doctors, services..."
                      className="flex-1 min-w-[100px] sm:min-w-[140px] px-3 py-2 text-sm sm:text-base rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#0096C7]"
                    />
                    <select className="px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#0096C7]">
                      <option>Location</option>
                      <option>Bangalore</option>
                      <option>Kochi</option>
                    </select>
                    <Icon icon={"mdi:search"} className="w-8 h-8 m-2 bg-[#0096C7] text-white rounded-3xl px-1" />
                  </div>
                  {
                    isTablet ? (
                      <ul className="flex space-x-6 text-lg font-md text-[#0096C7]">
                        <Link to="/"><Icon icon="mdi:home-outline" className="w-7 h-7 cursor-pointer hover:text-[#0077A3]" /></Link>
                        <Icon icon="mdi:information-outline" className="w-7 h-7 cursor-pointer hover:text-[#0077A3]" />
                        <Icon icon="mdi:cog-outline" className="w-7 h-7 cursor-pointer hover:text-[#0077A3]" />
                        <Icon icon="mdi:account-search-outline" className="w-7 h-7 cursor-pointer hover:text-[#0077A3]" />
                        <Link to="/signin"><Icon icon="mdi:login" className="w-7 h-7 cursor-pointer hover:text-[#0077A3]" /></Link>
                        <Link to="/admin/login"><Icon icon="mdi:shield-account-outline" className="w-7 h-7 cursor-pointer hover:text-[#0077A3]" /></Link>
                      </ul>
                    ) : (
                      <ul className="flex space-x-6 text-lg font-md">
                        <Link to="/"><li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">Home</li></Link>
                        <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">About Us</li>
                        <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">Services</li>
                        <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">Find a Doctor</li>
                        <Link to="/signin"><li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">Login</li></Link>
                        <Link to="/admin/login"><li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">Admin</li></Link>
                      </ul>
                    )
                  }

                </>
              ) : (

                // Logged In or Mobile View
                <div className="flex items-center space-x-6 relative">
                  {/* Search Bar (Desktop Only) */}
                  {!isMobile &&
                    <>
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


                      {/* Notification + Avatar */}
                      <div className="flex items-center space-x-6 relative">
                        <Icon icon="mdi-notifications" className="w-7 h-7 text-[#0096C7] cursor-pointer" />

                        <div ref={menuRef} className="relative">
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => {
                              setProfileMenuOpen((prev) => !prev);
                              setNavMenuOpen(false);
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              {
                                profilePicture?(
                                  <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="rounded-full w-10 h-10 object-cover"
                                  />
                                ):
                                <span className="text-md font-bold text-gray-700">{name.charAt(0).toUpperCase()}</span>
                              }
                              
                            </div>
                            {!isMobile && <span className="text-gray-700 text-xl font-semibold">{name.toUpperCase()}</span>}
                          </div>

                          {/* Profile Menu */}
                          {profileMenuOpen && (
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
                    </>
                  }
                </div>

              )}
            </>
          )}
        </div>

        {/* Mobile Nav Menu */}
        {navMenuOpen && isMobile && (
          <div className="absolute top-15 left-0 w-full bg-white shadow-md border-t border-gray-200 z-40">
            <ul className="flex flex-col items-center space-y-4 py-4 text-lg font-medium">
              <Link to="/" onClick={() => setNavMenuOpen(false)}>
                <li className="hover:text-[#0096C7]">Home</li>
              </Link>
              <li className="hover:text-[#0096C7]">About Us</li>
              <li className="hover:text-[#0096C7]">Services</li>
              <li className="hover:text-[#0096C7]">Find a Doctor</li>

              {!isLoggedIn && (
                <>
                  <Link to="/signin" onClick={() => setNavMenuOpen(false)}>
                    <li className="hover:text-[#0096C7]">Login</li>
                  </Link>
                  <Link to="/admin/login" onClick={() => setNavMenuOpen(false)}>
                    <li className="hover:text-[#0096C7]">Admin</li>
                  </Link>
                </>
              )}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-[#0096C7] text-white rounded-full hover:bg-[#0077A3]"
                >
                  Logout
                </button>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
