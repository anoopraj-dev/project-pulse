
import { useEffect, useState } from "react";

let globalStreamPromise = null;
let globalStream = null;
let refCount = 0;

export const useCamera = () => {
  const [stream, setStream] = useState(globalStream);

  useEffect(() => {
    let cancelled = false;
    refCount++;

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
      refCount--;

      //---- stop only when no users ----------
      if (refCount === 0 && globalStream) {
        globalStream.getTracks().forEach((track) => track.stop());
        globalStream = null;
        globalStreamPromise = null;
      }
    };
  }, []);

  return stream;
};