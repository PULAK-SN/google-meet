import { useEffect, useRef, useState } from "react";

const useMediaStream = () => {
  const [state, setState] = useState(null);
  const isStream = useRef(false);

  useEffect(() => {
    let stream;
    if (isStream.current) return;
    isStream.current = true;
    (async function initStream() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Getting your stream");
        setState(stream);
      } catch (error) {
        console.error("Error in media navigator ", error);
      }
    })();
  }, []);
  return { stream: state };
};

export default useMediaStream;
