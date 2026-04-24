
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import PDFViewer from "../pdrViewer/PDFViewer";

const MessageList = ({ messages, userId, activeConversationId }) => {
  const bottomRef = useRef(null);

  const filteredMessages = messages.filter(
    (msg) => msg?.conversationId === activeConversationId
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  if (filteredMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-50 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center">
          <Icon icon="mdi:chat-outline" className="w-7 h-7 text-sky-400" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-700">No messages yet</p>
          <p className="text-[12px] text-slate-400 mt-0.5">Start the conversation below.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-slate-50">
      {filteredMessages.map((msg) => {
        const isMe = msg.senderId === userId;
        const timestamp = new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div
            key={msg._id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[75%] sm:max-w-sm lg:max-w-md space-y-1">
              {/* Text bubble */}
              {msg.text && (
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                    isMe
                      ? "bg-sky-500 text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 flex items-center justify-end gap-0.5 ${isMe ? "text-sky-200" : "text-slate-400"}`}>
                    {timestamp}
                    {isMe && (
                      <Icon
                        icon={msg.isRead ? "mdi:check-all" : "mdi:check"}
                        className={`w-3 h-3 ${msg.isRead ? "text-sky-200" : "text-sky-300"}`}
                      />
                    )}
                  </p>
                </div>
              )}

              {/* Files */}
              {msg.files?.map((file, idx) => {
                const isTemp = !!file.localPreview;
                const isProtected = file.isProtected && !isMe;

                const spinner = (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  </div>
                );

                const timestampOverlay = (
                  <span className="absolute bottom-2 right-2 text-[10px] px-1.5 py-0.5 rounded-md bg-black/30 text-white flex items-center gap-0.5">
                    {timestamp}
                    {isMe && <Icon icon={msg.isRead ? "mdi:check-all" : "mdi:check"} className="w-3 h-3" />}
                  </span>
                );

                if (file.resourceType === "image" || (isTemp && (!isProtected || isMe))) {
                  return (
                    <div key={idx} className="relative mt-1 inline-block rounded-xl overflow-hidden shadow-sm">
                      <img
                        src={file.url || file.localPreview}
                        alt={file.name || "image"}
                        className={`max-h-56 w-auto rounded-xl ${isTemp ? "blur-sm opacity-70" : ""}`}
                      />
                      {isTemp ? spinner : timestampOverlay}
                    </div>
                  );
                }

                if (file.resourceType === "video" || isTemp) {
                  return (
                    <div key={idx} className="relative mt-1 inline-block rounded-xl overflow-hidden shadow-sm">
                      <video
                        src={file.url || file.localPreview}
                        controls
                        className={`max-h-56 w-auto rounded-xl ${isTemp ? "blur-sm opacity-70" : ""}`}
                      />
                      {isTemp ? spinner : timestampOverlay}
                    </div>
                  );
                }

                if (file.resourceType === "raw" || isTemp) {
                  return <PDFViewer key={idx} file={file} timestamp={timestamp} isRead={msg.isRead} />;
                }

                return null;
              })}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;