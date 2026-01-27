import React, { useEffect, useState } from "react";
import { getDeviceTypes } from "../../../utilis/deviceTypes";

const ChatLayout = ({ sidebar, children, isChatOpen }) => {
  const [deviceType, setDeviceType] = useState(
    getDeviceTypes(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceTypes(window.innerWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = deviceType === "desktop";

  return (
    <div className="flex mt-1 h-[calc(100vh-80px)] bg-slate-50 p-4 lg:p-10 gap-3">
      
      {/* Sidebar */}
      {(isDesktop || !isChatOpen) && (
        <div
          className={`bg-white/95 backdrop-blur-sm border-r border-blue-200 rounded-lg shadow-sm
            ${isDesktop ? "w-80" : "w-full"}
          `}
        >
          {sidebar}
        </div>
      )}

      {/* Chat Area */}
      {(isDesktop || isChatOpen) && (
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm rounded-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
