import { Icon } from "@iconify/react";
import { useNotifications } from "../../../contexts/NotificationContext";

const NotificationBell = ({onClick}) => {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative cursor-pointer text-blue-400">
      <Icon icon="ic:round-notifications" width={24}  onClick={onClick}/>

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-3 bg-red-500 text-white font-semibold text-xs px-1.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
