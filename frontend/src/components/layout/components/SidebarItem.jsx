import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useChatContext } from "../../../contexts/ChatContext";

const SidebarItem = ({ item, isActive, isOpen }) => {
  const { totalUnread } = useChatContext();

  // Show unread badge ONLY for Messages item
  const showUnread =
    item.label === "Messages" && totalUnread > 0;

  return (
    <Link to={item.path}>
      <li
        className={`group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 relative
          ${
            isActive
              ? "bg-white text-[#1F334E] shadow-md"
              : "text-white hover:bg-[#92def7] hover:text-[#162C55]"
          }
        `}
      >
        {/* Icon */}
        <Icon
          icon={item.icon}
          className={`w-6 h-6 ${
            isActive ? "text-[#1F334E]" : "text-white"
          }`}
        />

        {/* Label */}
        {isOpen && (
          <span className="font-medium tracking-wide">
            {item.label}
          </span>
        )}

        {/* Unread Badge */}
        {showUnread && (
          <span
            className={`absolute ${
              isOpen ? "right-4" : "right-2"
            } top-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full`}
          >
            {totalUnread}
          </span>
        )}
      </li>
    </Link>
  );
};

export default SidebarItem;
