import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import PDFViewer from "../pdrViewer/PDFViewer";

const MessageList = ({ messages, userId, activeConversationId }) => {
  const bottomRef = useRef(null);

  // Filter messages for active conversation
  const filteredMessages = messages.filter(
    (msg) => msg?.conversationId === activeConversationId,
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [filteredMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 border border-blue-200 rounded-lg">
      {filteredMessages?.length > 0 ? (
        <>
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
                <div className="max-w-xs lg:max-w-md relative">
                  {/* Text */}
                  {msg.text && (
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                        isMe
                          ? "bg-sky-500 text-white rounded-br-sm"
                          : "bg-slate-100 text-slate-900 rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>

                      {/* Timestamp + tick for sender, timestamp for receiver */}
                      <p
                        className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                          isMe ? "text-blue-100" : "text-slate-500"
                        }`}
                      >
                        {timestamp}
                        {isMe && <Icon icon="mdi:check" className="w-3 h-3" />}
                      </p>
                    </div>
                  )}

                  {/* Files */}
                  {msg.files?.map((file, idx) => {
                    const isTemp = !!file.localPreview;
                    const isProtected = file.isProtected && !isMe;

                    // Spinner overlay for temp files
                    const spinner = (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                      </div>
                    );

                    // Image
                    if (file.resourceType === "image" || (isTemp && (!isProtected || isMe))) {
                      return (
                        <div key={idx} className="relative mt-2 inline-block">
                          <img
                            src={file.url || file.localPreview}
                            alt={file.name || "uploaded image"}
                            className={`rounded-lg max-h-60 w-auto border border-gray-300 ${
                              isTemp ? "blur-sm opacity-80" : ""
                            }`}
                          />
                          {isTemp && spinner}
                          {!isTemp && (
                            <span className={`absolute bottom-2 right-2 text-xs px-1 rounded flex items-center gap-1 ${
                              isMe ? "bg-white/50 text-gray-500" : "bg-white/50 text-slate-500"
                            }`}>
                              {timestamp}
                              {isMe && <Icon icon="mdi:check" className="w-3 h-3" />}
                            </span>
                          )}
                        </div>
                      );
                    }

                    // Video
                    else if (file.resourceType === "video" || isTemp) {
                      return (
                        <div key={idx} className="relative mt-2 inline-block">
                          <video
                            src={file.url || file.localPreview}
                            controls
                            className={`rounded-lg max-h-60 w-auto border border-gray-300 ${
                              isTemp ? "blur-sm opacity-80" : ""
                            }`}
                          />
                          {isTemp && spinner}
                          {!isTemp && (
                            <span className={`absolute bottom-2 right-2 text-xs px-1 rounded flex items-center gap-1 ${
                              isMe ? "bg-white/50 text-white" : "bg-white/50 text-white"
                            }`}>
                              {timestamp}
                              {isMe && <Icon icon="mdi:check" className="w-3 h-3" />}
                            </span>
                          )}
                        </div>
                      );
                    }

                    // Document / PDF
                    else if (file.resourceType === "raw" || isTemp) {
                      return <PDFViewer key={idx} file={file} timestamp={timestamp} />;
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            );
          })}

          {/* Invisible anchor for scroll */}
          <div ref={bottomRef} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center">
              <Icon icon="mdi:chat-outline" className="w-7 h-7 text-sky-500" />
            </div>

            <h2 className="text-lg font-semibold text-slate-800">
              No messages yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start a conversation to begin chatting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
