import { useSocket } from "@/context/socket";
import useMediaStream from "@/hooks/useMediaStream";
import usePeer from "@/hooks/usePeer";
import Player from "@/components/Player/Player";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import styles from "@/styles/room.module.css";
import { useRouter } from "next/router";
import Bottom from "@/components/Bottom";
import { cloneDeep } from "lodash";
import CopySection from "@/components/CopySection";

const Room = () => {
  const socket = useSocket();
  const { roomId } = useRouter().query;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    playersNonHighlited,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer);

  const [users, setusers] = useState("");

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    console.log("form [main]");
    const handelUserConnected = (newUser) => {
      console.log(`user connected in room with user id ${newUser}`);

      const call = peer.call(newUser, stream);
      // whenever someone joins the room, we will get their stream
      call.on(`stream`, (incomingStream) => {
        console.log(`incomming stream from ${newUser}`);

        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));

        setusers((prev) => ({
          ...prev,
          [newUser]: call,
        }));
      });
    };
    socket.on(`user-connected`, handelUserConnected);
    return () => {
      socket.off(`user-connected`, handelUserConnected);
    };
  }, [peer, setPlayers, socket, stream]);

  useEffect(() => {
    if (!socket) return;
    const handelToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggle the audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handelToggleVideo = (userId) => {
      console.log(`use toggle video with id ${userId}`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handelUserLeave = (userId) => {
      console.log(`user with user id ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };

    socket.on("user-toggle-audio", handelToggleAudio);
    socket.on("user-toggle-video", handelToggleVideo);
    socket.on("user-leave-room", handelUserLeave);
    return () => {
      socket.off("user-toggle-audio", handelToggleAudio);
      socket.off("user-toggle-video", handelToggleVideo);
      socket.off("user-toggle-video", handelUserLeave);
    };
  }, [players, setPlayers, socket, users]);

  useEffect(() => {
    if (!peer || !stream) return;

    peer.on(`call`, (call) => {
      const { peer: callerId } = call;
      call.answer(stream);
      call.on(`stream`, (incomingStream) => {
        console.log(`incomming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
          },
        }));
        setusers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    console.log(`setting my stream id ${myId}`);

    //setting my own stream here
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: false,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <>
      <div className={styles.highlited}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
          />
        )}
      </div>
      <div className={styles.nonHighlited}>
        {Object.keys(playersNonHighlited).map((playerId) => {
          const { url, muted, playing } = playersNonHighlited[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
      <CopySection roomId={roomId} />
    </>
  );
};

export default Room;
