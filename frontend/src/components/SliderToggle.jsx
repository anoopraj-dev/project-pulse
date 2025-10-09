const SliderToggle = ({ isChecked, onToggle }) => {
  const handleChange = (e) => {
    onToggle(e.target.checked);
  };

  return (
       <label className="relative inline-block w-52 h-12 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="peer sr-only"
      />

      {/* Slider track */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0096C7]  to-sky-600 rounded-full flex items-center justify-between px-5 text-white font-semibold text-sm">
        <span className={`${!isChecked ? "opacity-100" : "opacity-50"} transition-opacity duration-300`}>
          Doctor
        </span>
        <span className={`${isChecked ? "opacity-100" : "opacity-50"} transition-opacity duration-300`}>
          Patient
        </span>
      </div>

      {/* Knob */}
      <div
        className={`absolute top-1 left-1 w-24 h-10 rounded-full border-2 border-white bg-white shadow-md transition-transform duration-300 z-10
          ${isChecked ? "translate-x-[105px]" : "translate-x-0"}`}
      ></div>
    </label>
  );
};

export default SliderToggle;
