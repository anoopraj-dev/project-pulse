import { Server } from "socket.io";
import { sendMessage } from "./controllers/userControllers/messages.controller.js";

let io;

//---------------- Initialize Socket -------------------
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    const { userId, role } = socket.handshake.auth;

    if (userId) {
      socket.join(userId.toString());
    }

    if (role) {
      socket.join(`role:${role}`);
    }

// ------------- Join Chat rooms -----------
    socket.on("chat:join", ({ conversationId }) => {
      socket.join(conversationId);
    });

//------------- Send Message -------------
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
          if (!conversationId || !text) return;

          const message = await sendMessage({
            conversationId,
            senderId,
            senderModel,
            receiverId,
            receiverModel,
            text,
          });

          io.to(conversationId).emit("receiveMessage", message);
        } catch (error) {
          console.error("Socket error", error);
        }
      },
    );

    socket.on("disconnect", () => {});
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
