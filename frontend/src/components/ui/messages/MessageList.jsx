import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

const MessageList = ({ messages, userId, activeConversationId }) => {
  const bottomRef = useRef(null);

  // Filter messages for active conversation
  const filteredMessages = messages.filter(
    (msg) => msg?.conversationId === activeConversationId,
  );

  console.log(filteredMessages);

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

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs lg:max-w-md`}>
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

                      {/* Timestamp for text */}
                      <p
                        className={`text-xs mt-1 text-right ${
                          isMe ? "text-sky-100" : "text-slate-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}

                  {/* Files */}
                  {msg.files?.map((file, idx) => {
                    const timestamp = new Date(
                      msg.createdAt,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    if (file.resourceType === "image") {
                      return (
                        <div key={idx} className="relative mt-2 inline-block">
                          <img
                            src={file.url}
                            alt={file.name || "uploaded image"}
                            className="rounded-lg max-h-60 w-auto border border-gray-300"
                          />
                          <span className="absolute bottom-2 right-2 text-xs  bg-white/50 px-1 rounded">
                            {timestamp}
                          </span>
                        </div>
                      );
                    } else if (file.resourceType === "video") {
                      return (
                        <div key={idx} className="relative mt-2 inline-block">
                          <video
                            src={file.url}
                            controls
                            className="rounded-lg max-h-60 w-auto border border-gray-300"
                          />
                          <span className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1 rounded">
                            {timestamp}
                          </span>
                        </div>
                      );
                    } else if (file.resourceType === "raw") {
                      return (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 bg-white hover:bg-gray-50"
                        >
                          <Icon
                            icon="mdi:file-document-outline"
                            className="w-5 h-5 text-gray-600"
                          />
                          <span className="text-sm text-gray-800 truncate max-w-[200px]">
                            {file.name || "Document"}
                          </span>
                        </a>
                      );
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
