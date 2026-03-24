
import ConsultationVideo from '@/components/shared/components/ConsultationVideo'
import { useVideoSession } from '@/hooks/useVideoSession';

const DoctorConsultationPage = () => {
    const {status,setStatus,endCall,localVideoRef,remoteVideoRef,onToggleMute,onToggleCamera,isMuted,isCameraOff,remoteVideoOff} = useVideoSession('SESSION_ID','doctor')

    //------------ End Call -------------
    const handleEndCall = () =>{
      endCall();
        setStatus('ended')
    }
  return (
    <div className='border border-blue-500'>
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

        />
    </div>
  )
}

export default DoctorConsultationPage