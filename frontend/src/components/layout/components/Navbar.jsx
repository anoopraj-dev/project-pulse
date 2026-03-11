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

const Navbar = () => {
  const { email, role, name, dispatch, isLoading, profilePicture,id } = useUser();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
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
      if (!res.success) console.log("Logout failed");
      navigate(role === "admin" ? "/admin/login" : "/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-60 backdrop-blur-md bg-white/95 shadow-sm border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4">
          {/* Left: Logo + Mobile hamburger */}
          <div className="flex items-center gap-4">
            {isMobile && (
              <Icon
                icon="mdi:hamburger-menu"
                className="text-slate-700 cursor-pointer h-6 w-6 hover:text-sky-600 transition-colors"
                onClick={() => {
                  setNavMenuOpen((prev) => !prev);
                  setProfileMenuOpen(false);
                }}
              />
            )}

            <Link to="/" className="block h-8 w-28 sm:h-10 sm:w-48">
              <img
                src={logo}
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </Link>
          </div>

          {/* Center: Search */}
          {!isLoggedIn && !isMobile && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search doctors, services..."
                  className="
                    w-full pl-10 pr-4 py-2.5 text-sm
                    rounded-2xl border border-slate-200
                    bg-slate-50
                    focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                    transition-all
                  "
                />
              </div>
            </div>
          )}

          {/* Right: Nav + Profile */}
          {!isLoading && (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop nav */}
              {!isLoggedIn && !isMobile && (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/"
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                  >
                    Home
                  </Link>
                  <Link to='/about-us'
                  className="px-3 py-2 text-sm text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all">
                    About
                  </Link>
      
                </div>
              )}

              {/* Auth buttons */}
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/signin"
                    className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/admin/login"
                    className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                  >
                    Admin
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 rounded-xl transition-all shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div ref={menuRef} className="relative flex items-center gap-3">
                  <div className="relative">
                    <NotificationBell
                      onClick={() => {
                        setOpenNotification((prev) => !prev);
                        setProfileMenuOpen(false);
                      }}
                    />

                    {openNotification && (
                      <div className="absolute right-0 top-12 z-50">
                        <NotificationPanel />
                      </div>
                    )}
                  </div>

                  <div
                    className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-xl transition-colors"
                    onClick={() => setProfileMenuOpen((prev) => !prev)}
                  >
                    {profileImage ? (
                      <img
                        src={`${profileImage}?t=${Date.now()}`}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center ring-2 ring-slate-200">
                        <span className="text-sm font-semibold text-white">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {!isMobile && (
                      <span className="hidden sm:block text-sm font-semibold text-slate-900 truncate max-w-[120px]">
                        {name}
                      </span>
                    )}
                    <Icon
                      icon="mdi:chevron-down"
                      className="h-4 w-4 text-slate-500"
                    />
                  </div>

                  {/* Profile dropdown */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100">
                        {email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Icon icon="mdi:logout" className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        {navMenuOpen && isMobile && (
          <div className="md:hidden bg-white/95 backdrop-blur border-t border-slate-100 shadow-sm">
            <div className="flex flex-col items-center py-4 space-y-3 px-4">
              <Link
                to="/"
                onClick={() => setNavMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
              >
                <Icon icon="mdi:home" className="h-5 w-5" />
                Home
              </Link>
              <span className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all cursor-default">
                <Icon icon="mdi:information" className="h-5 w-5" />
                About
              </span>

              {!isLoggedIn ? (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setNavMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/admin/login"
                    onClick={() => setNavMenuOpen(false)}
                    className="w-full text-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                  >
                    Admin
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600 rounded-xl transition-all shadow-sm"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



