import { useSocket } from "@/context/socket";
import useMediaStream from "@/hooks/useMediaStream";
import usePeer from "@/hooks/usePeer";
import Player from "@/components/Player/Player";
import usePlayer from "@/hooks/usePlayer";
import { useEffect } from "react";
import styles from "@/styles/room.module.css";

const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const { players, setPlayers, playerHighlighted, playersNonHighlited } =
    usePlayer(myId);

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
      });
    };
    socket.on(`user-connected`, handelUserConnected);
    return () => {
      socket.off(`user-connected`, handelUserConnected);
    };
  }, [peer, setPlayers, socket, stream]);

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
    </>
  );
};

export default Room;
