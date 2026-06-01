import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";
import { useVideoProcessor } from "@/hooks/useVideoProcessor";
import { useState,useEffect } from "react";
import { socket } from "@/socket";
import toast from "react-hot-toast";
import { useModal } from "@/contexts/ModalContext";
import EndConsultationModal from "@/components/ui/modals/ModalInputs";

const PatientConsultationPage = () => {
  const { id: sessionId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { participants } = state;

  const { openModal } = useModal();

  const [mode, setMode] = useState("none");
  const [bgImage, setBgImage] = useState("/healthcare1.jpg");
  const [isPrescriptionSubmitted, setIsPrescriptionSubmitted] = useState(false);

  const rawStream = useCamera();

  const processedStream = useVideoProcessor(rawStream, mode, bgImage);
  const finalStream = processedStream ?? rawStream;

  const {
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
    countdown,
    startTime,
  } = useVideoSession(sessionId, "patient", finalStream, participants?.startTime);

  // ---------------- LISTEN FOR END REQUESTS ----------------
  useEffect(()=>{
    const handler = ({consultationId}) =>{
      openModal(
        '',
        EndConsultationModal,
        {consultationId}

      )
    }

    socket.on('consultation:end-requested', handler);

    return () => {
      socket.off('consultation:end-requested',handler)
    }
  },[openModal])

  // ---------------- NAVIGATE WHEN CONSULTATION ENDS ----------------
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



  useEffect(() => {
    const handler = () => {
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

      openModal(
        '',
        EndConsultationModal,
        {consultationId: sessionId}
      )
      // await endConsultation(sessionId);
      
      

      // endCall();
      // setStatus("ended");
      // navigate("/patient/appointments");
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
        countdown={countdown}
        startTime={startTime}
      />
    </div>
  );
};

export default PatientConsultationPage;
