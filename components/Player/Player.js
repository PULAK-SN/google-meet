import ReactPlayer from "react-player";
import styles from "./player.module.css";

const Player = ({ playerId, url, muted, playing }) => {
  return (
    <div className={styles.videoPlayer}>
      <ReactPlayer
        key={playerId}
        url={url}
        muted={muted}
        playing={playing}
        width="100%"
        height="100%"
      />
      <h1>Video is playing</h1>
      {console.log("video is playing")}
    </div>
  );
};

export default Player;
