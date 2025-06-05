// is there are two person in the room then
// this players[] array will contain two stream
import { useSocket } from "@/context/socket";
import { cloneDeep, round } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";

const usePlayer = (myId, roomId, peer) => {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const playersCopy = cloneDeep(players);
  const playerHighlighted = playersCopy[myId];
  delete playersCopy[myId];
  const playersNonHighlited = playersCopy;
  const router = useRouter();

  const leaveRoom = () => {
    socket.emit(`user-leave-room`, myId, roomId);
    console.log("user leaving room ", roomId);
    peer?.disconnect();
    router.push("/");
  };

  const toggleAudio = () => {
    console.log("I touggle my audio");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].muted = !copy[myId].muted;
      return { ...copy };
    });

    socket.emit("user-toggle-audio", myId, roomId);
  };

  const toggleVideo = () => {
    console.log("I touggle my video");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].playing = !copy[myId].playing;
      return { ...copy };
    });

    socket.emit("user-toggle-video", myId, roomId);
  };
  return {
    players,
    setPlayers,
    playerHighlighted,
    playersNonHighlited,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};

export default usePlayer;
