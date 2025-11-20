import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Icon } from "@iconify/react";

const DynamicForm = ({ config, onSubmit, defaultValues, mode, loading, handleUpload }) => {
  const { watch, register, control, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  const isModal = mode === 'modal'
  const [previews, setPreviews] = useState({});

  // Watch the whole form for file fields
  const watchedValues = watch();

  // --- Repeatable fields ---
  const { fields: experienceItems, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: "experience",
  });
  const { fields: educationItems, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });


  
  // --- Handle file previews ---
  useEffect(() => {
    const newPreviews = {};

    const collectFiles = (obj, prefix = "") => {
      for (const key in obj) {
        const value = obj[key];
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (value instanceof FileList && value.length > 0) {
          newPreviews[fieldPath] = Array.from(value).map((file) => URL.createObjectURL(file));
        } else if (Array.isArray(value)) {
          value.forEach((v, i) => collectFiles(v, `${fieldPath}[${i}]`));
        } else if (typeof value === "object" && value !== null) {
          collectFiles(value, fieldPath);
        }
      }
    };

    collectFiles(watchedValues);
    setPreviews((prev) => {
      // Cleanup previous URLs
      Object.values(prev).flat().forEach((url) => URL.revokeObjectURL(url));
      return newPreviews;
    });

    // Cleanup when component unmounts
    return () => {
      Object.values(newPreviews).flat().forEach((url) => URL.revokeObjectURL(url));
    };
  }, [JSON.stringify(watchedValues)]);

  const watchedServices = watch("services", []);
  const selectedServices = Array.isArray(watchedServices) ? watchedServices : [watchedServices];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-lg font-semibold mb-6 text-gray-700">{isModal ? '' : config.title}</h3>

      <div className={isModal ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 md:grid-cols-2 gap-12"}>
        {config.fields.map((field) => {

          // --- Experience Repeatable ---
          if (field.name === "experience") {
            return (
              <div key={field.name} className="col-span-2 border border-gray-300 p-4 rounded-lg mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-3">{field.label}</label>

                {experienceItems.map((item, index) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:space-x-4 mb-4 border border-gray-300 p-3 rounded-md">
                    {field.fields.map((subField) => (
                      <div key={subField.name} className="flex-1 mb-3 md:mb-0 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{subField.label}</label>

                        {subField.type === "file" ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept={subField.accept || "*/*"}
                              {...register(`experience[${index}].${subField.name}`, {
                                required: subField.required ? `${subField.label} is required` : false,
                              })}
                              className="w-full p-3 pr-10 border border-gray-300 rounded-md file:hidden cursor-pointer focus:ring-2 focus:ring-[#0096C7]"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpload(watchedValues.experience[index][subField.name], `experience[${index}].${subField.name}`,index)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0096C7] hover:text-[#0077A7]"
                            >
                              <Icon icon="mdi:upload" width="22" height="22" />
                            </button>

                            {/* Preview */}
                            {previews[`experience[${index}].${subField.name}`] && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {previews[`experience[${index}].${subField.name}`].map((url, i) => (
                                  <img key={i} src={url} alt="preview" className="h-16 w-16 object-cover rounded-md border" />
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type={subField.type}
                            {...register(`experience[${index}].${subField.name}`, {
                              required: subField.required ? `${subField.label} is required` : false,
                            })}
                            className="w-full p-3 border border-gray-300 rounded-md"
                            placeholder={subField.placeholder || ""}
                          />
                        )}

                        {errors?.experience?.[index]?.[subField.name] && (
                          <span className="text-red-600 text-sm">
                            {errors.experience[index][subField.name]?.message}
                          </span>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 mt-2 md:mt-0 md:self-center"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => appendExperience({})}
                  className="bg-[#0096C7] text-white px-3 py-2 rounded-md text-sm hover:bg-[#0077a3]"
                >
                  + Add {field.label}
                </button>
              </div>
            );
          }

          // --- Education Repeatable ---
          if (field.name === "education") {
            return (
              <div key={field.name} className="col-span-2 border border-gray-300 p-4 rounded-lg mb-6">
                <label className="block text-lg font-semibold text-gray-700 mb-3">{field.label}</label>

                {educationItems.map((item, index) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:space-x-4 mb-4 border border-gray-300 p-3 rounded-md">
                    {field.fields.map(subField => (
                      <div key={subField.name} className="flex-1 mb-3 md:mb-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{subField.label}</label>
                        <input
                          type={subField.type}
                          {...register(`education[${index}].${subField.name}`, {
                            required: subField.required ? `${subField.label} is required` : false
                          })}
                          className="w-full p-3 border border-gray-300 rounded-md"
                          placeholder={subField.placeholder || ""}
                        />
                        {errors?.education?.[index]?.[subField.name] && (
                          <span className="text-red-600 text-sm">{errors.education[index][subField.name]?.message}</span>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => removeEducation(index)} className="text-red-600 mt-2 md:mt-0 md:self-center">
                      Remove
                    </button>
                  </div>
                ))}

                <button type="button" onClick={() => appendEducation({})} className="bg-[#0096C7] text-white px-3 py-2 rounded-md text-sm hover:bg-[#0077a3]">
                  + Add {field.label}
                </button>
              </div>
            );
          }


          // ---Check boxes---
          if (field.type === 'checkbox') {
            return (
              <div className="col-span-2  p-4 rounded-lg mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2" > {field.label}</label>
                <div className="flex items-center space-x-6">
                  {
                    field.options.map((opt) => (
                      <label key={opt} className="grid-cols-3 items-center space-x-2">
                        <input
                          type="checkbox"
                          value={opt}
                          {...register(field.name, { required: `${field.label} is required` })}
                          className="accent-[#0096C7]"
                        />
                        <span>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                      </label>
                    )
                    )}

                </div>
                {errors[field.name] && (
                  <span className="text-red-600 text-sm">{errors[field.name]?.message}</span>
                )}
              </div>
            )
          }

          // --- Radio Buttons ---
          if (field.type === "radio") {
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <div className="flex items-center space-x-6">
                  {field.options.map((op) => (
                    <label key={op} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={op}
                        {...register(field.name, { required: `${field.label} is required` })}
                        className="accent-[#0096C7]"
                      />
                      <span>{op.charAt(0).toUpperCase() + op.slice(1)}</span>
                    </label>
                  ))}
                </div>
                {errors[field.name] && (
                  <span className="text-red-600 text-sm">{errors[field.name]?.message}</span>
                )}
              </div>
            );
          }

          if (field.name === "services") {
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <div className="flex items-center space-x-6">
                  {field.options.map((opt) => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={opt}
                        {...register("services")}
                        className="accent-[#0096C7]"
                      />
                      <span>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          // --- Textarea ---
          if (field.type === "textarea") {
            return (
              <div key={field.name}>
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
            );
          }

          // --- File ---
          if (field.type === "file" && previews[field.name]) {

            const filePreviews = previews[field.name]
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>

                <div className="relative">
                  {/* File input */}
                  <input
                    type="file"
                    accept={field.accept || "*/*"}
                    {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                    className="w-full p-4 pr-12 border border-gray-300 rounded-md cursor-pointer file:hidden focus:ring-2 focus:ring-[#0096C7] focus:outline-none"
                  />

                  {/* Upload icon inside input */}
                  {field.uploadButton && (
                    <button
                      type="button"
                      onClick={() => handleUpload(watchedValues[field.name], field.name)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0096C7] hover:text-[#0077A7]"
                    >
                      {loading ? 'Uploading...' : <Icon icon="mdi:upload" width="22" height="22" />}
                    </button>
                  )}
                </div>

                {/* Preview (optional) */}
                {filePreviews && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {filePreviews.map((url, i) => (
                      <div className="flex border border-sky-400 rounded-sm p-3">
                        <img
                        key={i}
                        src={url}
                        alt={`${field.name}-preview-${i}`}
                        className="h-50 w-50 rounded-md object-cover  "
                      />
                      <p>X</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          }

          // --- Select ---
          if (field.type === 'select') {
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <select
                  {...register(field.name, { required: field.required ? `${field.label} is required` : false })}
                  className="w-full p-4 border border-gray-300 rounded-md bg-white"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors[field.name] && (
                  <span className="text-red-600 text-sm">{errors[field.name]?.message}</span>
                )}
              </div>
            );
          }

          // --- Fees Input (conditional based on selected services) ---
          if (field.name === "fees") {
            return (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {field.fields.map((subField) => {
                    const serviceType = subField.name.includes("online") ? "online" : "offline";
                    if (!selectedServices.includes(serviceType)) return null; // only show if selected

                    return (
                      <div key={subField.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {subField.label}
                        </label>
                        <input
                          type={subField.type}
                          placeholder={subField.placeholder || ""}
                          {...register(subField.name, {
                            required: selectedServices.includes(serviceType)
                              ? `${subField.label} is required`
                              : false,
                          })}
                          className="w-full p-3 border border-gray-300 rounded-md"
                        />
                        {errors[subField.name] && (
                          <span className="text-red-600 text-sm">{errors[subField.name]?.message}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // --- Default input ---
          return (
            <div key={field.name}>
              {field.label && <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>}
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
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className={isModal
            ? "w-full mt-4 px-4 py-3 bg-[#0096C7] text-white rounded-md hover:bg-[#2cc4f7] transition"
            : "mt-4 px-4 py-3 bg-[#0096C7] text-white rounded-md hover:bg-[#2cc4f7] transition"
          }
          disabled={loading}
        >
          {loading ? 'Processing...' : config.buttonText || "Next"}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
