import { Icon } from "@iconify/react";

const MessageList = ({ messages, userId }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 border border-blue-200 rounded-lg">
      {messages?.length > 0 ? (
        messages.map((msg) => {
          const isMe = msg.senderId === userId;

          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl shadow-sm
                  ${
                    isMe
                      ? "bg-sky-500 text-white rounded-br-sm"
                      : "bg-slate-100 text-slate-900 rounded-bl-sm"
                  }
                `}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>

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
            </div>
          );
        })
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
