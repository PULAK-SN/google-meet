import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

const usePeer = () => {
  const socket = useSocket();
  const isPeer = useRef(false);
  const roomId = useRouter().query.roomId;
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    if (isPeer.current || !roomId || !socket) return;
    isPeer.current = true;

    const myPeer = new Peer();
    setPeer(myPeer);
    myPeer.on("open", (id) => {
      // console.log(`your peer id is ${id}`);
      setMyId(id);
      socket?.emit(`join-room`, roomId, id);
    });
  }, [roomId, socket]);

  return { peer, myId };
};

export default usePeer;
