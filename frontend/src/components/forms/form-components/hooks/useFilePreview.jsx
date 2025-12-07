import { useEffect, useState } from "react";

export default function useFilePreview(watchedValues) {
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    const newPreviews = {};
    const collect = (obj, prefix = "") => {
      for (const key in obj) {
        const val = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (val instanceof FileList && val.length > 0) {
          newPreviews[path] = Array.from(val).map((f) =>
            URL.createObjectURL(f)
          );
        } else if (typeof val === "object" && val) collect(val, path);
      }
    };
    collect(watchedValues);
    Object.values(previews)
      .flat()
      .forEach((url) => URL.revokeObjectURL(url));
    setPreviews(newPreviews);
  }, [JSON.stringify(watchedValues)]);

  return previews;
}
