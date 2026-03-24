import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";

const PatientConsultationPage = () => {
  const {user} = useUser();
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
  } = useVideoSession("SESSION_ID", "patient",user);

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
      />
    </div>
  );
};

export default PatientConsultationPage;
