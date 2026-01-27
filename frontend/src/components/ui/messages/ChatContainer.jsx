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
      setMessages(res?.data.messages || []);

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
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        return exists ? prev : [...prev, message];
      });

      setConversations((prev) =>
        prev.map((c) =>
          c._id === message.conversationId ? { ...c, lastMessage: message } : c,
        ),
      );
    };

    socket.on("message:receive", handleReceiveMessage);
    return () => {
      socket.off("message:receive", handleReceiveMessage);
    };
  }, [socket]);

  const participantId = activeConversation?.participant?._id;
  const isOnline = participantId && onlineUsers.has(participantId);

  return (
    <ChatLayout
      sidebar={
        <ChatSidebar
          conversations={conversations}
          onSelect={(id) => navigate(`/${role}/messages/${id}`)}
        />
      }
    >
      {receiverId ? (
        <>
          <ChatHeader
            name={activeConversation?.participant?.name?.toUpperCase()}
            online={isOnline}
            profilePicture={activeConversation?.participant?.profilePicture}
          />
          <MessageList messages={messages} userId={id} />
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
