import { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import PrimaryButton from "./PrimaryButton";
import { Icon } from "@iconify/react";

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


  //-------- Portal content -------------------
  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs transition-opacity duration-500 ${animateIn ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
    >
      <div
        className={`bg-white max-w-md w-full border border-gray-300 p-5 rounded-lg shadow-xl transform transition-all duration-500 pointer-events-auto ${animateIn ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
      >
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center w-full">
            <h3 className="text-lg font-semibold text-center ">{children ? '' : "Message"}</h3>
            <div className="flex justify-end w-full">
              <Icon icon={'mingcute:close-circle-fill'} color="red" className="w-10 h-10" onClick={onClose}/>
            </div>
          </div>
          <p className={`mt-4 mb-6 ${!children ? '' : 'font-semibold text-lg'}`}>{message}</p>
          <div className="flex flex-col">
            {children}
          </div>
          <div className=" w-full flex justify-center items-center mt-4 items-center">
            {onConfirm && (
              <PrimaryButton onClick={onConfirm} text="OK" className="px-8 text-sm  " />
            )}

          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.getElementById('modal-root'))
};

export default Modal;
