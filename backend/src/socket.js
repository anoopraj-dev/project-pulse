import { Server } from "socket.io";
import { sendMessage } from "./controllers/userControllers/messages.controller.js";
import redis from "./config/redis.js";

let io;

const onlineUsers = new Map();

//------------------- INITIALIZE SOCKET --------------------
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    const { userId } = socket.handshake.auth;

    console.log(`Socket connected: ${socket.id}`);

    // Reject connection if userId is missing
    if (!userId) return;

    // Join personal room (used for direct emits)
    socket.join(userId.toString());

    //------------------- TRACK SOCKET PER USER --------------------
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    //------------------- PRESENCE (REDIS) --------------------
    // Add user to Redis online set
    await redis.sadd("online:users", userId.toString());

    // Get full online user list from Redis
    const redisOnlineUsers = await redis.smembers("online:users");

    // Send full presence state to newly connected user
    socket.emit("presence:sync", {
      onlineUsers: Object.fromEntries(
        redisOnlineUsers.map((id) => [id, true])
      ),
    });

    // Notify others that this user is online
    socket.broadcast.emit("presence:online", { userId });

    //------------------- JOIN CHAT ROOM --------------------
    socket.on("chat:join", ({ conversationId }) => {
      if (conversationId) {
        socket.join(conversationId);
      }
    });

    //------------------- SEND MESSAGE --------------------
    socket.on(
      "message:send",
      async ({
        conversationId,
        text,
        senderId,
        senderModel,
        receiverId,
        receiverModel,
      }) => {
        try {
          if (!text) return;

          // Save message and create conversation if needed
          const { message, conversationId: newConversationId } =
            await sendMessage({
              conversationId,
              senderId,
              senderModel,
              receiverId,
              receiverModel,
              text,
            });

          // Ensure sender is in the conversation room
          socket.join(newConversationId);

          // Send message to both sender and receiver rooms
          io.to(senderId).to(receiverId).emit("message:receive", message);

          // Notify sender if conversation was newly created
          socket.emit("conversation:created", {
            conversationId: newConversationId,
          });
        } catch (error) {
          console.error("message:send error", error);
        }
      }
    );

    //------------------- DISCONNECT --------------------
    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);

      const userSockets = onlineUsers.get(userId);
      if (!userSockets) return;

      // Remove socket from user's active sockets
      userSockets.delete(socket.id);

      // If no active sockets remain, mark user offline
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);

        // Remove user from Redis online set
        await redis.srem("online:users", userId.toString());

        // Notify all clients that user went offline
        io.emit("presence:offline", {
          userId,
          lastSeen: Date.now(),
        });
      }
    });
  });
};

//------------------- GET IO INSTANCE --------------------
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
