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

  const formattedValue = (() => {
    if (!val) return "—";
    const date = new Date(val);
    return !isNaN(date)
      ? date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : val;
  })();

  return (
    <div className="group relative overflow-hidden">
      {/* Icon Container */}
      <div className="flex items-center gap-3 py-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#0096C7]/10 flex items-center justify-center 
                        group-hover:bg-[#0096C7] transition-colors duration-300">
          <Icon
            icon={icons[field] || "mingcute:info"}
            className="text-2xl text-[#0096C7] group-hover:text-white transition-colors duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {Array.isArray(val) && val.length > 0 ? (
            <div className="space-y-0.5">
              {val.map((item, index) => (
                <p
                  key={index}
                  className="text-sm text-gray-700 font-medium leading-snug truncate"
                >
                  {String(item)}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-800 font-medium leading-snug truncate">
              {formattedValue}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0096C7] 
                      group-hover:w-full transition-all duration-300 ease-out" />
    </div>
  );
};

export default BasicInfoCard;

export const DetailsDisplayCard = ({ label, value }) => {
  const formatValue = (val) => {
    if (val == null || val === "") return "—";
    
    // Check if it's a date
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

  return (
    <div className="group py-3">
      {/* Label */}
      <p className="text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </p>
      
      {/* Value */}
      <p className="text-sm font-semibold text-gray-900">
        {formatValue(value)}
      </p>
      
      {/* Bottom Border */}
      <div className="mt-3 h-px bg-gray-100 group-hover:bg-[#0096C7]/30 transition-colors duration-200" />
    </div>
  );
};