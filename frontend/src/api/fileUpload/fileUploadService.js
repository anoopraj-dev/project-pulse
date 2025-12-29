import { api } from "../axiosInstance"

const endpointMap = {
  doctor: "/api/doctor/file-upload",
  patient: "/api/patient/file-upload",
};

export const uploadFileService = async ({
  file,
  fieldPath,
  userType,
  index,
}) => {
  const endpoint = endpointMap[userType];
  if (!endpoint) {
    throw new Error("Invalid upload role");
  }

  const formData = new FormData();

  if (Array.isArray(file)) {
    file.forEach((f) => formData.append("files", f));
  } else {
    formData.append("files", file);
  }

  if (index !== undefined) {
    formData.append("index", index);
  }

  const uploadType = extractUploadType(fieldPath);
  console.log(uploadType)

  const res = await api.post(
    `${endpoint}?type=${uploadType}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};

// ---------- helper ----------
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
