import React from 'react'
import HeartbeatPulse from '../3D/Heartbeatpulse'

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
  {/* Gradient background */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(140deg, #00131e 0%, #002e45 60%, #003f5c 100%)",
    }}
  />

  {/* Subtle grid overlay */}
  <div
    className="absolute inset-0 opacity-[0.035]"
    style={{
      backgroundImage:
        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
      backgroundSize: "52px 52px",
    }}
  />

  {/* Heartbeat Pulse */}
  <div className="w-[600px] max-w-[90%] relative z-10">
    <HeartbeatPulse />
  </div>
</div>
  )
}

export default PageLoader