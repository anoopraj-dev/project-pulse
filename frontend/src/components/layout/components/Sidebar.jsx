import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import SidebarItem from "./SidebarItem";
import SidebarShimmer from "../../ui/loaders/SidebarShimmer";

const Sidebar = ({ toggleSidebar, config, isOpen }) => {
  const { isLoading } = useUser();
  const location = useLocation();

  if (isLoading) return <SidebarShimmer />;

  return (
    <aside className="rounded-lg h-full bg-[#0096C7] text-white flex flex-col ">
      
      {/* Toggle button */}
      <div className="flex justify-center p-4">
        <Icon
          icon={
            isOpen
              ? "mingcute:square-arrow-left-line"
              : "mingcute:square-arrow-right-line"
          }
          className="w-7 h-7 text-[#7bcbe6] cursor-pointer"
          onClick={() => toggleSidebar(!isOpen)}
        />
      </div>

      {/* Navigation */}
      <ul className="flex-1 space-y-2 px-2">
        {config.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            isActive={location.pathname.startsWith ( item.path)}
            isOpen={isOpen}
          />
        ))}
      </ul>
    </aside>
  );
};


export default Sidebar;
