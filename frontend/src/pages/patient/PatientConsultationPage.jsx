import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams } from "react-router-dom";

const PatientConsultationPage = () => {
  const{id:sessionId} = useParams();
  const {user} = useUser();
  const {state} = useLocation();
  const {participants} = state
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
  } = useVideoSession(sessionId, "patient",user);

  //-------------- End Call --------------------
  const handleEndCall = () => {
    endCall();
    setStatus("ended");
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
        participants={participants}
        callDuration={callDuration}
     
      />
    </div>
  );
};

export default PatientConsultationPage;
