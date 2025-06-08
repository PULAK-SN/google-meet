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
  const [users, setusers] = useState("");

  const leaveRoom = () => {
    socket.emit(`user-leave-room`, myId, roomId);
    console.log("user leaving room ", roomId);

    //Stop all media tracks before disconnecting
    const localPlayer = players[myId];
    if (localPlayer?.url instanceof MediaStream) {
      localPlayer.url.getTracks().forEach((track) => track.stop());
    }
    peer?.destroy();
    setPlayers({});
    router.push("/");
  };

  const toggleAudio = () => {
    // console.log("I touggle my audio");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].muted = !copy[myId].muted;
      return { ...copy };
    });

    socket.emit("user-toggle-audio", myId, roomId);
  };

  const toggleVideo = () => {
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      const player = copy[myId];

      if (!player) return prev;

      const currentStream = player.url;
      if (player?.playing) {
        // Stop all video tracks to turn off camera
        currentStream?.getVideoTracks().forEach((track) => track.stop());
      } else {
        // Turn video back on
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((newStream) => {
            const newVideoTrack = newStream.getVideoTracks()[0];
            //Stop old video tracks first
            currentStream?.getVideoTracks().forEach((track) => track.stop());
            //Replace track in stream
            currentStream.removeTrack(currentStream.getVideoTracks()[0]);
            currentStream.addTrack(newVideoTrack);
            // DO NOT stop newStream — we need this track alive
            player.url = currentStream;
            copy[myId] = player;
            setPlayers({ ...copy });
            // 👇 Re-call connected peers with the updated stream
            Object.values(users).forEach((call) => {
              const sender = call.peerConnection
                .getSenders()
                .find((s) => s.track?.kind === "video");
              if (sender) sender.replaceTrack(newVideoTrack);
            });
          })
          .catch((err) => {
            console.error("Error accessing camera: ", err);
          });
      }

      player.playing = !player.playing;
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
    users,
    setusers,
  };
};

export default usePlayer;
