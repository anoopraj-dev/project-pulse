import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNotifications } from "./NotificationContext";
import { getNotifications } from "../api/user/userApis";
import { useUser } from "./UserContext";
import { socket } from "../socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { id, role } = useUser();
  const { dispatch: notifyDispatch } = useNotifications();

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(socket.connected);

  const fetchNotifications = useCallback(async () => {
    if (!role) return;

    const res = await getNotifications(role);
    notifyDispatch({
      type: "SET_NOTIFICATIONS",
      payload: res.data.notifications,
    });
  }, [role, notifyDispatch]);

  useEffect(() => {
    if (!id || !role) {
      if (socket.connected) socket.disconnect();
      return;
    }

    socket.auth = { userId: id, role };
    socket.connect();

    //-------------------- Handlers ---------------------------

    const handleConnect = () => {
      setIsConnected(true);
      fetchNotifications();
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNotification = (notification) => {
      notifyDispatch({
        type: "ADD_NOTIFICATION",
        payload: notification,
      });
    };

    const handlePresenceSync = ({ onlineUsers }) => {
      const set = new Set();
      Object.entries(onlineUsers).forEach(([uid, isOnline]) => {
        if (uid !== id && isOnline) set.add(uid);
      });
      setOnlineUsers(set);
    };

    const handlePresenceOnline = ({ userId }) => {
      if (!userId || userId === id) return;
      setOnlineUsers((prev) => {
        if (prev.has(userId)) return prev;
        const copy = new Set(prev);
        copy.add(userId);
        return copy;
      });
    };

    const handlePresenceOffline = ({ userId }) => {
      if (!userId || userId === id) return;
      setOnlineUsers((prev) => {
        if (!prev.has(userId)) return prev;
        const copy = new Set(prev);
        copy.delete(userId);
        return copy;
      });
    };

    //----------------- Listen to events ---------------------

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("notification:new", handleNotification);

    socket.on("presence:sync", handlePresenceSync);
    socket.on("presence:online", handlePresenceOnline);
    socket.on("presence:offline", handlePresenceOffline);

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    //---------------- Cleanup ------------------------

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("notification:new", handleNotification);

      socket.off("presence:sync", handlePresenceSync);
      socket.off("presence:online", handlePresenceOnline);
      socket.off("presence:offline", handlePresenceOffline);

      if (socket.connected) socket.disconnect();
    };
  }, [id, role, fetchNotifications, notifyDispatch]);

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      onlineUsers,
    }),
    [isConnected, onlineUsers]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
