
import { useFieldArray } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";

export default function FieldArrayGroup({ field, formMethods, ...rest }) {
  const {
    control,
    register,
    formState: { errors },
    trigger,
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
    rules: field.validation,
  });

  return (
    <div className="flex flex-col border border-gray-300 p-4 rounded-lg">
      <label className="text-lg font-semibold">{field.label}</label>

      <input
        type="hidden"
        {...register(field.name, {
          validate: (value) => {
            if (field.required && (!value || value.length === 0)) {
              return `${field.label} requires at least 1 entry`;
            }
            return true;
          },
        })}
      />

      {errors?.[field.name]?.root && (
        <p className="text-red-500 text-sm mt-1">
          {errors[field.name].root.message}
        </p>
      )}

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="space-y-2 border border-gray-300 p-3 rounded-md my-2"
        >
          {field.fields.map((sub) => (
            <FieldRenderer
              key={sub.name}
              field={{
                ...sub,
                name: `${field.name}[${index}].${sub.name}`,
              }}
              formMethods={formMethods}
              {...rest}
            />
          ))}

          <button
            type="button"
            onClick={() => {
              remove(index);
              trigger(field.name);
            }}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => {
          append(
            field.fields.reduce((acc, f) => {
              acc[f.name] = "";
              return acc;
            }, {}),
          );
          trigger(field.name);
        }}
        className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
      >
        + Add {field.label}
      </button>
    </div>
  );
}
