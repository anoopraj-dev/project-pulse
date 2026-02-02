import { useRef, useState } from 'react';
import { Icon } from "@iconify/react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef()

  //--------------------- Handle file selection ------------------
  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev)=> [...prev, ...selected]);
    e.target.value = null;
  }

  //----------------- Remove Files -----------------------
  const removeFile = (index) => {
    setFiles((prev)=> prev.filter((_,i)=> i !== index))
  }


  //--------------- Send messaage -------------------

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() && files.length ===0) return ;
      onSend({text: message.trim(), files});
      setMessage('');
      setFiles([]);
    
  };

  return (
     <form
      onSubmit={handleSend}
      className="p-4 border border-blue-200 rounded-lg bg-white/50 backdrop-blur-sm"
    >
      <div className="flex flex-col gap-2">
        {/* Preview selected files */}
        {files.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {files.map((file, idx) => {
              const isImage = file.type.startsWith("image/");
              return (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-xs text-slate-600 px-1 text-center">
                      {file.name}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all placeholder:text-slate-400"
            />

            {/* File upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-sky-500 transition-colors"
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
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() && files.length === 0}
            className="w-11 h-11 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
          >
            <Icon icon="mdi:send" className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
