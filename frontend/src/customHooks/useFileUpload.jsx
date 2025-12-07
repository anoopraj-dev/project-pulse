// hooks/useFileUpload.js
import { useCallback,useState} from 'react';
import { api } from '../api/api';
import toast from 'react-hot-toast';


export const useFileUpload = (userType = 'doctor') => {
    const [loading, setLoading] = useState(false);
  const uploadFile = useCallback(async (fileList, fieldPath, index) => {
    try {
        setLoading(true)
      if (!fileList || fileList.length === 0) {
        toast.error('Please choose an image to upload!');
        return null;
      }

      const formData = new FormData();
      formData.append(fieldPath, fileList[0]);
      if (index !== undefined) formData.append('index', index);

      const endpoint = userType === 'doctor' 
        ? `/api/doctor/file-upload` 
        : `/api/patient/file-upload`;

      const uploadType = extractUploadType(fieldPath);
      
     
      const response = await api.post(`${endpoint}?type=${uploadType}`, formData, {
        headers: {
          // Let FormData auto-set multipart/form-data boundary
        },
        transformRequest: [(data) => data]  // Skip JSON transform
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        return response.data.imageUrl;
      } else {
        toast.error(response.data.message);
        return null;
      }
   
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      return null;
    } finally {
        setLoading(false)
    }
  }, [userType]);

  return { uploadFile,loading };
};

// Universal extractUploadType (same for both)
const extractUploadType = (fieldPath) => {
  if (!fieldPath) return '';
  const cleanedPath = fieldPath.replace(/\[\d+\]/g, '');
  const lastPart = cleanedPath.split('.').pop();
  
  const mapping = {
    profilePicture: 'profilePicture',
    picture: 'profilePicture',
    certificate: 'experienceCertificate',
    proofDocument: 'licenseProof',
    educationDocument: 'educationDocument',
  };
  
  return mapping[lastPart] || lastPart;
};
