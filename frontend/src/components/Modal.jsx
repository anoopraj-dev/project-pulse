import { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import PrimaryButton from "./PrimaryButton";

const Modal = ({ isOpen, onClose, message, children, onConfirm }) => {
  const [show, setShow] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // trigger animation after mounting
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;


  //portal content
  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs transition-opacity duration-500 ${animateIn ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`bg-white max-w-md w-full p-6 rounded-lg shadow-xl transform transition-all duration-500 pointer-events-auto ${animateIn ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center w-full">
            <h3 className="text-lg font-semibold text-center ">{children ? '' : "Message"}</h3>
          </div>
          <p className={`mt-4 mb-6 ${!children ? '' : 'font-semibold text-lg'}`}>{message}</p>
          {children}
          <div className="flex justify-center mt-4">
            {onConfirm && (
              <PrimaryButton onClick={onConfirm} text="OK" className="px-8 text-sm  " />
            )}

            <PrimaryButton onClick={onClose} text={children ? 'Cancel' : 'OK'} className={`text-xs my-1 py-3 px-5 w-full ${children ? "bg-red-500" : "bg-[#0096C7]"
              }`} />
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.getElementById('modal-root'))
};

export default Modal;
