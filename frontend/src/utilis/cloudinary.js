export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_PRESET
  );

  let resourceType = "raw";

  if (file.type.startsWith("image/")) {
    resourceType = "image";
  } else if (file.type.startsWith("video/")) {
    resourceType = "video";
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

    console.log(import.meta.env.VITE_CLOUDINARY_PRESET);
    console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);


  if (!res.ok) {
    const errorText = await res.text();
  console.error("Cloudinary RAW error:", errorText);
  throw new Error("Cloudinary upload failed: " + errorText);
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    resourceType,
    mimeType: file.type,
    name: file.name,
    size: file.size,
    format: data.format || file.name.split(".").pop(),
  };
};
