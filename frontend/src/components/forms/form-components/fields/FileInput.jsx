import { Icon } from "@iconify/react";
import {  useRef } from "react";
import { useFileUploadContext } from "../../../../contexts/FileUploadContext";
import { useUser } from "../../../../contexts/UserContext";
export default function FileInput({ field }) {
  const {
    previews,
    files,
    handleFileSelect,
    removeFile,
    uploadFile,
    loading,
  } = useFileUploadContext();

  const {role} =  useUser();
  const inputRef = useRef(null);
  const fieldPreviews = previews[field.name] || [];
  const fieldFiles = files[field.name] || [];

  const onFileChange = (e) => {
  handleFileSelect(field.name, e.target.files, {
    multiple: field.multiple,
  });
  e.target.value = "";
};

//--------------- UPLOAD FILE -----------------------
  const handleUpload = async () => {
    for (let i = 0; i < fieldFiles.length; i++) {
      await uploadFile(
        fieldFiles[i],
        field.name,
        role || 'doctor',
        i
      );
    }
  };
 
//----------- REMOVE FILE ----------------
  const handleRemove = (index) => {
    removeFile(field.name, index);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="mb-6">
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
        </label>
      )}

      {/* ------------- File Input Box ----------------- */}
      <div className="relative rounded-xl border-2 border-dashed border-gray-300 bg-white p-4">
        <input
          ref={inputRef}
          type="file"
          multiple={field.multiple}
          accept={field.accept || "image/*"}
          onChange={onFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {/* --------------- Empty State ------------------ */}
        {fieldPreviews.length === 0 && (
          <div className="flex flex-col items-center py-8 text-gray-500">
            <Icon icon="mdi:cloud-upload-outline" width={42} />
            <p className="mt-2 text-sm">Click to upload or drag & drop</p>
          </div>
        )}

        {/* ------------------ Previews -------------------- */}
        {fieldPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {fieldPreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  className="h-28 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="absolute z-10 top-2 right-2 bg-black/60 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <Icon icon="mdi:close" width={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------- Upload Button ---------------------- */}
      {fieldFiles.length > 0 && (
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-sky-600 text-white text-sm"
          >
            {loading ? (
              <Icon icon="line-md:loading-twotone-loop" width={18} />
            ) : (
              <Icon icon="line-md:upload-loop" width={18} />
            )}
            Upload
          </button>
        </div>
      )}
    </div>
  );
}
