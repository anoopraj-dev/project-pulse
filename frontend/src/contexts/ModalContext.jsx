import { createContext, useContext, useState } from "react";
import Modal from "../components/ui/modals/Modal";

export const ModalContext = createContext(null);

const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    Component:null,
    props:{},
  });

  const openModal = (message = "",Component =null,props={}, size='md') => {
    setModal({ isOpen: true, message,Component,props});
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
      <Modal isOpen={modal.isOpen} onClose={closeModal} message={modal.message} >
        {modal.Component && <modal.Component {...modal.props} closeModal={closeModal}/>}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext)

export default ModalProvider;
