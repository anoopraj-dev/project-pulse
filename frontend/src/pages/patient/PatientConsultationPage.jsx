import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";
import { useVideoProcessor } from "@/hooks/useVideoProcessor";
import { useState, useRef, useEffect } from "react";
import { endConsultation } from "@/api/patient/patientApis";
import { socket } from "@/socket";
import toast from "react-hot-toast";

const PatientConsultationPage = () => {
  const{id:sessionId} = useParams();
  const {user} = useUser();
  const navigate = useNavigate();
  const {state} = useLocation();
  const {participants} = state;

  const rawStream = useCamera();
  const[mode,setMode] = useState('none');
  const [bgImage,setBgImage] = useState('/healthcare1.jpg')
  const[isPrescriptionSubmitted,setIsPrescriptionSubmitted] = useState(false);
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

  useEffect(()=>{
    socket.on('prescription:submitted',(data)=>{
      if(data.sessionId === sessionId){
        setIsPrescriptionSubmitted(true);
        toast.success('Prescription received!');
      }
    });
    return () =>{
      socket.off('prescription:submitted');
    }
  },[sessionId])

  //-------------- End Call --------------------
  const handleEndCall = async () => {
  if (!isPrescriptionSubmitted) {
    toast.error("Waiting for doctor to submit prescription");
    return;
  }

  try {
    await endConsultation(sessionId);
    endCall();
    setStatus("ended");
    navigate("/patient/appointments");
  } catch (error) {
    console.error(error);
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
