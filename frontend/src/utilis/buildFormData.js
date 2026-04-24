export const buildFormData = (data, files, allowedFileFields = []) => {
  const formData = new FormData();

  const append = (key, value) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (typeof v === "object" && !(v instanceof File)) {
          Object.keys(v).forEach((k) => {
            append(`${key}[${i}][${k}]`, v[k]);
          });
        } else {
          append(`${key}[${i}]`, v);
        }
      });
    } else if (typeof value === "object" && !(value instanceof File)) {
      Object.keys(value).forEach((k) => {
        append(`${key}[${k}]`, value[k]);
      });
    } else {
      formData.append(key, value);
    }
  };

  Object.keys(data).forEach((key) => {
    append(key, data[key]);
  });

  Object.entries(files || {}).forEach(([fieldName, fileList]) => {
    if (
      allowedFileFields.length &&
      !allowedFileFields.includes(fieldName)
    ) {
      return;
    }

    fileList.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file);
    });
  });

  return formData;
};
