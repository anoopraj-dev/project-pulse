import { useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, message }) => {
  const [show, setShow] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // trigger animation after mounting
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShow(false), 500); // matches duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs transition-opacity duration-500 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white max-w-md w-full p-6 rounded-lg shadow-x transform transition-all duration-500 ${
          animateIn ? "scale-100 opacity-100" : "scale-40 opacity-0"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-center">Message</h3>
          <img
            src="/close.png"
            alt="close"
            className="w-6 h-6 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <p className="mt-4 mb-6">{message}</p>
      </div>
    </div>
  );
};

export default Modal;
