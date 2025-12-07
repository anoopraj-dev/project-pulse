import React from "react";

export default function TextInput({ field, formMethods, errors }) {
  const {register} = formMethods;
  return (
    <div>
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
      )}
      <input
        type={field.type || "text"}
        placeholder={field.placeholder || ""}
        {...register(field.name, {
          required: field.required ? `${field.label} is required` : false,
        })}
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
