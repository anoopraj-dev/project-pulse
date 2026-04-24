import { createContext, useContext, useState } from "react";

const FileUploadContext = createContext(null);

// --------- CUSTOM HOOK ----------
export const useFileUploadContext = () => {
  const ctx = useContext(FileUploadContext);
  if (!ctx) {
    throw new Error(
      "useFileUploadContext must be used inside FileUploadProvider"
    );
  }
  return ctx;
};

// --------- PROVIDER ----------
export const FileUploadProvider = ({ children }) => {
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});

  // ---------- SELECT FILE ----------
  const handleFileSelect = (fieldName, fileList, { multiple = false } = {}) => {
    const selected = Array.from(fileList || []);

    setFiles((prev) => ({
      ...prev,
      [fieldName]: multiple
        ? [...(prev[fieldName] || []), ...selected]
        : selected[0] || null,
    }));

    setPreviews((prev) => ({
      ...prev,
      [fieldName]: multiple
        ? [
            ...(prev[fieldName] || []),
            ...selected.map((file) => URL.createObjectURL(file)),
          ]
        : selected[0]
        ? URL.createObjectURL(selected[0])
        : null,
    }));
  };

  // ---------- REMOVE FILE ----------
  const removeFile = (fieldName, index = null) => {
    setFiles((prev) => {
      const value = prev[fieldName];

      if (Array.isArray(value)) {
        const updated = [...value];
        updated.splice(index, 1);
        return { ...prev, [fieldName]: updated };
      }

      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });

    setPreviews((prev) => {
      const value = prev[fieldName];

      if (Array.isArray(value)) {
        const updated = [...value];
        updated.splice(index, 1);
        return { ...prev, [fieldName]: updated };
      }

      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  // ---------- CLEAR FIELD ----------
  const clearField = (fieldName) => {
    setFiles((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });

    setPreviews((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  return (
    <FileUploadContext.Provider
      value={{
        files,
        previews,
        handleFileSelect,
        removeFile,
        clearField,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};
