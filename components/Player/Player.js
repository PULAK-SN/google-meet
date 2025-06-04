import ReactPlayer from "react-player";
import styles from "./player.module.css";

const Player = ({ url, muted, playing }) => {
  return (
    <div className={styles.videoPlayer}>
      <ReactPlayer url={url} muted={muted} playing={playing} />
      <h1>Video is playing</h1>
    </div>
  );
};

export default Player;
