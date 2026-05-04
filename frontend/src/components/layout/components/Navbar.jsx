import { Link } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext.jsx";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser as clerkUser, useClerk } from "@clerk/clerk-react";
import useWindowSize from "../../../hooks/useWindowSize.jsx";
import logo from "../../../assets/logoPrimary.png";
import { logoutUser } from "../../../api/auth/authService.js";
import NotificationBell from "../../shared/components/NotificationBell.jsx";
import NotificationPanel from "../../shared/components/NotificationPanel.jsx";
import { socket } from "../../../socket.js";
import toast from "react-hot-toast";


const Navbar = ({ toggleSidebar }) => {
  const { email, role, name, dispatch, isLoading, profilePicture, id } = useUser();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const menuRef = useRef(null);
  const { user } = clerkUser();
  const { signOut } = useClerk();
  const isLoggedIn = !!email;
  const { width } = useWindowSize();
  const isMobile = width <= 1024;
  const profileImage = user?.imageUrl || profilePicture || '/profile.png';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
        setNavMenuOpen(false);
        setOpenNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      if (user) {
        if (socket.connected) {
          socket.emit("user:logout", { userId: id });
          socket.disconnect();
          socket.close();
        }
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
      if (!res.success) toast.error('Logout failed');
      navigate(role === "admin" ? "/admin/login" : "/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 h-14 sm:h-16">
      <div className="h-full mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="h-full flex items-center justify-between gap-4">
          
          {/* Brand Section */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                if (toggleSidebar) {
                  toggleSidebar();
                } else {
                  setNavMenuOpen((prev) => !prev);
                }
                setProfileMenuOpen(false);
              }}
              aria-label="Menu"
            >
              <Icon
                icon={navMenuOpen ? "ph:x" : "ph:list"}
                className="h-5 w-5"
              />
            </button>

            <Link to="/" className="flex items-center shrink-0">
              <img
                src={logo}
                alt="Pulse360"
                className="h-5 w-auto sm:h-6 lg:h-7 object-contain"
              />
            </Link>

            {/* Desktop Links */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center gap-6 ml-8">
                <Link
                  to="/"
                  className="text-xs font-bold text-gray-600 hover:text-[#0096C7] transition-colors"
                >
                  Home
                </Link>
                <Link 
                  to='/about-us'
                  className="text-xs font-bold text-gray-600 hover:text-[#0096C7] transition-colors"
                >
                  About
                </Link>
              </div>
            )}
          </div>

          {/* Action Section */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {!isLoggedIn ? (
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                      to="/signin"
                      className="hidden sm:block text-xs font-bold text-gray-700 hover:text-[#0096C7] px-3 py-2 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-[#0096C7] hover:bg-[#007da6] text-white text-[11px] sm:text-xs font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-sm transition-all active:scale-95 uppercase tracking-wide"
                    >
                      Join Now
                    </Link>
                  </div>
                ) : (
                  <div ref={menuRef} className="flex items-center gap-2 sm:gap-4">
                    <NotificationBell
                      onClick={() => {
                        setOpenNotification((prev) => !prev);
                        setProfileMenuOpen(false);
                      }}
                    />

                    {openNotification && (
                      <div className="absolute right-4 top-full mt-2 w-80 sm:w-96 z-[110]">
                        <NotificationPanel setOpenNotification={setOpenNotification}/>
                      </div>
                    )}

                    <div className="relative">
                      <button
                        className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all"
                        onClick={() => setProfileMenuOpen((prev) => !prev)}
                      >
                        <img
                          src={profileImage}
                          alt={name}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200"
                        />
                        <Icon
                          icon="ph:caret-down"
                          className={`h-3 w-3 text-gray-400 hidden sm:block transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Dropdown */}
                      {profileMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-[110]">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Account</p>
                            <p className="text-xs font-semibold text-gray-700 truncate">{name}</p>
                          </div>
                          
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Icon icon="ph:sign-out" className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {navMenuOpen && !isLoggedIn && !toggleSidebar && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl py-4 px-4 flex flex-col gap-1">
          <Link
            to="/"
            onClick={() => setNavMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Icon icon="ph:house" className="h-5 w-5 text-gray-400" />
            Home
          </Link>
          <Link
            to="/about-us"
            onClick={() => setNavMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Icon icon="ph:info" className="h-5 w-5 text-gray-400" />
            About Us
          </Link>
          <Link
            to="/signin"
            onClick={() => setNavMenuOpen(false)}
            className="sm:hidden flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <Icon icon="ph:sign-in" className="h-5 w-5 text-gray-400" />
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};


export default Navbar;



