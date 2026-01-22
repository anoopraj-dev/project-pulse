import { Icon } from "@iconify/react";

const ChatSidebar = ({ conversations, onSelect}) => {

  return (
    <div className="flex flex-col h-full rounded-lg">
      {/* Header */}
      <div className="p-5 border-b border-blue-100">
        <div className="flex items-center justify-between p-3">
          <h2 className="text-lg font-semibold text-slate-900">
            All Chats
          </h2>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <Icon icon="mdi:new-message" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations?.map((conv) => (
          <div
            key={conv.conversationId}
            className="p-4 hover:bg-slate-100 cursor-pointer transition-colors rounded-lg mx-1 border-b border-blue-100"
            onClick={()=>onSelect(conv?.participant?._id)}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <img
                src={conv.participant?.profilePicture || "/profile.png"}
                alt='Profile Image'
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-slate-900 truncate">
                    {conv.participant?.name}
                  </h3>

                  <span className="text-xs text-slate-500">
                    {/* optional later */}
                  </span>
                </div>

                <p className="text-sm text-slate-600 truncate">
                  {conv.lastMessage?.text || "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
