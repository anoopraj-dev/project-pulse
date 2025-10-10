export const formatLabel = (name) => {
  if (!name) return "";

  // Replace underscores with spaces
  let formatted = name.replace(/_/g, " ");
  
  // Insert space before uppercase letters in camelCase
  formatted = formatted.replace(/([A-Z])/g, " $1");
  
  // Capitalize first letter of each word
  formatted = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

  return formatted;
};
