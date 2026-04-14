import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";
import { useVideoProcessor } from "@/hooks/useVideoProcessor";
import { useState,useEffect } from "react";
import { endConsultation } from "@/api/patient/patientApis";
import { socket } from "@/socket";
import toast from "react-hot-toast";

const PatientConsultationPage = () => {
  const { id: sessionId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { participants } = state;

  const [mode, setMode] = useState("none");
  const [bgImage, setBgImage] = useState("/healthcare1.jpg");
  const [isPrescriptionSubmitted, setIsPrescriptionSubmitted] = useState(false);

  const rawStream = useCamera();

  const processedStream = useVideoProcessor(rawStream, mode, bgImage);
  const finalStream = processedStream ?? rawStream;

  const {
    status,
    setStatus,
    endCall,
    localVideoRef,
    remoteVideoRef,
    onToggleMute,
    onToggleCamera,
    isMuted,
    isCameraOff,
    remoteVideoOff,
    remoteMuted,
  } = useVideoSession(sessionId, "patient", finalStream, user);

  // ----------Navigate when consultation ends ---------------
  useEffect(() => {
    if (status === "ended") {
      navigate("/patient/appointments");
    }
  }, [status, navigate]);

  useEffect(() => {
    socket.on("prescription:submitted", (data) => {
      if (data.sessionId === sessionId) {
        setIsPrescriptionSubmitted(true);
        toast.success("Prescription received!");
      }
    });
    return () => {
      socket.off("prescription:submitted");
    };
  }, [sessionId]);

  socket.on("consultation:user-left", ({ userId }) => {
    toast("Other user left the consultation");

    setStatus("disconnected");
  });

  useEffect(() => {
    const handler = ({ userId }) => {
      toast("Other user left the consultation");
      setStatus("disconnected");
    };

    socket.on("consultation:user-left", handler);

    return () => {
      socket.off("consultation:user-left", handler);
    };
  }, []);

  const handleEndCall = async () => {
    if (!isPrescriptionSubmitted) {
      toast.error("Waiting for doctor to submit prescription");
      return;
    }

    try {
      await endConsultation(sessionId);
      socket.emit("consultation:leave", { sessionId });

      endCall();
      setStatus("ended");
      navigate("/patient/appointments");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Minimum consultation duration not reached",
      );
    }
  };

  return (
    <div className="border border-blue-500">
      <ConsultationVideo
        status={status}
        onEndCall={handleEndCall}
        onToggleMute={onToggleMute}
        onToggleCamera={onToggleCamera}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        isCameraOff={isCameraOff}
        isMuted={isMuted}
        remoteVideoOff={remoteVideoOff}
        remoteMuted={remoteMuted}
        participants={participants}
        mode={mode}
        setMode={setMode}
        setBgImage={setBgImage}
      />
    </div>
  );
};

export default PatientConsultationPage;
