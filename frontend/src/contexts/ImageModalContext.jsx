import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { ImageModal } from "../components/ui/modals/ModalInputs";

const ImageModalContext = createContext(null);

export const ImageModalProvider = ({ children }) => {
  const [image, setImage] = useState(null);

  const openImage = (url, label = "") => {
    setImage({ url, label });
  };

  const closeImage = () => setImage(null);

  return (
    <ImageModalContext.Provider value={{ openImage }}>
      {children}
      {image &&
        createPortal(
          <ImageModal {...image} onClose={closeImage} />,
          document.getElementById("modal-root")
        )}
    </ImageModalContext.Provider>
  );
};

export const useImageModal = () => useContext(ImageModalContext);
