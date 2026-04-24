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
      size = "md", // sm | md | lg
      fullWidth = false,
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm sm:text-base",
      lg: "px-6 py-3 text-base sm:text-lg",
    };

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          rounded-lg font-semibold
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0096C7]/60
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : "w-auto"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-110 active:scale-[0.98]"}
          bg-[#0096C7] text-white
          ${className}
        `}
      >
        {children || text}
      </button>
    );
  }
);

export default PrimaryButton;
