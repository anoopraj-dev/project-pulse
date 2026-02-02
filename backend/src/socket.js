import { Server } from "socket.io";
import { sendMessage } from "./controllers/userControllers/messages.controller.js";
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

    console.log(`Socket connected: ${socket.id}`);
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
        console.log(`Socket ${socket.id} joined room ${conversationId}`);
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
        console.log(`Sockets in room ${roomId}:`, socketsInRoom);
      } catch (error) {
        console.error("message:send error", error);
      }
    });

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);

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
