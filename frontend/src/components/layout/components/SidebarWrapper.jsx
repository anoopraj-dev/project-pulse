const SidebarWrapper = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-50 w-72 h-full">
        {children}
      </div>
    </>
  );
};

export default SidebarWrapper;
