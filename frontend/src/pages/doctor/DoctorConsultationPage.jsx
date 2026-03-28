import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams } from "react-router-dom";

const DoctorConsultationPage = () => {
  const { id: sessionId } = useParams();
  const { state } = useLocation();
  const { participants } = state;
  const { user } = useUser();
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
    callDuration
  } = useVideoSession(sessionId, "doctor", user);

  //------------ End Call -------------
  const handleEndCall = () => {
    endCall();
    setStatus("ended");
  };
  return (
    <div className="border border-blue-500">
      <ConsultationVideo
        status={status}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        onEndCall={handleEndCall}
        onToggleCamera={onToggleCamera}
        onToggleMute={onToggleMute}
        isCameraOff={isCameraOff}
        isMuted={isMuted}
        remoteVideoOff={remoteVideoOff}
        participants={participants}
        callDuration={callDuration}
      />
    </div>
  );
};

export default DoctorConsultationPage;
