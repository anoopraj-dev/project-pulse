export default function TextArea({ field, formMethods, errors }) {
  const {register} = formMethods;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <textarea
        {...register(field.name, {
          required: field.required ? `${field.label} is required` : false,
        })}
        placeholder={field.placeholder || ""}
        rows={field.rows || 4}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
      />
      {errors?.[field.name] && (
        <span className="text-red-500 text-sm">
          {errors[field.name]?.message}
        </span>
      )}
    </div>
  );
}
