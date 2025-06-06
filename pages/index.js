import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import styles from "@/styles/index.module.css";
import { useState } from "react";
export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createAndJoin = () => {
    const roomId = uuidv4();
    router.push(`/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`);
    else alert("Please enter a valid room id");
  };
  return (
    <div className={styles.homeContainer}>
      <h1>Google meet clone</h1>
      <div className={styles.enterRoom}>
        <input
          type="text"
          placeholder="Enter room id"
          value={roomId}
          onChange={(e) => setRoomId(e.target?.value)}
        />
        <button onClick={joinRoom}>Join room</button>
      </div>
      <span>-------------- OR --------------</span>
      <button onClick={createAndJoin}>Create a new room</button>
    </div>
  );
}
