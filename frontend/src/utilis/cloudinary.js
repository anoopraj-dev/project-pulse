export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  let resourceType = "raw";
  let uploadPreset = import.meta.env.VITE_CLOUDINARY_RAW_PRESET;

  if (file.type.startsWith("image/")) {
    resourceType = "image";
    uploadPreset = import.meta.env.VITE_CLOUDINARY_IMAGE_PRESET;
  } else if (file.type.startsWith("video/")) {
    resourceType = "video";
    uploadPreset = import.meta.env.VITE_CLOUDINARY_VIDEO_PRESET;
  }

  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Cloudinary upload error:", errorText);
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType: data.resource_type, 
    mimeType: file.type,
    name: file.name,
    size: file.size,
    format: data.format || file.name.split(".").pop(),
  };
};
