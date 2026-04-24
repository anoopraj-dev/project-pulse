import { Server } from "socket.io";
import {
  markConversationAsRead,
  sendMessage,
} from "./controllers/userControllers/messages.controller.js";
import redis from "./config/redis.js";


let io;
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const { userId, role } = socket.handshake.auth;

    if (!userId) return;

    // ---------------- BASIC ROOMS ----------------
    socket.join(userId.toString());
    if (role) socket.join(`role:${role}`);

    // ---------------- TRACK ONLINE USERS ----------------
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // ---------------- PRESENCE (REDIS) ----------------
    await redis.sadd("online:users", userId.toString());
    const redisOnlineUsers = await redis.smembers("online:users");

    socket.emit("presence:sync", {
      onlineUsers: Object.fromEntries(redisOnlineUsers.map((id) => [id, true])),
    });

    socket.broadcast.emit("presence:online", { userId });

    // ---------------- JOIN CHAT ROOM ----------------
    socket.on("chat:join", ({ conversationId }) => {
      if (conversationId) {
        socket.join(conversationId.toString());
      }
    });

    // ---------------- SEND MESSAGE ----------------
    socket.on("message:send", async (payload) => {
      try {
        const {
          conversationId,
          text = "",
          files = [],
          senderId,
          senderModel,
          receiverId,
          receiverModel,
        } = payload;

        if (!text.trim() && files.length === 0) return;

        const {
          senderConversation,
          receiverConversation,
          message,
          conversationId: newConversationId,
          isNewConversation,
        } = await sendMessage({
          conversationId,
          senderId,
          senderModel,
          receiverId,
          receiverModel,
          text,
          files,
        });

        const roomId = newConversationId.toString();

        // -------- FORCE SENDER INTO ROOM --------
        socket.join(roomId);

        // -------- FORCE RECEIVER INTO ROOM --------
        const receiverRoom = io.sockets.adapter.rooms.get(
          receiverId.toString(),
        );

        if (receiverRoom) {
          for (const socketId of receiverRoom) {
            io.sockets.sockets.get(socketId)?.join(roomId);
          }
        }

        // -------- EMIT CONVERSATION CREATED (ONCE) --------
        if (isNewConversation) {
          io.to(senderId.toString()).emit("conversation:created", {
            conversation: senderConversation,
            message,
          });

          io.to(receiverId.toString()).emit("conversation:created", {
            conversation: receiverConversation,
            message,
            senderId,
            receiverId,
          });
        }

        // ---------------- Format message for socket ----------------
        const formattedMessage = {
          ...message.toObject(), // plain JS object
          files:
            message.files?.map((f) => ({
              url: f.url,
              name: f.name,
              size: f.size,
              resourceType: f.resourceType || "image",
            })) || [],
        };

        // -------- EMIT MESSAGE (ROOM-BASED) --------
        io.to(roomId).emit("message:receive", formattedMessage);

        const socketsInRoom = await io.in(roomId).allSockets();
      } catch (error) {
        console.error("message:send error", error);
      }
    });

    socket.on("message:read", async ({ conversationId }) => {
      if (!conversationId) return;

      await markConversationAsRead({ conversationId });
      socket.to(conversationId.toString()).emit("message:read", {
        conversationId,
      });
    });

    //------------ WEBRTC SIGNALING -------------------
    socket.on("consultation:join", async ({ sessionId }) => {
      if (!sessionId) return;

      socket.join(sessionId);

      const clients = io.sockets.adapter.rooms.get(sessionId);
      const count = clients ? clients.size : 0;

      socket.consultationSessionId = sessionId;
      socket.consultattionUserId = userId;

      // ---------- INITIAL CONNECT ----------
      // emit both-joined only when the second user actually joins (prevent repeated events)
      if (count === 2) {
        io.to(sessionId).emit("consultation:both-joined");
      }

      // ---------- notify the other participant ----------
      socket.to(sessionId).emit("consultation:user-joined", {
        userId,
      });
    });


    //------------ offer (caller to receiver) --------
    socket.on("webrtc:offer", ({ sessionId, offer }) => {
      socket.to(sessionId).emit("webrtc:offer", {
        offer,
        from: userId,
      });
    });

    //-------- answer (receiver to caller) ---------
    socket.on("webrtc:answer", ({ sessionId, answer }) => {
      socket.to(sessionId).emit("webrtc:answer", {
        answer,
        from: userId,
      });
    });

    //------------ ice candidate ---------------
    socket.on("webrtc:ice-candidate", ({ sessionId, candidate }) => {
      socket.to(sessionId).emit("webrtc:ice-candidate", {
        candidate,
        from: userId,
      });
    });

    //--------- Camera state sync ------------------
    socket.on("consultation:camera-state", ({ sessionId, isOff }) => {

      if (!sessionId) return;

      socket.to(sessionId).emit("consultation:camera-state", { isOff });
    });

    //---------- Submit prescription ------------
    socket.on("prescription:submitted", ({ sessionId }) => {
      socket.to(sessionId).emit("prescription:submitted", { sessionId });
    });
    
    //--------- End consultation ------------------
    socket.on("consultation:end", ({ sessionId }) => {
      if (!sessionId) return;
      io.to(sessionId).emit("consultation:ended"); 
    });

    //------------ Consultation disconnect/leave -------------
    socket.on('consultation:leave', async ({sessionId}) => {
      if(!sessionId) return ;

      try {
        await leaveConsultationService (sessionId, userId);

        socket.leave(sessionId);

        socket.to(sessionId).emit('consultation:user-left',{
          userId
        })
      } catch (error) {
        console.log('Leave consultation error',error)
      }
    })

    //--------- Mute state sync ------------------
    socket.on("consultation:mute-state", ({ sessionId, isMuted }) => {
      if (!sessionId) return;

      socket.to(sessionId).emit("consultation:mute-state", { isMuted });
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", async () => {

      const userSockets = onlineUsers.get(userId);
      if (!userSockets) return;

      userSockets.delete(socket.id);

      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
        await redis.srem("online:users", userId.toString());

        io.emit("presence:offline", {
          userId,
          lastSeen: Date.now(),
        });
      }
    });
  });
};

// ---------------- GET IO INSTANCE ----------------
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
