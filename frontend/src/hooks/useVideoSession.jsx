import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useRef, useState } from "react";

export const useVideoSession = (sessionId, role) => {
  const { socket } = useSocket();
  const [streamReady, setStreamReady] = useState(false);
  const [bothJoined, setBothJoined] = useState(false);
  const [status, setStatus] = useState("waiting");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [remoteVideoOff, setRemoteVideoOff] = useState(false);
  const [callDuration,setCallDuration] = useState(0)

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);

  //------------ Create peer connection ------------
  const createPeerConnection = () => {
    if (!localStreamRef.current) {
      console.log("Stream not ready yet");
      return null;
    }

    const pc = new RTCPeerConnection();

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
        remoteVideoRef.current.muted = false; // only mute local if needed
        setStatus("connected"); // update status when remote stream arrives
      }
    };

    // Handle ICE candidates
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

  //--------------- Start camera -------------
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100,
            channelCount: 1,
          },
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.autoplay = true;
          localVideoRef.current.muted = true; // mute local preview
        }

        setStreamReady(true);
      } catch (error) {
        console.log("Camera Error:", error);
      }
    };

    startCamera();
  }, []);

  //---------------- Toggle Mute ----------------
  const onToggleMute = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setIsMuted(!audioTrack.enabled);

    console.log("Mic enabled:", audioTrack.enabled);
  };

  //----------------- Camera toggle -------------------
  const onToggleCamera = () => {
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    const isOff = !videoTrack.enabled;
    setIsCameraOff(!videoTrack.enabled);

    //----------- notify the peer ------------
    socket.emit("consultation:camera-state", {
      sessionId,
      isOff,
    });
  };

  //--------------end call -------------------------
  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    socket.emit("consultation:end", { sessionId });
    setStatus("ended");
  };

  //------------------ Join Socket -----------------
  useEffect(() => {
    if (!socket || !streamReady) return;

    // ---------------- Attach listeners FIRST ----------------
    socket.on("consultation:both-joined", () => {
      console.log("both joined");
      setBothJoined(true);
      setStatus("connecting");
    });

    socket.on("webrtc:offer", async ({ offer }) => {
      if (role !== "patient") return;

      pcRef.current = createPeerConnection();
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(offer);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      // Boost audio bitrate for clearer voice
      const audioSender = pcRef.current
        .getSenders()
        .find((s) => s.track.kind === "audio");
      if (audioSender) {
        const params = audioSender.getParameters();
        if (!params.encodings) params.encodings = [{}];
        params.encodings[0].maxBitrate = 128_000; // 128 kbps
        audioSender.setParameters(params);
      }

      socket.emit("webrtc:answer", {
        sessionId,
        answer,
      });

      setStatus("connected");
    });

    socket.on("webrtc:answer", async ({ answer }) => {
      if (role !== "doctor" || !pcRef.current) return;

      await pcRef.current.setRemoteDescription(answer);
      setStatus("connected");
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

    socket.on("consultation:end", () => {
      console.log("Call ended");

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      setStatus("ended");
    });

    socket.on("consultation:camera-state", ({ isOff }) => {
      setRemoteVideoOff(isOff);
    });

    // ---------------- Emit join AFTER listeners are attached ----------------
    socket.emit("consultation:join", { sessionId });

    socket.on('consultation:status-update',(data)=>{
      if(data?.status){
        setStatus(data.status)
      }
    })

    // Cleanup
    return () => {
      socket.off("consultation:both-joined");
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:ice-candidate");
      socket.off("consultation:end");
      socket.off("consultation:camera-state");
      socket.off('consultation:status-update')
    };
  }, [socket, sessionId, streamReady, role]);

  //---------------- Doctor starts call when both joined -----------------
  useEffect(() => {
    if (!bothJoined || !streamReady) return;

    if (role === "doctor") {
      pcRef.current = createPeerConnection();
      if (!pcRef.current) return;

      const startCall = async () => {
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        // Boost audio bitrate for clearer voice
        const audioSender = pcRef.current
          .getSenders()
          .find((s) => s.track.kind === "audio");
        if (audioSender) {
          const params = audioSender.getParameters();
          if (!params.encodings) params.encodings = [{}];
          params.encodings[0].maxBitrate = 128_000; // 128 kbps
          audioSender.setParameters(params);
        }

        socket.emit("webrtc:offer", {
          sessionId,
          offer,
        });
      };

      startCall();
    }
  }, [bothJoined, streamReady, role]);

  useEffect(()=> {
    let interval;

    if(status === 'connected'){
      setInterval(()=>{
        setCallDuration(prev=>prev+1)
      },1000)
    }

    if(status === 'ended'){
      setCallDuration(0)
    }

    return(()=>{
      if(interval) clearInterval(interval)
    })
  },[status])

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
    callDuration
  };
};
