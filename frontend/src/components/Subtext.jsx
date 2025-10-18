const Subtext = ({ text, className }) => {
  return (
    <p className={`text-[#6C757D] text-base sm:text-lg md:text-xl lg:text-2xl
        leading-snug sm:leading-normal md:leading-relaxed ${className || ''}`}>
      {text}
    </p>
  );
};

export default Subtext;
