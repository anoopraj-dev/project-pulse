import { Icon } from "@iconify/react";
import { useRef } from "react";
import { useFileUploadContext } from "../../../../contexts/FileUploadContext";

export default function FileInput({ field }) {
  const inputRef = useRef(null);
  const { handleFileSelect, removeFile, previews } =
    useFileUploadContext();

  const preview = previews[field.name];

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    handleFileSelect(field.name, fileList, {
      multiple: field.multiple,
    });

    e.target.value = "";
  };

  return (
    <div className="mb-6">
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
        </label>
      )}

      {/* ---------- UPLOAD CONTAINER ---------- */}
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 h-40 flex items-center justify-start gap-4 hover:border-blue-400 transition"
      >
        <input
          ref={inputRef}
          type="file"
          multiple={field.multiple}
          accept={field.accept || "image/*"}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* ---------- EMPTY STATE ---------- */}
        {!preview && (
          <div className="flex flex-col items-center justify-center w-full text-gray-500">
            <Icon icon="mdi:cloud-upload-outline" width={42} />
            <p className="mt-2 text-sm">Click to upload</p>
          </div>
        )}

        {/* ---------- SINGLE PREVIEW ---------- */}
        {!Array.isArray(preview) && preview && (
          <div className="relative group">
            <img
              src={preview}
              className="h-28  object-contain rounded-lg shadow-md"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg">
              <span className="text-white text-xs">Click to replace</span>
            </div>

            {/* Remove button (hover only) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(field.name);
              }}
              className="absolute -top-0 -right-0 bg-black/70 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Icon icon="mdi:close" width={14} className="text-white" />
            </button>
          </div>
        )}

        {/* ---------- MULTIPLE PREVIEW ---------- */}
        {Array.isArray(preview) && preview.length > 0 && (
  <div className="flex gap-3 flex-wrap">
    {preview.map((src, i) => (
      <div key={src} className="relative group">
        <img
          src={src}
          className="h-26 object-contain rounded-lg shadow-md"
        />

        {/* Remove button (hover only) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeFile(field.name, i);
          }}
          className="absolute -top-0 -right-0 bg-black/70 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <Icon icon="mdi:close" width={12} className="text-white" />
        </button>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}
