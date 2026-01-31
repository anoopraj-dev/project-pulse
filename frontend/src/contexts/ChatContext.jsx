import { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside ChatProvider");
  return ctx;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Helper: mark a conversation as read
  const markConversationAsRead = (conversationId) => {
    if (!conversationId) return;
    setUnreadCounts((prev) => ({
      ...prev,
      [conversationId]: 0,
    }));
  };

  // Helper: increment unread count for a conversation
  const incrementUnread = (conversationId) => {
    if (!conversationId) return;
    setUnreadCounts((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || 0) + 1,
    }));
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        setConversations,
        activeConversation,
        setActiveConversation,
        unreadCounts,
        setUnreadCounts,
        markConversationAsRead,
        incrementUnread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
