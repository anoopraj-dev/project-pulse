import { useForm } from "react-hook-form";
import React from "react";

const DynamicForm = ({ config, onSubmit, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-lg font-semibold mb-6 text-gray-700">{config.title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {config.fields.map((field) => (
          <div key={field.name} className="flex flex-col justify-between space-y-6 h-full">
            {/* Radio Buttons */}
            {field.type === "radio" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <div className="flex items-center space-x-6">
                  {field.options.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={opt}
                        {...register(field.name, { required: `${field.label} is required` })}
                        className="accent-[#0096C7]"
                      />
                      <span>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                    </label>
                  ))}
                </div>
                {errors[field.name] && (
                  <span className="text-red-600 text-sm">{errors[field.name]?.message}</span>
                )}
              </div>
            ) : field.type === "textarea" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <textarea
                  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                  className="w-full p-4 border border-gray-300 rounded-md"
                  placeholder={field.placeholder || ""}
                />
                {errors[field.name] && (
                  <span className="text-red-600 text-sm">{errors[field.name]?.message}</span>
                )}
              </div>
            ) : field.type === "file" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <input
                  type="file"
                  accept={field.accept || "*/*"}
                  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                  className="w-full p-4 border border-gray-300 rounded-md"
                />
              </div>
            ) : field.type ==='select' ?(
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <select
                  {...register(field.name, {
                    required: field.required ? `${field.label} is required` : false,
                  })}
                  className="w-full p-4 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors[field.name] && (
                  <span className="text-red-600 text-sm">
                    {errors[field.name]?.message}
                  </span>
                )}
              </div>
            ):(
              <div>
                {field.label && (
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                )}
                <input
                  type={field.type}
                  placeholder={field.placeholder || ""}
                  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                  className="w-full p-4 border border-gray-300 rounded-md"
                />
                {errors[field.name] && (
                  <span className="text-red-600 text-sm">{errors[field.name]?.message}</span>
                )}
              </div>
            ) }
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="px-8 py-3 bg-[#0096C7] text-white font-semibold rounded-lg hover:bg-[#0077a3] transition duration-200"
        >
          {config.buttonText || "Next"}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
