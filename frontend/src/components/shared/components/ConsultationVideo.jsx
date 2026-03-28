import { useUser } from "@/contexts/UserContext";
import { Icon } from "@iconify/react";

const ConsultationVideo = ({
  status,
  localVideoRef,
  remoteVideoRef,
  onEndCall,
  onToggleMute,
  onToggleCamera,
  isMuted,
  isCameraOff,
  remoteVideoOff,
  participants,
  callDuration
}) => {
  const isConnected = status === "connected";

  const { role } = useUser();

  const formattedTime = (seconds)=>{
    const mins = Math.floor(seconds/60);
    const secs = seconds%60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="h-screen w-full bg-[#0a0a0f] relative flex items-center justify-center overflow-hidden rounded-2xl border ">
      {/* ------------ Ambient background glow (visible when no video) --------- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-900/30 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-slate-800/40 blur-[100px]" />
      </div>

      {/*--------------- Remote video ----------------*/}

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          remoteVideoOff ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Overlay when remote camera OFF */}
      {remoteVideoOff && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-slate-900 to-black" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/20">
              <img
                src={
                  role === "patient"
                    ? participants?.doctor?.profilePicture
                    : participants?.patient?.profilePicture
                }
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </>
      )}

      {/* ------------ Status overlay ---------------*/}
      {!isConnected && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 bg-black/40 backdrop-blur-sm">
          {/* Pulsing ring */}
          {(status === "waiting" || status === "connecting") && (
            <div className="relative flex items-center justify-center">
              <span className="absolute w-20 h-20 rounded-full bg-indigo-500/20 animate-ping" />
              <span className="absolute w-14 h-14 rounded-full bg-indigo-500/30 animate-ping [animation-delay:150ms]" />
              <div className="relative w-10 h-10 rounded-full bg-indigo-500/60 flex items-center justify-center">
                <Icon icon="mdi:video-outline" className="text-white text-lg" />
              </div>
            </div>
          )}

          {status === "ended" && (
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <Icon icon="mdi:phone-hangup" className="text-red-400 text-3xl" />
            </div>
          )}

          <div className="text-center">
            <p className="text-white/90 text-lg font-light tracking-wide">
              {status === "waiting" && "Waiting for the other user…"}
              {status === "connecting" && "Connecting your call…"}

              {status === "in-progress" && (
                <div className="absolute top-6 left-6 flex gap-2">
                  {participants.patientJoined && (
                    <span className="text-green-400">P</span>
                  )}
                  {participants.doctorJoined && (
                    <span className="text-green-400">D</span>
                  )}
                </div>
              )}
              {status === "ended" && "Call ended"}
            </p>
            {status !== "ended" && (
              <p className="text-white/40 text-xs mt-1 tracking-widest uppercase">
                Please keep this window open
              </p>
            )}
          </div>
        </div>
      )}

      {/* --------------- topbar participant info-------------- */}
      {isConnected && (
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(16px)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white/80 text-sm font-light tracking-wide">
              Live consultation
            </span>
          </div>
          <div
            className="rounded-2xl px-4 py-2.5 text-white/60 text-sm font-mono"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(16px)",
            }}
          >
            <span className="text-white/80 text-md font-bold tracking-wide">
              {role === "patient"
                ? participants?.doctor?.name
                : participants?.patient?.name}
            </span>
          </div>

          {/* Call timer placeholder */}
          <div
            className="rounded-2xl px-4 py-2.5 text-white/60 text-sm font-mono"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(16px)",
            }}
          >
            {formattedTime(callDuration)}
          </div>
        </div>
      )}

      {/*------------- Local video ------------------*/}
      <div className="absolute bottom-28 right-5 z-10 group">
        <div className="w-44 h-32 rounded-2xl overflow-hidden relative bg-slate-900">
          {/* Always present video */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isCameraOff ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Overlay when camera OFF */}
          {isCameraOff && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-slate-800 to-black" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20">
                  <img
                    src={
                      role === "patient"
                        ? participants?.patient?.profilePicture
                        : participants?.doctor?.profilePicture
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* -------------- Controlls bar -------------------*/}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div
          className="flex items-center gap-3 rounded-2xl px-5 py-3"
          style={{
            background: "rgba(15,15,20,0.75)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Mute */}
          <button
            onClick={onToggleMute}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 ${
                isMuted
                  ? "bg-red-500/80 hover:bg-red-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Icon
                icon={isMuted ? "mdi:microphone-off" : "mdi:microphone"}
                className="text-white text-xl"
              />
            </div>

            <span className="text-[10px] text-white/40 group-hover:text-white/60 tracking-wide">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </button>

          {/* Camera */}
          <button
            onClick={onToggleCamera}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 ${
                isCameraOff
                  ? "bg-red-500/80 hover:bg-red-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Icon
                icon={isCameraOff ? "mdi:video-off" : "mdi:video-outline"}
                className="text-white text-xl"
              />
            </div>

            <span className="text-[10px] text-white/40 group-hover:text-white/60 tracking-wide">
              {isCameraOff ? "Turn On" : "Camera"}
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-10 bg-white/10 mx-1" />

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-14 h-12 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 transition-all duration-150 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Icon icon="mdi:phone-hangup" className="text-white text-xl" />
            </div>
            <span className="text-[10px] text-white/40 group-hover:text-red-400 transition-colors tracking-wide">
              End
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationVideo;
