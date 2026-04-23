
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

const ChatHeader = ({ name, online, profilePicture }) => {
  return (
    <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-100 shadow-sm">
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={profilePicture || "/profile.png"}
          alt={name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-100"
        />
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
            online ? "bg-emerald-400" : "bg-slate-300"
          }`}
        />
      </div>

      {/* Name + Status */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
          {name}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {online ? "Active now" : "Offline"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <Icon icon="mdi:dots-vertical" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;