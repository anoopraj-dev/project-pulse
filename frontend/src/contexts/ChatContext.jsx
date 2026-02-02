import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { getConversations } from "../api/user/userApis";
import { useUser } from "./UserContext";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { socket } = useSocket();
  const { role } = useUser();
  const [totalUnread, setTotalUnread] = useState(0);

  // ---------------- Initial fetch of total unread ----------------
  useEffect(() => {
    const fetchInitialUnread = async () => {
      try {
        const res = await getConversations(role);
        const total = res.data.conversations.reduce(
          (sum, c) => sum + (c.unreadCount || 0),
          0
        );
        setTotalUnread(total);
      } catch (err) {
        console.error("Failed to fetch initial unread count:", err);
      }
    };

    if (role) fetchInitialUnread();
  }, [role]);

  // ---------------- Realtime increment ----------------
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = () => {
      setTotalUnread((prev) => prev + 1);
    };

    socket.on("message:receive", handleReceiveMessage);
    return () => socket.off("message:receive", handleReceiveMessage);
  }, [socket]);

  return (
    <ChatContext.Provider value={{ totalUnread, setTotalUnread }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
