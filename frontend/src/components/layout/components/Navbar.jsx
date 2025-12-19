import { Link } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext.jsx";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser as clerkUser, useClerk } from "@clerk/clerk-react";
import useWindowSize from "../../../hooks/useWindowSize.jsx";
import logo from "../../../assets/logoPrimary.png";
import { logoutUser } from "../../../api/auth/authService.js"; 

const Navbar = () => {
  const { email, role, name, dispatch, isLoading, profilePicture } = useUser();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = clerkUser();
  const { signOut } = useClerk();
  const isLoggedIn = !!email;
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const profileImage = user?.imageUrl || profilePicture || "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
        setNavMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (user) {
        await signOut({ redirectUrl: "/signin" });
        await logoutUser(); 
        dispatch({ type: "CLEAR_USER" });
        sessionStorage.clear();
        setProfileMenuOpen(false);
        navigate("/signin");
        return;
      }

      const res = await logoutUser(); 
      dispatch({ type: "CLEAR_USER" });
      setProfileMenuOpen(false);
      if (!res.success) console.log("Logout failed");
      navigate(role === "admin" ? "/admin/login" : "/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-white fixed w-full z-50 shadow-sm">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center py-3 px-4 lg:px-32">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Icon */}
            <Icon
              icon={"mdi:hamburger-menu"}
              className={`${
                isMobile ? "block" : "hidden"
              } text-[#0096C7] cursor-pointer h-8 w-8`}
              onClick={() => {
                setNavMenuOpen((prev) => !prev);
                setProfileMenuOpen(false);
              }}
            />

            {/* Logo */}
            <span
              className={`${isMobile ? "w-24" : "w-32"} h-auto`}
              onClick={handleLogout}
            >
              <img src={logo} alt="Logo" />
            </span>
          </div>

          {/* Center + Right Section */}
          {!isLoading && (
            <>
              {!isLoggedIn && !isMobile ? (
                <>
                  <div className="flex items-center space-x-2 w-full sm:w-3/4  lg:w-1/2 xl:w-2/5 ml-4 mr-auto">
                    <input
                      type="text"
                      placeholder="Search doctors, services..."
                      className="flex-1 min-w-[80px]  px-3 py-2 text-sm sm:text-base rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#0096C7]"
                    />
                  </div>
                  <ul className="flex space-x-6 text-lg font-md ml-4">
                    <Link to="/">
                      <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">
                        Home
                      </li>
                    </Link>
                    <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">
                      About Us
                    </li>
                    <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">
                      Services
                    </li>
                    <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">
                      Find a Doctor
                    </li>
                    <Link to="/signin">
                      <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">
                        Login
                      </li>
                    </Link>
                    <Link to="/admin/login">
                      <li className="p-2 hover:bg-[#0096C7] hover:text-white rounded-3xl">
                        Admin
                      </li>
                    </Link>
                  </ul>
                </>
              ) : (
                <div className="flex items-center space-x-6 relative">
                  {!isMobile && (
                    <div ref={menuRef} className="relative flex items-center space-x-2 cursor-pointer">
                      <div
                        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
                        onClick={() => setProfileMenuOpen((prev) => !prev)}
                      >
                        {profileImage ? (
                          <img
                            src={`${profileImage}?t=${Date.now()}`}
                            alt="Profile"
                            className="rounded-full w-10 h-10 object-cover"
                          />
                        ) : (
                          <span className="text-md font-bold text-gray-700">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {!isMobile && (
                        <span className="text-gray-700 text-xl font-semibold">
                          {name.toUpperCase()}
                        </span>
                      )}

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
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile Nav Menu */}
        {navMenuOpen && isMobile && (
          <div className="bg-white shadow-md border-t border-gray-200 flex flex-col items-center py-4 space-y-4">
            <Link to="/" onClick={() => setNavMenuOpen(false)}>
              <li className="hover:text-[#0096C7] list-none">Home</li>
            </Link>
            <li className="hover:text-[#0096C7] list-none">About Us</li>
            <li className="hover:text-[#0096C7] list-none">Services</li>
            <li className="hover:text-[#0096C7] list-none">Find a Doctor</li>

            {!isLoggedIn ? (
              <>
                <Link to="/signin" onClick={() => setNavMenuOpen(false)}>
                  <li className="hover:text-[#0096C7] list-none">Login</li>
                </Link>
                <Link to="/admin/login" onClick={() => setNavMenuOpen(false)}>
                  <li className="hover:text-[#0096C7] list-none">Admin</li>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#0096C7] text-white rounded-full hover:bg-[#0077A3]"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
