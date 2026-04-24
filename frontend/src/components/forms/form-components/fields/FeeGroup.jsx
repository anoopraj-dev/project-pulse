export default function FeeGroup({ field, register, errors, watch }) {
  const selectedServices = watch("services", []);
  const selected = Array.isArray(selectedServices)
    ? selectedServices
    : [selectedServices];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field.fields.map((sub) => {
          const type = sub.name.includes("online") ? "online" : "offline";
          if (!selected.includes(type)) return null;
          return (
            <div key={sub.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {sub.label}
              </label>
              <input
                type={sub.type}
                placeholder={sub.placeholder || ""}
                {...register(sub.name, {
                  required: selected.includes(type)
                    ? `${sub.label} is required`
                    : false,
                })}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors?.[sub.name] && (
                <span className="text-red-500 text-sm">
                  {errors[sub.name]?.message}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
