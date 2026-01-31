import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useSocket } from "../../../contexts/SocketContext";
import ChatLayout from "../../layout/components/ChatLayout";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { getAllMessages, getConversations } from "../../../api/user/userApis";

const ChatContainer = () => {
  const { socket, isConnected, onlineUsers } = useSocket();
  const { id: receiverId } = useParams();
  const { role, id } = useUser();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const tempConversationId = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceTypes(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------- Fetch Sidebar Conversations ----------------
  useEffect(() => {
    const loadConversations = async () => {
      const res = await getConversations(role);
      setConversations(res.data.conversations);
    };
    loadConversations();
  }, [role]);

  // ---------------- Fetch Messages ----------------
  useEffect(() => {
    if (!receiverId) return;

    const loadMessages = async () => {
      const res = await getAllMessages(role, receiverId);

      const updatedMessages = res.data.messages.map((m) =>
        m.receiverId === id ? { ...m, isRead: true } : m,
      );

      setMessages(updatedMessages);

      setActiveConversation({
        id: res?.data?.conversation?._id || null,
        participant: res.data.participant,
      });
    };

    loadMessages();
  }, [receiverId]);

  // ---------------- Conversation Created ----------------
  useEffect(() => {
    const handleConversationCreated = ({ conversationId }) => {
      setActiveConversation((prev) => ({
        ...prev,
        id: conversationId,
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c._id === tempConversationId.current
            ? { ...c, _id: conversationId }
            : c,
        ),
      );
    };

    socket.on("conversation:created", handleConversationCreated);
    return () => socket.off("conversation:created", handleConversationCreated);
  }, [socket]);

  // ---------------- Join Chat ----------------
  useEffect(() => {
    if (!activeConversation?.id || !isConnected) return;

    socket.emit("chat:join", {
      conversationId: activeConversation.id,
    });

    return () => {
      socket.emit("chat:leave", {
        conversationId: activeConversation.id,
      });
    };
  }, [activeConversation?.id, socket, isConnected]);

  // ---------------- Send Message ----------------
  const handleSendMessage = (text) => {
    console.log("send message called");
    if (!activeConversation) return;

    if (!activeConversation.id) {
      const tempId = `temp-${Date.now()}`;
      tempConversationId.current = tempId;

      setConversations((prev) => [
        {
          _id: tempId,
          participant: activeConversation.participant,
          lastMessage: {
            text,
            senderId: id,
          },
          unreadCount: 0,
        },
        ...prev,
      ]);
    }

    socket.emit("message:send", {
      conversationId: activeConversation.id || null,
      text,
      senderId: id,
      senderModel: role === "doctor" ? "Doctor" : "Patient",
      receiverId,
      receiverModel: role === "doctor" ? "Patient" : "Doctor",
    });

    console.log("emited send message");
  };

  // ---------------- Receive Message ----------------
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const isActiveChat = activeConversation?.id === message.conversationId;

      // add message only if chat is open
      setMessages((prev) =>
        isActiveChat && !prev.some((m) => m._id === message._id)
          ? [...prev, message]
          : prev,
      );

      //------------ update sidebar ---------
      setConversations((prev) =>
        prev.map((c) =>
          c._id === message.conversationId
            ? {
                ...c,
                lastMessage: message,
                unreadCount: isActiveChat ? 0 : (c.unreadCount || 0) + 1,
              }
            : c,
        ),
      );
    };

    socket.on("message:receive", handleReceiveMessage);
    return () => socket.off("message:receive", handleReceiveMessage);
  }, [socket, activeConversation?.id]);

  //-------------------------- Mark message as read -----------------
  useEffect(() => {
    if (!activeConversation?.id) return;

    setConversations((prev) =>
      prev.map((c) =>
        c._id === activeConversation.id ? { ...c, unreadCount: 0 } : c,
      ),
    );

    socket.emit("message:read", {
      conversationId: activeConversation.id,
    });
  }, [activeConversation?.id]);


//------------------- Reset Active conversation & messages on route change ------------------
  useEffect(() => {
    setActiveConversation(null);
    setMessages([]);
  }, [receiverId]);

  const participantId = activeConversation?.participant?._id;
  const isOnline = participantId && onlineUsers.has(participantId);

  return (
    <ChatLayout
      sidebar={
        <ChatSidebar
          conversations={conversations}
          onSelect={(id) => navigate(`/${role}/messages/${id}`)}
          activeConversationId={activeConversation?.id}
        />
      }
      isChatOpen={!!receiverId}
    >
      {receiverId ? (
        <>
          <ChatHeader
            name={activeConversation?.participant?.name?.toUpperCase()}
            online={isOnline}
            profilePicture={activeConversation?.participant?.profilePicture}
          />
          <MessageList
            messages={messages}
            userId={id}
            activeConversationId={activeConversation?.id}
          />
          <MessageInput onSend={handleSendMessage} disabled={!isConnected} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500">
          Select a conversation
        </div>
      )}
    </ChatLayout>
  );
};

export default ChatContainer;
