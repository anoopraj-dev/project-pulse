const SliderToggle = ({ isChecked, onToggle }) => {
  const handleChange = (e) => {
    onToggle(e.target.checked);
  };

  return (
    <label className="relative inline-block w-14 h-8 mx-5 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        className="peer sr-only"
      />

      {/* Slider track */}
      <div className="w-full h-full bg-gray-300 rounded-full transition-colors duration-300 peer-checked:bg-blue-500"></div>

      {/* Slider knob */}
      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></div>
    </label>
  );
};

export default SliderToggle;
