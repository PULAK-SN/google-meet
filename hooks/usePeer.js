import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

const usePeer = () => {
  const isPeer = useRef(false);

  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    if (isPeer.current) return;
    isPeer.current = true;
    const myPeer = new Peer();
    setPeer(myPeer);
    myPeer.on("open", (id) => {
      console.log(`your peer id is ${id}`);
      setMyId(id);
    });
  }, []);

  return { peer, myId };
};

export default usePeer;
