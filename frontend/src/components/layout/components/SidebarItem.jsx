import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const SidebarItem = ({ item, isActive }) => {
  return (
    <Link to={item.path}>
      <li
        className={`group flex items-center gap-4 px-6 py-3 rounded-lg transition-all duration-200
          ${
            isActive
              ? "bg-white text-[#1F334E] shadow-md"
              : "text-white hover:bg-[#92def7] hover:text-[#162C55]"
          }
        `}
      >
        <Icon
          icon={item.icon}
          className={`w-6 h-6 transition-colors
            ${isActive ? "text-[#1F334E]" : "text-white"}
          `}
        />
        <span className="font-medium tracking-wide">
          {item.label}
        </span>
      </li>
    </Link>
  );
};

export default SidebarItem;
