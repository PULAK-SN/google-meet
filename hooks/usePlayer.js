import { cloneDeep } from "lodash";
import { useState } from "react";
const usePlayer = (myId) => {
  // is there are two person in the room then
  // this players[] array will contain two stream
  const [players, setPlayers] = useState({});
  const playersCopy = cloneDeep(players);
  const playerHighlighted = playersCopy[myId];
  delete playersCopy[myId];
  const playersNonHighlited = playersCopy;

  return { players, setPlayers, playerHighlighted, playersNonHighlited };
};

export default usePlayer;
