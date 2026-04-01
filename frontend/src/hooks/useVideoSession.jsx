// import { useSocket } from "@/contexts/SocketContext";
// import { useEffect, useRef, useState } from "react";

// export const useVideoSession = (sessionId, role, stream) => {
//   const { socket } = useSocket();
//   const [streamReady, setStreamReady] = useState(false);
//   const [bothJoined, setBothJoined] = useState(false);
//   const [status, setStatus] = useState("waiting");
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);
//   const [remoteVideoOff, setRemoteVideoOff] = useState(false);
//   const [callDuration, setCallDuration] = useState(0);

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const pcRef = useRef(null);
//   const localStreamRef = useRef(null);

//   //------------ Create peer connection ------------
//   const createPeerConnection = () => {
//     if (!localStreamRef.current) {
//       console.log("Stream not ready yet");
//       return null;
//     }

//     const pc = new RTCPeerConnection();

//     // Add local tracks
//     localStreamRef.current.getTracks().forEach((track) => {
//       pc.addTrack(track, localStreamRef.current);
//     });

//     // Receive remote stream
//     pc.ontrack = (e) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = e.streams[0];
//         remoteVideoRef.current.autoplay = true;
//         remoteVideoRef.current.volume = 1;
//         remoteVideoRef.current.muted = false; // only mute local if needed
//         setStatus("connected"); // update status when remote stream arrives
//       }
//     };

//     //------------ connection state change ------
//     pc.onconnectionstatechange = () => {
//       const state = pc.connectionState;
//       console.log('connection state', state);

//       if(state === 'connected'){
//         setStatus('connected')
//       }

//       if(state === 'disconnected' || state === 'failed'){
//         console.log('connection lost, attempting retry ........');
//         setStatus('reconnecting')
//       }
//     }

//     pc.oniceconnectionstatechange = () => {
//       const state = pc.iceConnectionState;
//       console.log('ICE State',state)
//     }

//     // Handle ICE candidates
//     pc.onicecandidate = (e) => {
//       if (e.candidate) {
//         socket.emit("webrtc:ice-candidate", {
//           sessionId,
//           candidate: e.candidate,
//         });
//       }
//     };

//     return pc;
//   };

//   //--------- replace track ---------------
//   const replaceOutgoingVideoTrack = (newStream) => {
//     if (!pcRef.current) return;

//     const newVideoTrack = newStream.getVideoTracks()[0];
//     if (!newVideoTrack) return;

//     const sender = pcRef.current
//       .getSenders()
//       .find((s) => s.track?.kind === "video");

//     if (sender) {
//       console.log("Replacing video track...");
//       sender.replaceTrack(newVideoTrack);
//     } else {
//       console.log("No sender found yet");
//     }
//   };

//   useEffect(() => {
//     if (!stream || stream.getTracks().length === 0) return;

//     localStreamRef.current = stream;

//     if (localVideoRef.current) {
//       localVideoRef.current.srcObject = stream;
//       localVideoRef.current.autoplay = true;
//       localVideoRef.current.muted = true;
//     }

//     replaceOutgoingVideoTrack(stream);
//     setStreamReady(true);
//   }, [stream]);

//   //---------------- Toggle Mute ----------------
//   const onToggleMute = () => {
//     const audioTrack = localStreamRef.current?.getAudioTracks()[0];

//     if (!audioTrack) return;

//     audioTrack.enabled = !audioTrack.enabled;

//     setIsMuted(!audioTrack.enabled);

//     console.log("Mic enabled:", audioTrack.enabled);
//   };

//   //----------------- Camera toggle -------------------
//   const onToggleCamera = () => {
//     const videoTrack = localStreamRef.current.getVideoTracks()[0];
//     if (!videoTrack) return;

//     videoTrack.enabled = !videoTrack.enabled;

//     const isOff = !videoTrack.enabled;
//     setIsCameraOff(!videoTrack.enabled);

//     //----------- notify the peer ------------
//     socket.emit("consultation:camera-state", {
//       sessionId,
//       isOff,
//     });
//   };

//   //--------------end call -------------------------
//   const endCall = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//     }

//     if (pcRef.current) {
//       pcRef.current.close();
//       pcRef.current = null;
//     }

//     socket.emit("consultation:end", { sessionId });
//     setStatus("ended");
//   };

//   //------------------ Join Socket -----------------
//   useEffect(() => {
//     if (!socket || !streamReady) return;

//     // ---------------- Attach listeners FIRST ----------------
//     socket.on("consultation:both-joined", () => {
//       console.log("both joined");
//       setBothJoined(true);
//       setStatus("connecting");
//     });

//     socket.on("webrtc:offer", async ({ offer }) => {
//       if (role !== "patient") return;

//       pcRef.current = createPeerConnection();
//       if (!pcRef.current) return;

//       await pcRef.current.setRemoteDescription(offer);

//       const answer = await pcRef.current.createAnswer();
//       await pcRef.current.setLocalDescription(answer);

