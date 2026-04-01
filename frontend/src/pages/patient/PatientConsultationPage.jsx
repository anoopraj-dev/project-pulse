import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";
import { useVideoProcessor } from "@/hooks/useVideoProcessor";
import { useState, useRef, useEffect } from "react";
import { endConsultation } from "@/api/patient/patientApis";

const PatientConsultationPage = () => {
  const{id:sessionId} = useParams();
  const {user} = useUser();
  const navigate = useNavigate();
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("PatientConsultationPage render count:", renderCount.current);
  const {state} = useLocation();
  const {participants} = state;

  const rawStream = useCamera();
  const[mode,setMode] = useState('none');
  const [bgImage,setBgImage] = useState('/healthcare1.jpg')

  const processedStream = useVideoProcessor(
    rawStream,
    mode,
    bgImage
  )
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
  } = useVideoSession(sessionId, "patient", processedStream || rawStream,user);

  // Navigate when consultation ends
  useEffect(() => {
    if (status === "ended") {
      navigate("/patient/appointments");
    }
  }, [status, navigate]);

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      if (rawStream) {
        rawStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [rawStream]);

  //-------------- End Call --------------------
  const handleEndCall = async () => {
    try {
      // Call API to end consultation
      await endConsultation(sessionId);

      // End the video call
      endCall();
      setStatus("ended");

      // Navigate back to appointments or dashboard
      navigate("/patient/appointments");
    } catch (error) {
      console.error("Error ending consultation:", error);
      // Still end the call even if API fails
      endCall();
      setStatus("ended");
      navigate("/patient/appointments");
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
