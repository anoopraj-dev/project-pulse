
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";
import { useSocket } from "../../../contexts/SocketContext";
import { useChatContext } from "../../../contexts/ChatContext";
import ChatLayout from "../../layout/components/ChatLayout";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { getAllMessages, getConversations } from "../../../api/user/userApis";
import { uploadFileToCloudinary } from "../../../utilis/cloudinary";
import {
  generateVideoThumbnail,
  getFileCategory,
} from "../../../utilis/videoThumbnail";

const ChatContainer = () => {
  const { socket, isConnected, onlineUsers } = useSocket();
  const { id: receiverId } = useParams();
  const { role, id } = useUser();
  const navigate = useNavigate();
  const { setTotalUnread } = useChatContext();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
  }, [receiverId, id, role]);

  // ---------------- Conversation Created ----------------
  useEffect(() => {
    const handleConversationCreated = ({ conversationId, conversation }) => {
      setActiveConversation((prev) => ({
        ...prev,
        id: conversationId,
        participant: conversation?.participant,
      }));

      setConversations((prev) => {
        const exists = prev.some((c) => c._id === conversationId);
        if (exists) return prev;
        return [conversation, ...prev];
      });
      forceRefreshChat();
    };

    socket.on("conversation:created", handleConversationCreated);
    return () => socket.off("conversation:created", handleConversationCreated);
  }, [socket]);

  //---------------- Force refresh the chat after first message ---------------
  const forceRefreshChat = async () => {
    if (!receiverId) return;

    const [convRes, msgRes] = await Promise.all([
      getConversations(role),
      getAllMessages(role, receiverId),
    ]);

    setConversations(convRes.data.conversations);

    setMessages(msgRes.data.messages);

    setActiveConversation({
      id: msgRes?.data?.conversation?._id || null,
      participant: msgRes.data.participant,
    });
  };

  // ---------------- Join / Leave Chat ----------------
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
  const handleSendMessage = async ({ text, files }) => {
    if (!receiverId) return;
    if (!text.trim() && (!files || files.length === 0)) return;
    try {
      setIsUploading(true);

      //---------------- temperory message with thumbnail for video ---------------
      const tempFiles = await Promise.all(
        files?.map(async (file) => {
          const category = getFileCategory(file);
          //---------- video files --------------
          if (category === "video") {
            const thumbnail = await generateVideoThumbnail(file);
            return {
              localPreview: thumbnail,
              type: "video",
              resourceType: "video",
              name: file.name,
              isProtected: role !== "doctor",
            };
          }

          //------------- images -----------------
          if (category === "image") {
            return {
              localPreview: URL.createObjectURL(file),
              type: "image",
              resourceType: "image",
              name: file.name,
              isProtected: role !== "doctor",
            };
          }

          //--------------- pdf files ------------------
          if (category === "pdf") {
            return {
              localPreview: URL.createObjectURL(file),
              type: "pdf",
              resourceType: "raw",
              name: file.name,
              isProtected: role !== "doctor",
            };
          }

          //------------- documents ---------------
          return {
            localPreview: URL.createObjectURL(file),
            type: "raw",
            resourceType: "raw",
            name: file.name,
            isProtected: role !== "doctor",
          };
        }),
      );

      //----------------- create temperorry message for preview --------------------
      const tempId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const tempMessage = {
        _id: tempId,
        clientMessageId: tempId,
        conversationId: activeConversation?.id,
        senderId: id,
        text,
        files: tempFiles,
        status: isUploading,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, tempMessage]);

      //-------------------  upload to cloudinary ----------------------
      let uploadedFiles = [];

      if (files && files.length > 0) {
        const filesToUpload = files.filter((f) => f instanceof File);
        if (filesToUpload.length > 0) {
          uploadedFiles = await Promise.all(
            filesToUpload.map((file) => uploadFileToCloudinary(file)),
          );
        }

        // Add already uploaded files (if any)
        const alreadyUploadedFiles = files.filter((f) => !(f instanceof File));
        uploadedFiles = [...alreadyUploadedFiles, ...uploadedFiles];
      }

      const uploadWithProtection = uploadedFiles.map((file) => ({
        ...file,
        isProtected: role !== "doctor",
      }));

      //-------------------- replace temp preview ------------------
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...m, files: uploadedFiles, status: "sent" } : m,
        ),
      );

      socket.emit("message:send", {
        conversationId: activeConversation?.id || null,
        clientMessageId: tempId,
        text,
        files: uploadWithProtection,
        senderId: id,
        senderModel: role === "doctor" ? "Doctor" : "Patient",
        receiverId,
        receiverModel: role === "doctor" ? "Patient" : "Doctor",
      });
    } catch (error) {
      console.error("Message sending failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  // ---------------- Receive Message ----------------
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const isActiveChat = activeConversation?.id === message.conversationId;
      const isFromOtherUser = message.senderId !== id;

      if (isActiveChat && isFromOtherUser) {
        setMessages((prev) =>
          prev.some((m) => m._id === message._id) ? prev : [...prev, message],
        );
      }

      if (isActiveChat) {
        socket.emit("message:read", {
          conversationId: message.conversationId,
        });
      }

      //------------ update sidebar --------------
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

  // ---------------- Mark Messages as Read ----------------
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
  }, [activeConversation?.id, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageRead = ({ conversationId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === conversationId && m.senderId === id
            ? { ...m, isRead: true }
            : m,
        ),
      );
    };

    socket.on("message:read", handleMessageRead);
    return () => socket.off("message:read", handleMessageRead);
  }, [socket, id]);

  //-------------- Total Unread for Global use ---------------

  useEffect(() => {
    const total = conversations.reduce(
      (sum, c) => sum + (c.unreadCount || 0),
      0,
    );

    setTotalUnread(total);
  }, [conversations, setTotalUnread]);

  // ---------------- Reset on Route Change ----------------
  useEffect(() => {
    if (!receiverId) {
      setActiveConversation(null);
      setMessages([]);
    }
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
          <MessageInput
            onSend={handleSendMessage}
            disabled={!isConnected || isUploading}
          />
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