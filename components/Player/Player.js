import ReactPlayer from "react-player";
import classNames from "classnames";
import styles from "./player.module.css";
import { Mic, MicOff, SquareUser } from "lucide-react";
const Player = ({ url, muted, playing, isActive }) => {
  return (
    <div
      className={classNames(styles.playerContainer, {
        [styles.isActive]: isActive,
        [styles.notActive]: !isActive,
      })}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          height="100%"
          width="100%"
        />
      ) : (
        <SquareUser size={isActive ? 400 : 150} />
      )}
      <div className={styles.mic}>
        {!isActive && (muted ? <MicOff size={25} /> : <Mic size={25} />)}
      </div>
    </div>
  );
};

export default Player;
