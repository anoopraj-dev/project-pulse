import { useFieldArray } from "react-hook-form";
import FieldRenderer from "./FieldRenderer";

export default function FieldArrayGroup({ field, formMethods, ...rest }) {
  const {control} = formMethods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  return (
    <div className=" flex flex-col border border-gray-300 p-4 rounded-lg">
      <label className="text-lg font-semibold">{field.label}</label>

      {fields.map((item, index) => (
        <div key={item.id} className="space-y-2 border border-gray-300 p-3 rounded-md my-2">
          {field.fields.map((sub) => (
            <FieldRenderer
              key={sub.name}
              field={{ ...sub, name: `${field.name}[${index}].${sub.name}` }}
              formMethods={formMethods}
              {...rest}
            />
          ))}
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
        
      ))}

            <button
        type="button"
        onClick={() => append({})}
        className="bg-blue-500 text-white px-3 py-2 rounded-md mt-2"
      >
        + Add {field.label}
      </button>


    </div>
  );
}
