import { forwardRef } from "react";

const PrimaryButton = forwardRef(
  (
    {
      text,
      children,
      onClick,
      className = "",
      type = "button",
      disabled = false,
      loading = false,
      size = "md", // sm | md | lg
      fullWidth = false,
      icon,
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm sm:text-base",
      lg: "px-6 py-3 text-base sm:text-lg",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center gap-2
          rounded-lg font-semibold
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0096C7]/60
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : "w-auto"}
          ${isDisabled ? "opacity-70 cursor-not-allowed" : "hover:brightness-110 active:scale-[0.98]"}
          bg-[#0096C7] text-white
          ${className}
        `}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && !loading && icon}
        <span>{children || text}</span>
      </button>
    );
  }
);


export default PrimaryButton;
