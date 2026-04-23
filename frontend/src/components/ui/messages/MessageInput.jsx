// import { useRef, useState } from 'react';
// import { Icon } from "@iconify/react";

// const MessageInput = ({ onSend, disabled = false, disabledMessage = "" }) => {
//   const [message, setMessage] = useState('');
//   const [files, setFiles] = useState([]);
//   const fileInputRef = useRef()

//   //--------------------- Handle file selection ------------------
//   const handleFilesChange = (e) => {
//     const selected = Array.from(e.target.files);
//     setFiles((prev)=> [...prev, ...selected]);
//     e.target.value = null;
//   }

//   //----------------- Remove Files -----------------------
//   const removeFile = (index) => {
//     setFiles((prev)=> prev.filter((_,i)=> i !== index))
//   }


//   //--------------- Send messaage -------------------

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (disabled) return;
//     if (!message.trim() && files.length ===0) return ;
//       onSend({text: message.trim(), files});
//       setMessage('');
//       setFiles([]);
    
//   };

//   return (
//     <>
//       {disabled && disabledMessage && (
//         <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
//           {disabledMessage}
//         </div>
//       )}
//       <form
//         onSubmit={handleSend}
//         className={`p-4 border rounded-lg bg-white/50 backdrop-blur-sm ${disabled ? "border-slate-200 opacity-50" : "border-blue-200"}`}
//       >
//       <div className="flex flex-col gap-2">
//         {/* Preview selected files */}
//         {files.length > 0 && (
//           <div className="flex gap-2 overflow-x-auto">
//             {files.map((file, idx) => {
//               const isImage = file.type.startsWith("image/");
//               return (
//                 <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
//                   {isImage ? (
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={file.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center bg-slate-100 text-xs text-slate-600 px-1 text-center">
//                       {file.name}
//                     </div>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => removeFile(idx)}
//                     className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center text-xs"
//                   >
//                     ×
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <div className="flex items-end gap-2">
//           {/* Text input */}
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder={disabled ? "Messaging disabled during consultation" : "Type a message..."}
//               disabled={disabled}
//               className={`w-full px-4 py-3 text-sm bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
//                 disabled
//                   ? "border-slate-200 text-slate-400 cursor-not-allowed"
//                   : "border-slate-200 focus:ring-sky-400 focus:border-transparent"
//               }`}
//             />

//             {/* File upload button */}
//             <button
//               type="button"
//               onClick={() => fileInputRef.current.click()}
//               disabled={disabled}
//               className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
//                 disabled
//                   ? "text-slate-300 cursor-not-allowed"
//                   : "text-slate-500 hover:text-sky-500"
//               }`}
//             >
//               <Icon icon="mdi:paperclip" className="w-5 h-5" />
//             </button>
//             <input
//               type="file"
//               multiple
//               ref={fileInputRef}
//               onChange={handleFilesChange}
//               className="hidden"
//             />
//           </div>

//           {/* Send button */}
//           <button
//             type="submit"
//             disabled={(!message.trim() && files.length === 0) || disabled}
//             className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-md ${
//               disabled
//                 ? "bg-slate-200 text-slate-400 cursor-not-allowed"
//                 : "bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400"
//             }`}
//           >
//             <Icon icon="mdi:send" className="h-5 w-5 text-white" />
//           </button>
//         </div>
//       </div>
//     </form>
//   </>
//   );
// };

// export default MessageInput;

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