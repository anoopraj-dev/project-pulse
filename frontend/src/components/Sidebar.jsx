import { Icon } from "@iconify/react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ShimmerCard from "./ShimmerCard";

const Sidebar = ({ toggleSidebar }) => {
  const { profilePicture, isLoading } = useUser();
  const location = useLocation();
  const [device,setDevice] = useState()

  //-------Sidbar Navigation Menu config-------
  const menuItems = [
    { name: "Dashboard", icon: "mdi:home", path: "/patient/dashboard" },
    { name: "Profile", icon: "mdi:account", path: "/patient/profile" },
    { name: "Messages", icon: "mdi:message-bubble", path: "/patient/messages" },
    {
      name: "Doctors",
      icon: "healthicons:doctor-male",
      path: "/patient/doctors",
    },
    {
      name: "Appointments",
      icon: "mdi:calendar-month",
      path: "/patient/appointments",
    },
    { name: "Records", icon: "mdi:file-document", path: "/patient/records" },
    {
      name: "Transactions",
      icon: "mdi:bank-transfer",
      path: "/patient/transactions",
    },
    { name: "Wallet", icon: "mdi:wallet", path: "/patient/wallet" },
    { name: "Settings", icon: "mdi:settings", path: "/patient/settings" },
  ];

  // //-------sidebar toggle function--------
  const handleClose = () => {
    toggleSidebar(false);
  };

  return (
    <div
      className={`h-screen  bg-white text-gray-100 flex flex-col mt-15`}
    >
      <nav className="flex-1 ">
        <div className="flex justify-end">
          <Icon
            icon={"mingcute:square-arrow-left-line"}
            className="w-8 h-8 text-[#7bcbe6]"
            onClick={handleClose}
          />
        </div>
        <div className="flex p-6 pl-15">
          {isLoading ? (
            <ShimmerCard />
          ) : (
            <img
              src={profilePicture || "/profile.png"}
              alt="Profile"
              className="rounded-full w-30 h-30 object-cover"
            />
          )}
        </div>

        <ul className="space-y-3 gap-3">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link to={item.path} key={idx}>
                <li
                  className={`flex items-center gap-3 p-2  pl-10 cursor-pointer rounded
                    ${
                      isActive
                        ? "bg-[#0096C7] text-white"
                        : "text-[#162C55] hover:bg-[#92def7] hover:text-[#162C55]"
                    }
                  `}
                >
                  <Icon
                    icon={item.icon}
                    className={`w-7 h-7 ${
                      isActive ? "text-white" : "text-[#0096C7]"
                    } `}
                  />
                  <span className="font-semibold ">{item.name}</span>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
