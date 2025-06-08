import { Copy } from "lucide-react";
import styles from "@/components/CopySection/index.module.css";
const CopySection = ({ roomId }) => {
  const handleCopy = async (roomId) => {
    try {
      await navigator.clipboard.writeText(roomId);
      alert("Room ID copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy room ID: ", err);
    }
  };

  return (
    <div className={styles.copyContainer}>
      <div className={styles.title}>Copy room id</div>
      <hr />
      <div className={styles.copyContainer_section}>
        <span>{roomId}</span>
        <Copy
          onClick={() => handleCopy(roomId)}
          className={styles.copyIcon}
          values={roomId}
          role="button"
          aria-label="Copy room ID"
        />
      </div>
    </div>
  );
};

export default CopySection;
