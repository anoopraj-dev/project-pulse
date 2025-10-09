import { forwardRef } from "react";

const PrimaryButton = forwardRef((props, ref) => {
  const { text, onClick, className, type = "button", disabled } = props;

  return (
    <button
      ref={ref} 
      className={`mt-5 bg-[#0096C7]  text-white text-xl p-4 font-semibold rounded-md cursor-pointer ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
});

export default PrimaryButton;
