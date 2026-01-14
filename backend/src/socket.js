
import {Server} from 'socket.io'


let io;
export const initSocket = (server) => {
 io = new Server( server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET','POST'],
        credentials: true
    }
})
   io.on("connection", (socket) => {
  console.log("Socket initialized", socket.id);

  const { userId, role } = socket.handshake.auth;


  if (userId) {
    socket.join(userId.toString());
  
  }

  if (role) {
    socket.join(`role:${role}`);
  }

  socket.on("disconnect", () => {});
});


}

export const getIO = () =>{
    if(!io) throw new Error('Socket not initialized');
    return io;
}




