import { Icon } from "@iconify/react";
import { useState } from "react";

const PDFViewer = ({ file, timestamp, isRead }) => {
  const [loading, setLoading] = useState(false);

  const openPdf = async () => {
    try {
      setLoading(true);

      const res = await fetch(file.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");

      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (err) {
      console.error("Failed to open PDF", err);
      alert("Unable to open PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={!loading ? openPdf : undefined}
      className="mt-2 w-72 cursor-pointer rounded-lg border border-blue-200 bg-white shadow-sm p-3 hover:bg-blue-50"
    >
      {/* top row */}
      <div className="flex items-center gap-3">
        <Icon icon="mdi:file-pdf-box" className="text-red-500 w-8 h-8" />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>

      {/* bottom-right timestamp + tick */}
      <div className="mt-1 flex justify-end items-center gap-1 text-[11px] text-gray-400">
        <span>{timestamp}</span>
        <Icon
          icon={`${isRead ? "mdi:check-all" : "mdi:check"}`}
          className="w-3 h-3"
        />
      </div>

      {loading && (
        <p className="mt-1 text-xs text-gray-400 text-right">Opening…</p>
      )}
    </div>
  );
};

export default PDFViewer;