//       // Boost audio bitrate for clearer voice
//       const audioSender = pcRef.current
//         .getSenders()
//         .find((s) => s.track.kind === "audio");
//       if (audioSender) {
//         const params = audioSender.getParameters();
//         if (!params.encodings) params.encodings = [{}];
//         params.encodings[0].maxBitrate = 128_000; // 128 kbps
//         audioSender.setParameters(params);
//       }

//       socket.emit("webrtc:answer", {
//         sessionId,
//         answer,
//       });

//       setStatus("connected");
//     });

//     socket.on("webrtc:answer", async ({ answer }) => {
//       if (role !== "doctor" || !pcRef.current) return;

//       await pcRef.current.setRemoteDescription(answer);
//       setStatus("connected");
//     });

//     socket.on("webrtc:ice-candidate", async ({ candidate }) => {
//       if (pcRef.current && candidate) {
//         try {
//           await pcRef.current.addIceCandidate(candidate);
//         } catch (err) {
//           console.error("Failed to add ICE candidate:", err);
//         }
//       }
//     });

//     socket.on("consultation:end", () => {
//       console.log("Call ended");

//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//       }

//       if (pcRef.current) {
//         pcRef.current.close();
//         pcRef.current = null;
//       }

//       setStatus("ended");
//     });

//     socket.on("consultation:camera-state", ({ isOff }) => {
//       setRemoteVideoOff(isOff);
//     });

//     // ---------------- Emit join AFTER listeners are attached ----------------
//     socket.emit("consultation:join", { sessionId });

//     socket.on("consultation:status-update", (data) => {
//       if (data?.status) {
//         setStatus(data.status);
//       }
//     });

//     // Cleanup
//     return () => {
//       socket.off("consultation:both-joined");
//       socket.off("webrtc:offer");
//       socket.off("webrtc:answer");
//       socket.off("webrtc:ice-candidate");
//       socket.off("consultation:end");
//       socket.off("consultation:camera-state");
//       socket.off("consultation:status-update");
//     };
//   }, [socket, sessionId, streamReady, role]);

//   //---------------- Doctor starts call when both joined -----------------
//   useEffect(() => {
//     if (!bothJoined || !streamReady) return;

//     if (role === "doctor") {
//       pcRef.current = createPeerConnection();
//       if (!pcRef.current) return;

//       const startCall = async () => {
//         const offer = await pcRef.current.createOffer();
//         await pcRef.current.setLocalDescription(offer);

//         // Boost audio bitrate for clearer voice
//         const audioSender = pcRef.current
//           .getSenders()
//           .find((s) => s.track.kind === "audio");
//         if (audioSender) {
//           const params = audioSender.getParameters();
//           if (!params.encodings) params.encodings = [{}];
//           params.encodings[0].maxBitrate = 128_000;
//           audioSender.setParameters(params);
//         }

//         socket.emit("webrtc:offer", {
//           sessionId,
//           offer,
//         });
//       };

//       startCall();
//     }
//   }, [bothJoined, streamReady, role]);

//   useEffect(() => {
//     let interval;

//     if (status === "connected") {
//       interval = setInterval(() => {
//         setCallDuration((prev) => prev + 1);
//       }, 1000);
//     }

//     if (status === "ended") {
//       setCallDuration(0);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [status]);

//   return {
//     status,
//     setStatus,
//     localVideoRef,
//     remoteVideoRef,
//     onToggleMute,
//     onToggleCamera,
//     isMuted,
//     isCameraOff,
//     endCall,
//     remoteVideoOff,
//     callDuration,
//   };
// };


import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useRef, useState } from "react";

