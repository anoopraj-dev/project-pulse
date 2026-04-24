import { Icon } from "@iconify/react";

const ActionButton = ({
  action,
  activeAction,
  onClick,
  icon,
  text,
  loadingText = "Please wait...",
  className = "",
  disabled = false,
}) => {
  const isLoading = activeAction === action;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex w-fit items-center gap-2 px-4 py-2 rounded-xl transition
        text-white
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Icon icon={icon} className="w-5 h-5" />
          {text}
        </>
      )}
    </button>
  );
};

export default ActionButton;
