export const buildFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList) {
      if (value.length > 0) {
        formData.append(key, value[0]);
      }
    } else if (Array.isArray(value) || typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === "number") {
      formData.append(key, value.toString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  return formData;
};
