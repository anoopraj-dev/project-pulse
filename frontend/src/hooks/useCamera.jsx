
import { useEffect,useState } from "react";

let globalStreamPromise = null;
let globalStream = null;

export const useCamera = () => {
  const [stream, setStream] = useState(globalStream);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (globalStream) {
        setStream(globalStream);
        return;
      }

      if (!globalStreamPromise) {
        globalStreamPromise = navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        }).then((s) => {
          globalStream = s;
          return s;
        });
      }

      const s = await globalStreamPromise;

      if (!cancelled) setStream(s);
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return stream;
};