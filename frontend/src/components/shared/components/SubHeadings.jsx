const SubHeadings = ({ text, className }) => {
  return (
    <h3 className={`text-2xl font-semibold ${className || ''}`}>
      {text}
    </h3>
  );
};

export default SubHeadings;
