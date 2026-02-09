import { Icon } from "@iconify/react";
import { useUser } from "../../../contexts/UserContext";

const ChatSidebar = ({ conversations, onSelect, activeConversationId }) => {
  const { id } = useUser();

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) {
      return { type: "empty", text: "No messages yet" };
    }

    if (lastMessage.files?.length) {
      return { type: "attachment", text: "Attachment" };
    }

    if (lastMessage.text) {
      return { type: "text", text: lastMessage.text };
    }

    return { type: "empty", text: "No messages yet" };
  };

  return (
    <div className="flex flex-col h-full rounded-lg">
      {/* Header */}
      <div className="p-5 border-b border-blue-100">
        <div className="flex items-center justify-between p-3">
          <h2 className="text-lg font-semibold text-slate-900">All Chats</h2>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <Icon icon="mdi:new-message" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations?.map((conv) => {
          const unreadCount = conv.unreadCount || 0;
          const isActive = conv._id === activeConversationId;
          const preview = getLastMessagePreview(conv.lastMessage)

          return (
            <div
              key={conv._id}
              className={`p-4 cursor-pointer transition-colors rounded-lg mx-1 border-b border-blue-100
                ${isActive ? "bg-slate-200" : "hover:bg-slate-100"}`}
              onClick={() => onSelect(conv?.participant?._id)}
            >
              <div className="flex items-center gap-3">
                {/* --------------Avatar ---------------*/}
                <div className="relative">
                  <img
                    src={conv.participant?.profilePicture || "/profile.png"}
                    alt="Profile Image"
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  {/* -------- unread count badge -------- */}
                  {unreadCount > 0 && !isActive && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-semibold rounded-full px-2">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">
                      {conv.participant?.name}
                    </h3>
                  </div>

                  <span className="flex items-center gap-1 text-sm text-slate-600 truncate">
                    {/*------ Tick icon (only if sent by loggedin user)----------------- */}
                    {conv.lastMessage?.senderId === id && (
                      <Icon
                        icon="mdi:check"
                        className="w-4 h-4 text-blue-500 flex-shrink-0"
                      />
                    )}

                    {/*----------- Message text ---------------------*/}
                    <span className="flex items-center gap-1 truncate">
                      {preview.type === "attachment" && (
                        <Icon
                          icon="mdi:paperclip"
                          className="w-4 h-4 text-slate-500 flex-shrink-0"
                        />
                      )}

                      <span
                        className={
                          preview.type === "empty"
                            ? "italic text-slate-400"
                            : "truncate"
                        }
                      >
                        {preview.text}
                      </span>
                    </span>

                    {/* ------------ Time --------------------------*/}
                    {conv.lastMessage?.createdAt && (
                      <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">
                        {new Date(
                          conv.lastMessage.createdAt,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