export const useVideoSession = (sessionId, role, stream) => {
  const { socket } = useSocket();

  const [streamReady, setStreamReady] = useState(false);
  const [bothJoined, setBothJoined] = useState(false);
  const [status, setStatus] = useState("waiting");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteVideoOff, setRemoteVideoOff] = useState(false);
  const [remoteMuted, setRemoteMuted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  // To prevent multiple renegotiations
  const renegotiatingRef = useRef(false);
  const callStartedRef = useRef(false);

  //------------ Create Peer Connection ------------
  const createPeerConnection = () => {
    if (!localStreamRef.current) {
      console.log("Stream not ready yet");
      return null;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local tracks
    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    // Receive remote stream
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        remoteVideoRef.current.autoplay = true;
        remoteVideoRef.current.volume = 1;
        remoteVideoRef.current.muted = false;
      }
    };

    // Connection state
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log("Connection state:", state);
      if (state === "connected") setStatusSafe("connected");
      if (state === "disconnected" || state === "failed") setStatusSafe("reconnecting");
    };

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      console.log("ICE state:", state);
      if (state === "failed") pc.restartIce();
      if (state === "connected") setStatusSafe("connected");
      if (state === "disconnected") setStatusSafe("reconnecting");
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("webrtc:ice-candidate", {
          sessionId,
          candidate: e.candidate,
        });
      }
    };

    return pc;
  };

  //--------- Replace video track ---------------
  const replaceOutgoingVideoTrack = (newStream) => {
    if (!pcRef.current) return;
    const newVideoTrack = newStream.getVideoTracks()[0];
    if (!newVideoTrack) return;

    const sender = pcRef.current
      .getSenders()
      .find((s) => s.track?.kind === "video");

    if (sender) {
      sender.replaceTrack(newVideoTrack);
    } else {
      pcRef.current.addTrack(newVideoTrack, newStream);
    }
  };

  //------------ Setup local stream ------------
  useEffect(() => {
    if (!stream || stream.getTracks().length === 0) return;

    localStreamRef.current = stream;

    // Apply current mute and camera states to the new stream tracks
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isMuted;
    }
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !isCameraOff;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.autoplay = true;
      localVideoRef.current.muted = true;
    }

    if (pcRef.current) replaceOutgoingVideoTrack(stream);

    setStreamReady(true);
  }, [stream]);

  //------------ Apply mute/camera states to current stream ------------
  useEffect(() => {
    if (!localStreamRef.current) return;

    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !isMuted;
    }

    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !isCameraOff;
    }
  }, [isMuted, isCameraOff]);

  //---------------- Toggle Mute ----------------
  const onToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !newMuted;
      console.log("Audio track enabled:", audioTrack.enabled, "isMuted:", newMuted);
    } else {
      console.log("No audio track found");
    }

    socket.emit("consultation:mute-state", { sessionId, isMuted: newMuted });
  };

  //----------------- Camera toggle -------------------
  const onToggleCamera = () => {
    const newCameraOff = !isCameraOff;
    setIsCameraOff(newCameraOff);

    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !newCameraOff;
    }

    socket.emit("consultation:camera-state", { sessionId, isOff: newCameraOff });
  };

  //---------------- Restart connection (doctor only) -----------------
  const restartConnection = async () => {
    if (!localStreamRef.current || !pcRef.current) return;

    if (renegotiatingRef.current) return;
    renegotiatingRef.current = true;

    try {
      const offer = await pcRef.current.createOffer({ iceRestart: true });
      await pcRef.current.setLocalDescription(offer);
      socket.emit("webrtc:offer", { sessionId, offer });
    } catch (err) {
      console.error("Failed to renegotiate:", err);
    } finally {
      setTimeout(() => (renegotiatingRef.current = false), 500);
    }
  };

  //-------------- End call -------------------------
  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    socket.emit("consultation:end", { sessionId });
    setStatusSafe("ended");
  };

  const statusRef = useRef("waiting");
  const setStatusSafe = (newStatus) => {
    if (statusRef.current !== newStatus) {
      statusRef.current = newStatus;
      setStatus(newStatus);
    }
  };

  //------------------ Socket listeners -----------------
  useEffect(() => {
    if (!socket || !streamReady) return;

    // Socket reconnect logic
    socket.on("disconnect", () => setStatusSafe("reconnecting"));
    socket.on("connect", () => {
      console.log("Socket reconnected");
      socket.emit("consultation:join", { sessionId });
      setStatusSafe("connecting");
    });

    // Call events
    socket.on("consultation:both-joined", async () => {
      setStatusSafe("connecting");

      if (role === "doctor" && !callStartedRef.current) {
        callStartedRef.current = true;
        pcRef.current = createPeerConnection();
        if (!pcRef.current) return;

        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        socket.emit("webrtc:offer", { sessionId, offer });
      }
    });

    socket.on("consultation:user-joined", () => {
      if (role === "doctor") restartConnection();
    });

    socket.on("webrtc:offer", async ({ offer }) => {
      if (role !== "patient") return;

      if (pcRef.current) pcRef.current.close();
      pcRef.current = createPeerConnection();
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(offer);
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("webrtc:answer", { sessionId, answer });
    });

    socket.on("webrtc:answer", async ({ answer }) => {
      if (role !== "doctor" || !pcRef.current) return;
      await pcRef.current.setRemoteDescription(answer);
    });

    socket.on("webrtc:ice-candidate", async ({ candidate }) => {
      if (pcRef.current && candidate) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (err) {
          console.error("Failed to add ICE candidate:", err);
        }
      }
    });

    socket.on("consultation:ended", endCall);
    socket.on("consultation:camera-state", ({ isOff }) => setRemoteVideoOff(isOff));
    socket.on("consultation:mute-state", ({ isMuted }) => setRemoteMuted(isMuted));
    socket.emit("consultation:join", { sessionId });

    return () => {
      socket.off("disconnect");
      socket.off("connect");
      socket.off("consultation:both-joined");
      socket.off("consultation:user-joined");
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:ice-candidate");
      socket.off("consultation:ended");
      socket.off("consultation:camera-state");
      socket.off("consultation:mute-state");
    };
  }, [socket, sessionId, streamReady, role]);

  return {
    status,
    setStatus,
    localVideoRef,
    remoteVideoRef,
    onToggleMute,
    onToggleCamera,
    isMuted,
    isCameraOff,
    endCall,
    remoteVideoOff,
    remoteMuted,
  };
};