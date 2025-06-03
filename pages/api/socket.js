import { Server } from "socket.io";

const SocketHandeler = (req, res) => {
  console.log("Called API");
  if (res.socket.server.io) {
    console.log("Server is already running");
  } else {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (server) => {
      console.log("server is running");
    });
  }
  res.end();
};

export default SocketHandeler;
