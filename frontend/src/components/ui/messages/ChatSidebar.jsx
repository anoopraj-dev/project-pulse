// import { Icon } from "@iconify/react";
// import { useUser } from "../../../contexts/UserContext";

// const ChatSidebar = ({ conversations, onSelect, activeConversationId }) => {
//   const { id } = useUser();

//   const getLastMessagePreview = (lastMessage) => {
//     if (!lastMessage) {
//       return { type: "empty", text: "No messages yet" };
//     }

//     if (lastMessage.files?.length) {
//       return { type: "attachment", text: "Attachment" };
//     }

//     if (lastMessage.text) {
//       return { type: "text", text: lastMessage.text };
//     }

//     return { type: "empty", text: "No messages yet" };
//   };

//   return (
//     <div className="flex flex-col h-full rounded-lg">
//       {/* Header */}
//       <div className="p-5 border-b border-blue-100">
//         <div className="flex items-center justify-between p-3">
//           <h2 className="text-lg font-semibold text-slate-900">All Chats</h2>
//           <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
//             <Icon icon="mdi:new-message" className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Conversations List */}
//       <div className="flex-1 overflow-y-auto py-2">
//         {conversations?.map((conv) => {
//           const unreadCount = conv.unreadCount || 0;
//           const isActive = conv._id === activeConversationId;
//           const preview = getLastMessagePreview(conv.lastMessage)

//           return (
//             <div
//               key={conv._id}
//               className={`p-4 cursor-pointer transition-colors rounded-lg mx-1 border-b border-blue-100
//                 ${isActive ? "bg-slate-200" : "hover:bg-slate-100"}`}
//               onClick={() => onSelect(conv?.participant?._id)}
//             >
//               <div className="flex items-center gap-3">
//                 {/* --------------Avatar ---------------*/}
//                 <div className="relative">
//                   <img
//                     src={conv.participant?.profilePicture || "/profile.png"}
//                     alt="Profile Image"
//                     className="w-10 h-10 rounded-full object-cover"
//                   />

//                   {/* -------- unread count badge -------- */}
//                   {unreadCount > 0 && !isActive && (
//                     <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-semibold rounded-full px-2">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex items-center justify-between mb-1">
//                     <h3 className="font-semibold text-sm text-slate-900 truncate">
//                       {conv.participant?.name}
//                     </h3>
//                   </div>

//                   <span className="flex items-center gap-1 text-sm text-slate-600 truncate">
//                     {/*------ Tick icon (only if sent by loggedin user)----------------- */}
//                     {conv.lastMessage?.senderId === id && (
//                       <Icon
//                         icon="mdi:check"
//                         className="w-4 h-4 text-blue-500 flex-shrink-0"
//                       />
//                     )}

//                     {/*----------- Message text ---------------------*/}
//                     <span className="flex items-center gap-1 truncate">
//                       {preview.type === "attachment" && (
//                         <Icon
//                           icon="mdi:paperclip"
//                           className="w-4 h-4 text-slate-500 flex-shrink-0"
//                         />
//                       )}

//                       <span
//                         className={
//                           preview.type === "empty"
//                             ? "italic text-slate-400"
//                             : "truncate"
//                         }
//                       >
//                         {preview.text}
//                       </span>
//                     </span>

//                     {/* ------------ Time --------------------------*/}
//                     {conv.lastMessage?.createdAt && (
//                       <span className="text-xs text-slate-400 ml-auto whitespace-nowrap">
//                         {new Date(
//                           conv.lastMessage.createdAt,
//                         ).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </span>
//                     )}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;


import { Icon } from "@iconify/react";
import { useUser } from "../../../contexts/UserContext";

const ChatSidebar = ({ conversations, onSelect, activeConversationId }) => {
  const { id } = useUser();

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) return { type: "empty", text: "No messages yet" };
    if (lastMessage.files?.length) return { type: "attachment", text: "Attachment" };
    if (lastMessage.text) return { type: "text", text: lastMessage.text };
    return { type: "empty", text: "No messages yet" };
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-[15px] font-semibold text-slate-800">Messages</h2>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors">
          <Icon icon="mdi:square-edit-outline" className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Icon icon="mdi:magnify" className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search conversations…"
            className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
            <Icon icon="mdi:chat-outline" className="w-8 h-8" />
            <p className="text-[13px]">No conversations yet</p>
          </div>
        )}

        {conversations?.map((conv) => {
          const unreadCount = conv.unreadCount || 0;
          const isActive = conv._id === activeConversationId;
          const preview = getLastMessagePreview(conv.lastMessage);

          return (
            <button
              key={conv._id}
              onClick={() => onSelect(conv?.participant?._id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-slate-50 ${
                isActive
                  ? "bg-sky-50 border-l-2 border-l-sky-500"
                  : "hover:bg-slate-50 border-l-2 border-l-transparent"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={conv.participant?.profilePicture || "/profile.png"}
                  alt={conv.participant?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {unreadCount > 0 && !isActive && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-sky-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className={`text-[13px] truncate ${unreadCount > 0 && !isActive ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
                    {conv.participant?.name}
                  </p>
                  {conv.lastMessage?.createdAt && (
                    <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                      {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[12px] text-slate-400 truncate">
                  {conv.lastMessage?.senderId === id && (
                    <Icon icon="mdi:check-all" className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  )}
                  {preview.type === "attachment" && (
                    <Icon icon="mdi:paperclip" className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className={`truncate ${preview.type === "empty" ? "italic text-slate-300" : ""}`}>
                    {preview.text}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;