const Subtext = ({ text, className }) => {
  return (
    <p className={`text-[#6C757D] text-xl ${className || ''}`}>
      {text}
    </p>
  );
};

export default Subtext;
