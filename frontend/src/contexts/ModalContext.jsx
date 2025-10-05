import { createContext, useContext, useState } from "react";
import Modal from "../components/Modal";

export const ModalContext = createContext(null);

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
  });

  const openModal = (message = "") => {
    setModal({ isOpen: true, message });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
      <Modal isOpen={modal.isOpen} onClose={closeModal} message={modal.message} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
};

export default ModalProvider;
