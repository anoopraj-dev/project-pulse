// import { useEffect, useRef } from "react";
// import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

// export const useVideoProcessor = (inputStream, mode, bgImageSrc) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const ctxRef = useRef(null);
//   const segmentationRef = useRef(null);

//   const rafRef = useRef(null);
//   const isProcessingRef = useRef(false);
//   const modeRef = useRef(mode);
//   const processedStreamRef = useRef(null);
//   const prevMaskRef = useRef(null);

//   const bgImageRef = useRef(null);

//   // ---------- KEEP MODE UPDATED ----------
//   useEffect(() => {
//     modeRef.current = mode;
//     console.log(mode);
//   }, [mode]);

//   // ---------- LOAD BACKGROUND IMAGE ONCE ----------
//   useEffect(() => {
//     if (!bgImageSrc) return;

//     const img = new Image();
//     img.src = bgImageSrc;

//     img.onload = () => {
//       console.log("bg image loaded");
//     };

//     bgImageRef.current = img;
//   }, [bgImageSrc]);

//   useEffect(() => {
//     if (!inputStream) return;

//     // ---------- VIDEO ----------
//     if (!videoRef.current) {
//       const video = document.createElement("video");
//       video.muted = true;
//       video.playsInline = true;
//       videoRef.current = video;
//     }

//     const video = videoRef.current;
//     video.srcObject = inputStream;

//     // ---------- CANVAS ----------
//     if (!canvasRef.current) {
//       const canvas = document.createElement("canvas");
//       canvasRef.current = canvas;
//       ctxRef.current = canvas.getContext("2d");
//     }

//     const canvas = canvasRef.current;
//     const ctx = ctxRef.current;

//     // ---------- MEDIAPIPE ----------
//     if (!segmentationRef.current) {
//       const segmentation = new SelfieSegmentation({
//         locateFile: (file) =>
//           `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
//       });

//       segmentation.setOptions({ modelSelection: 1 });

//       segmentation.onResults((results) => {
//         if (!results.image || !canvas.width) return;

//         const width = canvas.width;
//         const height = canvas.height;

//         ctx.save();
//         ctx.clearRect(0, 0, width, height);

//         // ---------- NORMAL ----------
//         if (modeRef.current === "none") {
//           ctx.drawImage(results.image, 0, 0, width, height);
//           ctx.restore();
//           return;
//         }

//         // ---------- STEP 1: DRAW BACKGROUND FIRST ----------
//         if (modeRef.current === "blur") {
//           ctx.filter = "blur(16px) brightness(0.9)";
//           ctx.drawImage(results.image, 0, 0, width, height);
//           ctx.filter = "none";
//         } else if (
//           modeRef.current === "image" &&
//           bgImageRef.current &&
//           bgImageRef.current.complete
//         ) {
//           ctx.drawImage(bgImageRef.current, 0, 0, width, height);
//         }

//         // ---------- STEP 2: CUT OUT PERSON ----------
//         // ---------- CREATE STABLE MASK ----------
//         const tempCanvas = document.createElement("canvas");
//         tempCanvas.width = width;
//         tempCanvas.height = height;
//         const tempCtx = tempCanvas.getContext("2d");

//         // current mask
//         tempCtx.drawImage(results.segmentationMask, 0, 0, width, height);

//         // ---------- TEMPORAL SMOOTHING ----------
//         if (prevMaskRef.current) {
//           tempCtx.globalAlpha = 0.6; // adjust (0.5 - 0.8)
//           tempCtx.drawImage(prevMaskRef.current, 0, 0, width, height);
//         }

//         prevMaskRef.current = tempCanvas;

//         // ---------- USE STABLE MASK ----------
//         ctx.globalCompositeOperation = "destination-out";
//         ctx.drawImage(tempCanvas, 0, 0, width, height);

//         // ---------- STEP 3: DRAW PERSON CLEAN ----------
//         ctx.globalCompositeOperation = "destination-over";
//         ctx.drawImage(results.image, 0, 0, width, height);

//         ctx.restore();
//       });

//       segmentationRef.current = segmentation;
//     }

//     // ---------- FRAME LOOP ----------
//     let lastTime = 0;
//     const FPS = 15;

//     const processFrame = async (time) => {
//       rafRef.current = requestAnimationFrame(processFrame);

//       if (time - lastTime < 1000 / FPS) return;
//       lastTime = time;

//       if (
//         video.readyState >= 3 &&
//         video.videoWidth > 0 &&
//         video.videoHeight > 0
//       ) {
//         try {
//           if (!isProcessingRef.current && segmentationRef.current) {
//             isProcessingRef.current = true;

