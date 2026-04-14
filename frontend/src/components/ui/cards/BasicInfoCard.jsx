
import { Icon } from "@iconify/react";
import React from "react";

const BasicInfoCard = ({ field, val }) => {
  const icons = {
    email: "mingcute:mail-line",
    dob: "mingcute:birthday-2-line",
    gender: "mdi:gender-male-female",
    location: "mingcute:location-2-fill",
    education: "material-symbols:school-rounded",
    specialization: "healthicons:stethoscope-24px",
    work: "mdi:briefcase-variant",
  };

  const labels = {
    email: "Email",
    dob: "Date of Birth",
    gender: "Gender",
    location: "Location",
    education: "Qualifications",
    specialization: "Specialization",
    work: "Work",
  };

  const formattedValue = (() => {
    if (!val) return null;
    if (Array.isArray(val)) return val;
    const date = new Date(val);
    return !isNaN(date) && typeof val === "string" && val.includes("-")
      ? date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : val;
  })();

  if (!formattedValue || (Array.isArray(formattedValue) && formattedValue.length === 0))
    return null;

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/60 last:border-0">
      {/* Icon chip */}
      <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon
          icon={icons[field] || "mingcute:info-line"}
          className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
          {labels[field] || field}
        </p>
        {Array.isArray(formattedValue) ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {formattedValue.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900"
              >
                {String(item)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 break-words leading-relaxed">
            {formattedValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoCard;

export const DetailsDisplayCard = ({ label, value }) => {
  const formatValue = (val) => {
    if (val == null || val === "") return "—";
    const date = new Date(val);
    if (!isNaN(date) && typeof val === "string" && val.includes("-")) {
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return String(val);
  };

  if (value == null || value === "") return null;

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/60 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 break-words leading-relaxed">
          {formatValue(value)}
        </p>
      </div>
    </div>
  );
};