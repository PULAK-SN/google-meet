import { Server } from "socket.io";

const SocketHandeler = (req, res) => {
  console.log("Called API");
  if (res.socket.server.io) {
    console.log("Server is already running");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("server is running");

      socket.on(`join-room`, (roomId, userId) => {
        console.log(`a news user ${userId} join room ${roomId}`);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit(`user-connected`, userId);
      });

      socket.on(`user-toggle-audio`, (userId, roomId) => {
        console.log("user toggle the audio ==> socketAPI");
        socket.join(roomId);
        socket.broadcast.to(roomId).emit(`user-toggle-audio`, userId);
      });

      socket.on(`user-toggle-video`, (userId, roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit(`user-toggle-video`, userId);
      });
      socket.on(`user-leave-room`, (userId, roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit(`user-leave-room`, userId);
      });
    });
  }
  res.end();
};

export default SocketHandeler;
