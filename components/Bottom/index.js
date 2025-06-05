import classNames from "classnames";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import styles from "@/components/Bottom/index.module.css";
const Bottom = (props) => {
  const { muted, playing, toggleAudio, toggleVideo, leaveRoom } = props;
  return (
    <div className={styles.controlPanel}>
      {muted ? (
        <MicOff
          className={classNames(styles.icon)}
          onClick={toggleAudio}
          size={55}
        />
      ) : (
        <Mic
          className={classNames(styles.icon, styles.active)}
          onClick={toggleAudio}
        />
      )}
      {playing ? (
        <Video
          className={classNames(styles.icon, styles.active)}
          onClick={toggleVideo}
        />
      ) : (
        <VideoOff onClick={toggleVideo} className={classNames(styles.icon)} />
      )}
      <PhoneOff className={classNames(styles.icon)} onClick={leaveRoom} />
    </div>
  );
};

export default Bottom;
