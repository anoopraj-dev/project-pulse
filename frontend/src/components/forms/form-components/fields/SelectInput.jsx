export default function SelectInput({ field, formMethods, errors }) {
  const {register} = formMethods;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <select
        {...register(field.name, {
          required: field.required ? `${field.label} is required` : false,
        })}
        className="w-full p-3 border border-gray-300 rounded-md bg-white"
      >
        <option value="">Select {field.label}</option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors?.[field.name] && (
        <span className="text-red-500 text-sm">
          {errors[field.name]?.message}
        </span>
      )}
    </div>
  );
}
