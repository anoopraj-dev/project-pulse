import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import SidebarItem from "./SidebarItem";
import SidebarShimmer from "../../ui/loaders/SidebarShimmer";


const Sidebar = ({ toggleSidebar , config }) => {
  const { profilePicture, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) return <SidebarShimmer />;

  return (
    <aside className="h-screen bg-[#0096C7] text-white flex flex-col mt-15">
      {/* Header */}
      <div className="flex justify-end p-4">
        <Icon
          icon="mingcute:square-arrow-left-line"
          className="w-8 h-8 text-[#7bcbe6] cursor-pointer"
          onClick={() => toggleSidebar(false)}
        />
      </div>

      {/* Profile */}
      <div className="flex justify-center mb-6">
        <img
          src={`${profilePicture || "/profile.png"}?t=${Date.now()}`}
          alt="Profile"
          className="rounded-full w-32 h-32 object-cover border-4 border-white/40"
        />
      </div>

      {/* Navigation */}
      <ul className="flex-1 space-y-2 px-2">
        {config.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
