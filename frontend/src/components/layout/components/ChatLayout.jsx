import React from 'react';

const ChatLayout = ({ sidebar, children }) => {
  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 p-10 gap-3">
      {/* Sidebar */}
      <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-blue-200 rounded-lg hidden lg:block shadow-sm">
        {sidebar}
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
