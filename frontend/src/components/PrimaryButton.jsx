import { forwardRef } from "react";

const PrimaryButton = forwardRef((props, ref) => {
  const { text, children, onClick, className, type = "button", disabled } = props;

  return (
    <button
      ref={ref} 
      className={`mt-5 bg-[#0096C7]  text-white  text-sm sm:text-base md:text-lg lg:text-xl
        px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 font-semibold rounded-md cursor-pointer ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children || text}
    </button>
  );
});

export default PrimaryButton;
