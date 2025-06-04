import ReactPlayer from "react-player";
import classNames from "classnames";
import styles from "./player.module.css";

const Player = ({ url, muted, playing, isActive }) => {
  return (
    <div
      className={classNames(styles.playerContainer, {
        [styles.isActive]: isActive,
        [styles.notActive]: !isActive,
      })}
    >
      <ReactPlayer
        url={url}
        muted={true}
        playing={playing}
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default Player;
