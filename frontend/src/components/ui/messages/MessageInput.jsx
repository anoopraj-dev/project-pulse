import { useState } from 'react';
import { Icon } from "@iconify/react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSend} className="p-4 border border-blue-200 rounded-lg bg-white/50 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="w-11 h-11 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-200 disabled:text-slate-400 rounded-2xl flex items-center justify-center transition-all shadow-sm hover:shadow-md"
        >
          <Icon icon="mdi:send" className="h-5 w-5 text-white" />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
