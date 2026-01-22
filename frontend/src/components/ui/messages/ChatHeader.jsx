import { Icon } from "@iconify/react";


const ChatHeader = ({ name, online, lastSeen,profilePicture }) => {
  return (
    <div className="px-6 py-4 border border-blue-200 rounded-lg bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">

          <img src={profilePicture ? profilePicture : '/profile.png'} className="w-full h-full object-cover"/>
         
        </div>
        <div className="flex-1 min-w-0 p-3">
          <h1 className="text-lg font-semibold text-slate-900 truncate">{name}</h1>
          <p className="text-sm text-slate-500">
            {online ? (
              <span className="flex items-center gap-1">
                Active now
              </span>
            ) : (
              lastSeen
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">         
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Icon icon="mdi:dots-vertical" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