//             await segmentationRef.current.send({ image: video });

//             isProcessingRef.current = false;
//           }
//         } catch (e) {
//           console.warn("processing error:", e);
//           isProcessingRef.current = false;
//         }
//       }
//     };

//     // ---------- START ----------
//     video.onloadeddata = async () => {
//       await video.play();

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       // create processed stream only once
//       if (!processedStreamRef.current) {
//         const canvasStream = canvas.captureStream(15);

//         const finalStream = new MediaStream([
//           canvasStream.getVideoTracks()[0],
//           ...inputStream.getAudioTracks(),
//         ]);

//         processedStreamRef.current = finalStream;
//       }

//       processFrame(0);
//     };

//     // ---------- CLEANUP ----------
//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);

//       if (segmentationRef.current) {
//         segmentationRef.current.close();
//         segmentationRef.current = null;
//       }

//       isProcessingRef.current = false;
//     };
//   }, [inputStream, bgImageSrc]);

//   return processedStreamRef.current;
// };



import { useEffect, useRef } from "react";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

export const useVideoProcessor = (inputStream, mode, bgImageSrc) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const segmentationRef = useRef(null);

  const rafRef = useRef(null);
  const isProcessingRef = useRef(false);
  const modeRef = useRef(mode);
  const processedStreamRef = useRef(null);
  const prevMaskRef = useRef(null);

  const bgImageRef = useRef(null);

  // ---------- KEEP MODE UPDATED ----------
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // ---------- LOAD BACKGROUND IMAGE ONCE ----------
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

    // ---------- VIDEO ----------
    if (!videoRef.current) {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      videoRef.current = video;
    }
    const video = videoRef.current;
    video.srcObject = inputStream;

    // ---------- CANVAS ----------
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext("2d");
    }
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // ---------- MEDIAPIPE ----------
    if (!segmentationRef.current) {
      const segmentation = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });

      segmentation.setOptions({ modelSelection: 1 });

      segmentation.onResults((results) => {
        if (!results.image || !canvas.width) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        // ---------- NORMAL ----------
        if (modeRef.current === "none") {
          ctx.drawImage(results.image, 0, 0, width, height);
          ctx.restore();
          return;
        }

        // ---------- BACKGROUND ----------
        if (modeRef.current === "blur") {
          ctx.filter = "blur(16px) brightness(0.9)";
          ctx.drawImage(results.image, 0, 0, width, height);
          ctx.filter = "none";
        } else if (
          modeRef.current === "image" &&
          bgImageRef.current &&
          bgImageRef.current.complete
        ) {
          ctx.drawImage(bgImageRef.current, 0, 0, width, height);
        }

        // ---------- CREATE TEMP MASK ----------
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(results.segmentationMask, 0, 0, width, height);

        // ---------- TEMPORAL SMOOTHING ----------
        if (prevMaskRef.current) {
          tempCtx.globalAlpha = 0.6;
          tempCtx.drawImage(prevMaskRef.current, 0, 0, width, height);
        }
        prevMaskRef.current = tempCanvas;

        // ---------- CUT OUT PERSON ----------
        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(tempCanvas, 0, 0, width, height);

        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(results.image, 0, 0, width, height);

        ctx.restore();
      });

      segmentationRef.current = segmentation;
    }

    // ---------- FRAME LOOP ----------
    let lastTime = 0;
    const FPS = 15;

    const processFrame = async (time) => {
      rafRef.current = requestAnimationFrame(processFrame);
      if (time - lastTime < 1000 / FPS) return;
      lastTime = time;

      if (
        video.readyState >= 3 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        if (!isProcessingRef.current && segmentationRef.current) {
          try {
            isProcessingRef.current = true;
            await segmentationRef.current.send({ image: video });
          } catch (e) {
            console.warn("Segmentation error:", e);
          } finally {
            isProcessingRef.current = false;
          }
        }
      }
    };

    // ---------- START ----------
    video.onloadeddata = async () => {
      await video.play();
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (!processedStreamRef.current) {
        const canvasStream = canvas.captureStream(FPS);
        const finalStream = new MediaStream([
          canvasStream.getVideoTracks()[0],
          ...inputStream.getAudioTracks(),
        ]);
        processedStreamRef.current = finalStream;
      }

      processFrame(0);
    };

    // ---------- CLEANUP ----------
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (segmentationRef.current) {
        segmentationRef.current.close();
        segmentationRef.current = null;
      }
      isProcessingRef.current = false;
    };
  }, [inputStream, bgImageSrc]);

  return processedStreamRef.current;
};