import { Icon } from "@iconify/react";

const ActionButton = ({ icon, onClick, danger }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 border ${
      danger
        ? "text-red-600 border-red-200 hover:bg-red-50"
        : "text-slate-700 border-slate-200 hover:bg-white"
    }`}
  >
    <Icon icon={icon} className="w-4 h-4" />
  </button>
);

export default ActionButton;
