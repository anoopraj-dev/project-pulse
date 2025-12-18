import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { api } from "../api/axiosInstance";
import toast from "react-hot-toast";
import { useUser } from "./UserContext";

const FileUploadContext = createContext();

export const useFileUploadContext = () => useContext(FileUploadContext);

export const FileUploadProvider = ({ children }) => {
  const [loading, setLoading] = useState({});
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const { dispatch } = useUser();

  // ---------------- FILE SELECT ----------------

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
            ...selectedFiles.map((file) => URL.createObjectURL(file)),
          ]
        : selectedFiles.map((file) => URL.createObjectURL(file)),
    }));
  };

  // ---------------- REMOVE FILE ----------------
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

  // ---------------- CLEAR FIELD ----------------
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

  // ---------------- UPLOAD  FILE ----------------
  const uploadFile = useCallback(async (file, fieldPath, userType, index) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return null;
    }

    const endpointMap = {
      doctor: "/api/doctor/file-upload",
      patient: "/api/patient/file-upload",
    };

    const endpoint = endpointMap[userType];

    if (!endpoint) {
      toast.error("Invalid upload role");
      return null;
    }
    try {
      setLoading((prev) => ({...prev,[fieldPath]: true}))

      const formData = new FormData();

      if (Array.isArray(file)) {
        file.forEach((f) => formData.append("files", f));
      } else {
        formData.append("files", file);
      }

      if (index !== undefined) formData.append("index", index);

      const uploadType = extractUploadType(fieldPath);

      const response = await api.post(
        `${endpoint}?type=${uploadType}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        const urls = response.data.urls || [];
        const uploadedUrl = urls[0] || null;
        if (uploadType === "profilePicture" && uploadedUrl) {
          dispatch({
            type: "UPDATE_PROFILE_PICTURE",
            payload: uploadedUrl,
          });
        }
        return uploadedUrl;
      } else {
        toast.error(response.data.message);
        return null;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      return null;
    } finally {
      setLoading((prev) => ({...prev, [fieldPath]: false}))
    }
  }, []);

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

// ---------------- HELPERS ----------------
const extractUploadType = (fieldPath) => {
  if (!fieldPath) return "";
  const cleanedPath = fieldPath.replace(/\[\d+\]/g, "");
  const lastPart = cleanedPath.split(".").pop();

  const mapping = {
    profilePicture: "profilePicture",
    picture: "profilePicture",
    certificate: "experienceCertificate",
    proofDocument: "proofDocument",
    educationDocument: "educationDocument",
  };

  return mapping[lastPart] || lastPart;
};
