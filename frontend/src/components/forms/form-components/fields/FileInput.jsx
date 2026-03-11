
import { Icon } from "@iconify/react";
import { useRef } from "react";
import { useFileUploadContext } from "../../../../contexts/FileUploadContext";
import PDFViewer from "@/components/ui/pdrViewer/PDFViewer";

export default function FileInput({ field, value, onChange, error }) {
  const inputRef = useRef(null);
  const { handleFileSelect, removeFile } = useFileUploadContext();

  const isPdfFile = (file) => file.type === "application/pdf";

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);

    const updatedFiles = field.multiple
      ? [...(value || []), ...newFiles]
      : newFiles[0];

    // pass File objects to context
    handleFileSelect(field.name, newFiles, { multiple: field.multiple });
    onChange(updatedFiles);

    e.target.value = "";
  };

  const renderPreview = (file, i) => {
    if (isPdfFile(file)) {
      return <PDFViewer file={file} timestamp="" isRead={false} />;
    } else {
      const url = URL.createObjectURL(file);
      return (
        <img src={url} className="h-28 object-contain rounded-lg shadow-md" />
      );
    }
  };

  const handleRemove = (index) => {
    const updated = Array.isArray(value)
      ? value.filter((_, i) => i !== index)
      : null;
    onChange(updated);
    removeFile(field.name, index);
  };

  const filesArray = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div className="mb-6">
      {field.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 h-40 flex items-center justify-start gap-4 hover:border-blue-400 transition"
      >
        <input
          ref={inputRef}
          type="file"
          multiple={field.multiple}
          accept={field.accept || "image/*,application/pdf"}
          onChange={handleFileChange}
          className="hidden"
        />

        {!filesArray.length && (
          <div className="flex flex-col items-center justify-center w-full text-gray-500">
            <Icon icon="mdi:cloud-upload-outline" width={42} />
            <p className="mt-2 text-sm">Click to upload</p>
          </div>
        )}

        {filesArray.map((file, i) => (
          <div key={i} className="relative group">
            {renderPreview(file, i)}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg">
              <span className="text-white text-xs">Click to replace</span>
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(i);
              }}
              className="absolute -top-0 -right-0 bg-black/70 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <Icon icon="mdi:close" width={14} className="text-white" />
            </button>
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
