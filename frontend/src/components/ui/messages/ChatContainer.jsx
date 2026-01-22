import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import ChatLayout from "../../layout/components/ChatLayout";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { getAllMessages, getConversations } from "../../../api/user/userApis";
import { socket } from "../../../socket";

const ChatContainer = () => {
  const { id: receiverId } = useParams();
  const { role,id} = useUser();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  // ---------------- Fetch Sidebar Conversations ---------------- 
  useEffect(() => {
    const loadConversations = async () => {
      const res = await getConversations(role);
      setConversations(res.data.conversations);
    };
    loadConversations();
  }, [role,messages]);

  // ---------------- Fetch Messages ---------------- 
  useEffect(() => {
    if (!receiverId) return;

    const loadMessages = async () => {
      const res = await getAllMessages(role, receiverId);
      setMessages(res?.data.messages);
      setActiveConversation({
        id: res.data.conversation._id,
        participant: {
          name: res?.data?.conversation?.participant?.name,
          profilePicture: res.data?.conversation?.participant?.profilePicture,
        },
      });
    };

    loadMessages();
  }, [receiverId]);

  //---------------- Join Chat ------------------

  useEffect(() => {
  if (!activeConversation?.id) return;
  socket.emit("chat:join", {
    conversationId: activeConversation.id,
  });

  return () => {
    socket.emit("chat:leave", {
      conversationId: activeConversation.id,
    });
  };
}, [activeConversation?.id]);


  // ---------------- Send Message ---------------- 
  const handleSendMessage = (text) => {
  if (!activeConversation) return;

  socket.emit("message:send", {
    conversationId: activeConversation.id,
    text,
    senderId:id,
    senderModel: role === 'doctor'? 'Doctor' : 'Patient',
    receiverId,
    receiverModel:role === 'doctor' ? 'Patient': 'Doctor'
  });
};

// ----------------- Recieve Message -----------------
useEffect(() => {
  const handleReceiveMessage = (message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === message._id);
      return exists ? prev : [...prev, message];
    });
  };

  socket.on("receiveMessage", handleReceiveMessage);
  return () => {
    socket.off("receiveMessage", handleReceiveMessage);
  };
}, []);


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
            online='Active'
            profilePicture={activeConversation?.participant?.profilePicture}  
          />
          <MessageList messages={messages} userId={id} />
          <MessageInput onSend={handleSendMessage} />
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
