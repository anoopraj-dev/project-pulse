import { Icon } from "@iconify/react";

const ChatHeader = ({ name, online, profilePicture }) => {
  return (
    <div className="px-6 py-4 border border-blue-200 rounded-lg bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-cyan-500">
          <img
            src={profilePicture || "/profile.png"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name + Status */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-slate-900 truncate">
            {name}
          </h1>

          <p className="flex items-center gap-2 text-sm text-slate-500">
            {online ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Active now</span>
              </>
            ) : (
              <span>Offline</span>
            )}
          </p>
        </div>

        {/* Menu */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <Icon icon="mdi:dots-vertical" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
