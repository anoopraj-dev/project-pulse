export default function CheckboxGroup({ field, formMethods, errors }) {
  const { register } = formMethods;

  return (
    <div className="col-span-2 w-full"> 
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {field.label}
      </label>

      <div className="flex flex-wrap gap-4">
        {field.options.map((opt) => (
          <label key={opt} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={opt}
              {...register(field.name, {
                required: field.required
                  ? `${field.label} is required`
                  : false,
              })}
              className="accent-sky-500"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      {errors?.[field.name] && (
        <span className="text-red-500 text-sm">
          {errors[field.name]?.message}
        </span>
      )}
    </div>
  );
}

