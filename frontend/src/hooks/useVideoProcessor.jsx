
import { useEffect, useRef } from "react";
import { getSegmentation } from "@/utilis/segmentation";

export const useVideoProcessor = (inputStream, mode, bgImageSrc) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const segmentationRef = useRef(null);

  const rafRef = useRef(null);
  const stoppedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const modeRef = useRef(mode);
  const processedStreamRef = useRef(null);
  const prevMaskRef = useRef(null);

  const bgImageRef = useRef(null);
  const isTabVisibleRef = useRef(true);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const handleVisibility = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!bgImageSrc) return;

    const img = new Image();
    img.src = bgImageSrc;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, [bgImageSrc]);

  useEffect(() => {
    if (!inputStream) return;

    stoppedRef.current = false;

    // VIDEO
    if (!videoRef.current) {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      videoRef.current = video;
    }

    const video = videoRef.current;
    video.srcObject = inputStream;

    // CANVAS
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext("2d");
    }

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // ----------- segmentation (media pipe) ---------------
    if (!segmentationRef.current) {
      const segmentation = getSegmentation();

      segmentation.onResults((results) => {
        if (!results.image || !canvas.width) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        if (modeRef.current === "none") {
          ctx.drawImage(results.image, 0, 0, width, height);
          ctx.restore();
          return;
        }

        if (modeRef.current === "blur") {
          ctx.filter = "blur(16px) brightness(0.9)";
          ctx.drawImage(results.image, 0, 0, width, height);
          ctx.filter = "none";
        } else if (
          modeRef.current === "image" &&
          bgImageRef.current?.complete
        ) {
          ctx.drawImage(bgImageRef.current, 0, 0, width, height);
        }

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = width;
        tempCanvas.height = height;

        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(results.segmentationMask, 0, 0, width, height);

        if (prevMaskRef.current) {
          tempCtx.globalAlpha = 0.6;
          tempCtx.drawImage(prevMaskRef.current, 0, 0, width, height);
        }

        prevMaskRef.current = tempCanvas;

        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(tempCanvas, 0, 0, width, height);

        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(results.image, 0, 0, width, height);

        ctx.restore();
      });

      segmentationRef.current = segmentation;
    }

    let lastTime = 0;
    const FPS = 15;

    const processFrame = (time) => {
      if (stoppedRef.current) return;

      rafRef.current = requestAnimationFrame(processFrame);

      if (!isTabVisibleRef.current) return;
      if (time - lastTime < 1000 / FPS) return;

      lastTime = time;

      if (
        video.readyState >= 3 &&
        video.videoWidth &&
        video.videoHeight
      ) {
        if (!isProcessingRef.current && segmentationRef.current) {
          isProcessingRef.current = true;

          segmentationRef.current
            .send({ image: video })
            .catch(() => {})
            .finally(() => {
              isProcessingRef.current = false;
            });
        }
      }
    };

    video.onloadeddata = async () => {
      await video.play();

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (!processedStreamRef.current) {
        const stream = canvas.captureStream(FPS);

        processedStreamRef.current = new MediaStream([
          stream.getVideoTracks()[0],
          ...inputStream.getAudioTracks(),
        ]);
      }

      processFrame(0);
    };

    return () => {
      stoppedRef.current = true;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      isProcessingRef.current = false;
    };
  }, [inputStream, bgImageSrc]);

  return processedStreamRef.current;
};