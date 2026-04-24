
import { useRef, useState } from "react";
import { Icon } from "@iconify/react";

const MessageInput = ({ onSend, disabled = false, disabledMessage = "" }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef();

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = null;
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (disabled || (!message.trim() && files.length === 0)) return;
    onSend({ text: message.trim(), files });
    setMessage("");
    setFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-100">
      {/* Disabled notice */}
      {disabled && disabledMessage && (
        <div className="mb-2 flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[12px] text-amber-700">
          <Icon icon="mdi:information-outline" className="w-4 h-4 shrink-0 mt-0.5" />
          {disabledMessage}
        </div>
      )}

      {/* File previews */}
      {files.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          {files.map((file, idx) => {
            const isImage = file.type.startsWith("image/");
            return (
              <div
                key={idx}
                className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
              >
                {isImage ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-1">
                    <Icon icon="mdi:file-document-outline" className="w-5 h-5 text-sky-400" />
                    <span className="text-[9px] text-slate-500 truncate w-full text-center px-1">
                      {file.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-slate-800/70 hover:bg-red-500 rounded-full text-white flex items-center justify-center text-[10px] transition-colors"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Attach */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          disabled={disabled}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon icon="mdi:paperclip" className="w-5 h-5" />
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFilesChange}
          className="hidden"
        />

        {/* Text */}
        <div className="flex-1">
          <textarea
            rows={1}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "Messaging disabled" : "Type a message…"}
            className="w-full resize-none px-4 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent placeholder:text-slate-400 text-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed overflow-hidden"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={(!message.trim() && files.length === 0) || disabled}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed active:scale-95"
        >
          <Icon icon="mdi:send" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;