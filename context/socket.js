import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connection = io();
    console.log("Socket Connection ", connection);
    setSocket(connection);
  }, []);

  socket?.on("connect_error", async (error) => {
    console.log("Error established");
    await fetch("/api/socket");
  });
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
