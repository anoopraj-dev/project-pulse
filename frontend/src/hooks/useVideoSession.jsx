import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useRef, useState } from "react";

export const useVideoSession = (sessionId, role, stream) => {
  const { socket } = useSocket();

  const [streamReady, setStreamReady] = useState(false);
  const [status, setStatus] = useState("waiting");

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [remoteVideoOff, setRemoteVideoOff] = useState(false);
  const [remoteMuted, setRemoteMuted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  const remoteStreamRef = useRef(null);

  const callStartedRef = useRef(false);
  const isReconnectingRef = useRef(false);

  const statusRef = useRef("waiting");

  const setStatusSafe = (s) => {
    if (statusRef.current !== s) {
      statusRef.current = s;
      setStatus(s);
    }
  };

  // ---------------- CLEAN PEER CONNECTION ----------------
  const closePC = () => {
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.oniceconnectionstatechange = null;

      pcRef.current.close();
      pcRef.current = null;
    }
  };

  // ---------------- CREATE PEER CONNECTION ----------------
  const createPeerConnection = () => {
    if (!localStreamRef.current) return null;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local tracks once
    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.ontrack = (e) => {
      const [stream] = e.streams;
      if (!stream) return;

      remoteStreamRef.current = stream;

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;

      if (state === "connected") {
        setStatusSafe("connected");
      }

      if (state === "disconnected" || state === "failed") {
        setStatusSafe("reconnecting");
      }
    };

    pc.oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;

      if (state === "failed") {
        rebuildConnection();
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("webrtc:ice-candidate", {
          sessionId,
          candidate: e.candidate,
        });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ---------------- REBUILD CONNECTION ----------------
  const rebuildConnection = async () => {
    if (isReconnectingRef.current) return;
    isReconnectingRef.current = true;

    let pc = pcRef.current;

    if (!pc) {
      pc = createPeerConnection();
    }

    if (!pc) {
      isReconnectingRef.current = false;
      return;
    }

    try {
      const offer = await pc.createOffer({ iceRestart: true });
      await pc.setLocalDescription(offer);

      socket.emit("webrtc:offer", { sessionId, offer });
    } catch (err) {
      console.error("Rebuild failed:", err);
    }

    isReconnectingRef.current = false;
  };
  // ---------------- STREAM SETUP ----------------
  useEffect(() => {
    if (!stream || stream.getTracks().length === 0) return;

    if (localStreamRef.current === stream) return;
    localStreamRef.current = stream;

    const audio = stream.getAudioTracks()[0];
    if (audio) audio.enabled = !isMuted;

    const video = stream.getVideoTracks()[0];
    if (video) video.enabled = !isCameraOff;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.muted = true;
    }

    setStreamReady(true);
  }, [stream]);

  // ---------------- TOGGLES ----------------
  const onToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);

    const track = localStreamRef.current?.getAudioTracks()[0];
    if (track) track.enabled = !next;

    socket.emit("consultation:mute-state", {
      sessionId,
      isMuted: next,
    });
  };

  const onToggleCamera = () => {
    const next = !isCameraOff;
    setIsCameraOff(next);

    const track = localStreamRef.current?.getVideoTracks()[0];
    if (track) track.enabled = !next;

    socket.emit("consultation:camera-state", {
      sessionId,
      isOff: next,
    });
  };

  const endCall = () => {
    try {
      //---------- stop all media --------
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        localStreamRef.current = null;
      }

      if (localVideoRef.current) {
        localVideoRef.current.pause();
        localVideoRef.current.srcObject = null;
        localVideoRef.current.load();
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.pause();
        remoteVideoRef.current.srcObject = null;
        remoteVideoRef.current.load();
      }

      //------------ clear tracks ----------
      if (pcRef.current) {
        pcRef.current.getSenders().forEach((sender) => {
          if (sender.track) {
            sender.track.stop();
          }
        });
      }

      //------------ clear remote feed ------------
      if (remoteVideoRef.current?.srcObject) {
        remoteVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }

      //-------- close peer connection -----------
      closePC();

      setStatusSafe("ended");
      setIsMuted(false);
      setIsCameraOff(false);
      setRemoteMuted(false);
      setRemoteVideoOff(false);

      callStartedRef.current = false;
      isReconnectingRef.current = false;
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  // ---------------- SOCKET ----------------
  useEffect(() => {
    if (!socket || !streamReady) return;

    socket.on("disconnect", () => {
      setStatusSafe("reconnecting");
    });

    socket.on("connect", async () => {
      callStartedRef.current = false;
      closePC();

      socket.emit("consultation:join", { sessionId });
      setStatusSafe("connecting");

      // doctor restart
      if (role === "doctor") {
        const pc = createPeerConnection();
        if (!pc) return;

        const offer = await pc.createOffer({ iceRestart: true });
        await pc.setLocalDescription(offer);

        socket.emit("webrtc:offer", { sessionId, offer });
      }
    });

    socket.on("consultation:both-joined", async () => {
      setStatusSafe("connecting");

      if (role === "doctor" && !callStartedRef.current) {
        callStartedRef.current = true;

        const pc = createPeerConnection();
        if (!pc) return;

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("webrtc:offer", { sessionId, offer });
      }
    });

    socket.on("consultation:user-joined", async () => {
      if (role !== "doctor") return;
      callStartedRef.current = false;
      closePC();

      const pc = createPeerConnection();
      if (!pc) return;

      const offer = await pc.createOffer({ iceRestart: true });
      await pc.setLocalDescription(offer);

      socket.emit("webrtc:offer", { sessionId, offer });
    });

    socket.on("webrtc:offer", async ({ offer }) => {
      if (role !== "patient") return;

      if (!pcRef.current) {
        createPeerConnection();
      }

      const pc = pcRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc:answer", { sessionId, answer });
    });

    socket.on("webrtc:answer", async ({ answer }) => {
      if (role !== "doctor") return;
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(answer);
    });

    socket.on("webrtc:ice-candidate", async ({ candidate }) => {
      try {
        if (pcRef.current && candidate) {
          await pcRef.current.addIceCandidate(candidate);
        }
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    socket.on("consultation:ended", () => {
      endCall();
    });

    socket.on("consultation:camera-state", ({ isOff }) =>
      setRemoteVideoOff(isOff),
    );

    socket.on("consultation:mute-state", ({ isMuted }) =>
      setRemoteMuted(isMuted),
    );

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

      closePC();
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
    remoteVideoOff,
    remoteMuted,
    endCall,
  };
};
