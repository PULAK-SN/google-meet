import { useState } from "react";

const usePlayer = () => {
  // is there are two person in the room then
  // this players[] array will contain two stream
  const [players, setPlayers] = useState({});

  return { players, setPlayers };
};

export default usePlayer;
