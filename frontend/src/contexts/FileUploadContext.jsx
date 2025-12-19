import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";
import { useUser } from "./UserContext";
import { uploadFileService } from "../api/fileUpload/fileUploadService";

const FileUploadContext = createContext();
export const useFileUploadContext = () => useContext(FileUploadContext);

export const FileUploadProvider = ({ children }) => {
  const [loading, setLoading] = useState({});
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const { dispatch } = useUser();

  // ---------- FILE SELECT ----------
  const handleFileSelect = (fieldName, fileList, { multiple = false } = {}) => {
    if (!fileList) return;

    const selectedFiles = Array.from(fileList);

    setFiles((prev) => ({
      ...prev,
      [fieldName]: multiple
        ? [...(prev[fieldName] || []), ...selectedFiles]
        : selectedFiles,
    }));

    setPreviews((prev) => ({
      ...prev,
      [fieldName]: multiple
        ? [
            ...(prev[fieldName] || []),
            ...selectedFiles.map((f) => URL.createObjectURL(f)),
          ]
        : selectedFiles.map((f) => URL.createObjectURL(f)),
    }));
  };

  // ---------- REMOVE FILE ----------
  const removeFile = (fieldName, index) => {
    setFiles((prev) => {
      const updated = [...(prev[fieldName] || [])];
      updated.splice(index, 1);
      return { ...prev, [fieldName]: updated };
    });

    setPreviews((prev) => {
      const updated = [...(prev[fieldName] || [])];
      updated.splice(index, 1);
      return { ...prev, [fieldName]: updated };
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

  // ---------- UPLOAD ----------
  const uploadFile = useCallback(
    async (file, fieldPath, userType, index) => {
      if (!file) {
        toast.error("Please select a file");
        return null;
      }

      try {
        setLoading((prev) => ({ ...prev, [fieldPath]: true }));

        const res = await uploadFileService({
          file,
          fieldPath,
          userType,
          index,
        });

        if (!res.success) {
          toast.error(res.message);
          return null;
        }

        toast.success(res.message);

        const uploadedUrl = res.urls?.[0] || null;

        if (res.type === "profilePicture" && uploadedUrl) {
          dispatch({
            type: "UPDATE_PROFILE_PICTURE",
            payload: uploadedUrl,
          });
        }

        return uploadedUrl;
      } catch (err) {
        toast.error(err.message || "Upload failed");
        return null;
      } finally {
        setLoading((prev) => ({ ...prev, [fieldPath]: false }));
      }
    },
    [dispatch]
  );

  return (
    <FileUploadContext.Provider
      value={{
        loading,
        files,
        previews,
        handleFileSelect,
        uploadFile,
        removeFile,
        clearField,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};
