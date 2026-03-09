import { Icon } from "@iconify/react";
import React, { useState } from "react";

export default function TextInput({ field, formMethods, errors }) {
  const {register} = formMethods;
  const isPassword = field.type === 'password';
  const[showPassword,setShowPassword] = useState(false);

  const inputType = isPassword ?( showPassword ?'text':field.type):
  field.type || 'text'


  return (
    <div>
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field.label}
        </label>
      )}
       <div className="relative">
        <input
          type={inputType}
          placeholder={field.placeholder || ""}
          {...register(field.name, {
            required: field.required ? `${field.label} is required` : false,
          })}
          className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
        />

        {isPassword && (
          <Icon
            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-xl"
          />
        )}
      </div>
      {errors?.[field.name] && (
        <span className="text-red-500 text-sm">
          {errors[field.name]?.message}
        </span>
      )}
    </div>
  );
}
