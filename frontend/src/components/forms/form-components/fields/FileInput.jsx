import { Icon } from "@iconify/react";

export default function FileInput({
  field,
  formMethods,
  handleUpload,
  previews,
  watch,
  loading,
}) {
  const {register,errors} = formMethods;
  const value = watch(field.name);
  const filePreviews = previews[field.name];


  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {field.label}
      </label>
      <div className="relative">
        <input
          type="file"
          accept={field.accept || "*/*"}
          {...register(field.name, {
            required: field.required ? `${field.label} is required` : false,
          })}
          
          className="w-full p-3 pr-10 border border-gray-300 rounded-md file:hidden cursor-pointer focus:ring-2 focus:ring-sky-500"
        />
        {field.uploadButton && (
          <button
            type="button"
            onClick={() =>  handleUpload(value, field.name)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-700"

          >
            {loading ? (
              <Icon icon='line-md:loading-twotone-loop' width={40} height={40}/>
            ) : (
              <Icon icon="line-md:uploading" width={40} height={40} />
            )}
          </button>
        )}
      </div>

      {filePreviews && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {filePreviews.map((url, i) => (
            <div key={i} className="relative border border-blue-400 rounded-sm overflow-hidden">
              <img src={url} alt="preview" className="h-48 w-48 object-cover" />
            </div>
          ))}
        </div>
      )}

      {errors?.[field.name] && (
        <span className="text-red-500 text-sm">
          {errors[field.name]?.message}
        </span>
      )}
    </div>
  );
}
