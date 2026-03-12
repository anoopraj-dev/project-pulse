import { Icon } from "@iconify/react";
import { useNotifications } from "../../../contexts/NotificationContext";
import  {useUser} from '../../../contexts/UserContext'
import { markNotificationsRead } from "../../../api/user/userApis";
import toast from 'react-hot-toast'

const NotificationPanel = ({setOpenNotification}) => {
  const { notifications, dispatch } = useNotifications();
  const {role} = useUser();

  const handleMarkAllRead = async () => {
  try {
    const res = await markNotificationsRead(role);

    if (!res?.data?.success) {
      return toast.error("Operation failed");
    }

    dispatch({ type: "MARK_ALL_READ" });
    setOpenNotification(false)
  } catch (error) {
    console.log(error)
    toast.error("Something went wrong");
  }
};


  return (
    <div className="w-80 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm ring-1 ring-slate-200 p-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:bell-outline" className="h-5 w-5 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={ handleMarkAllRead
            }
              className="text-sm text-slate-500 hover:text-sky-600 hover:bg-sky-50 px-2 py-1 rounded-lg transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Icon icon="mdi:bell-off-outline" className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">No notifications</p>
          </div>
        ) : (
          notifications.map((n, index) => (
            <div
              key={n._id || index}
              className="px-5 py-4 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 mb-1 leading-tight">
                    {n.title}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
