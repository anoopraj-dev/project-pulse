const Headings = ({ text, className }) => {
  return (
    <h1 className={`font-primary text-[#2F3E46] text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
        font-bold 
        my-2 sm:my-4 md:my-3 lg:my-10
 ${className || ''}`}>
      {text}
    </h1>
  );
};

export default Headings;
