import { Icon } from "@iconify/react";
import React from "react";

const BasicInfoCard = ({ field, val }) => {
  const icons = {
    email: "mingcute:mail-line",
    dob: "mingcute:birthday-2-line",
    gender: "mdi:gender-male-female",
    location: "mingcute:location-2-fill",
    education: "material-symbols:school-rounded",
    specialization:'healthicons:stethoscope-24px',
    work:'mdi:briefcase-variant'
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
    <div className=" group relative w-20 hover:w-80 h-24 min-h-[96px] transition-all duration-300 flex items-center  border border-blue-100 rounded-md bg-white p-3 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg">
      <div className=" absolute left-5 w-10 h-10  flex justify-center items-center  bg-white rounded">
        <Icon icon={icons[field] || "mingcute:info"} className="text-xl text-[#0096C7] " />
      </div>
      <div className="ml-14 w-full h-full flex flex-col justify-center pt-2">
        {Array.isArray(val) && val.length > 0 ? (
          <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 space-y-1">
            {val.map((item, index) => (
              <p key={index} className="text-sm text-gray-800 font-medium leading-tight">
                {String(item)}
              </p>
            ))}
          </div>
        ) : (
          <p className="opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-sm text-gray-800 font-semibold leading-tight">
            {formattedValue}
          </p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoCard;


// Updated DetailsDisplayCard to match BasicInfoCard styling
export const DetailsDisplayCard = ({ label, value }) => {
  return (
    <div className="group relative p-4 border border-gray-200/50 rounded-md bg-white/60 backdrop-blur-sm 
                    hover:border-[#0096C7]/30 hover:bg-[#0096C7]/2 hover:shadow-sm 
                    transition-all duration-200 w-full">
      
      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      
      <p className="text-lg font-semibold text-gray-900 leading-tight truncate">
        {value ?? <span className="text-gray-500 font-normal">—</span>}
      </p>
      
      <div className="absolute inset-0 bg-gradient-to-r from-[#0096C7]/0 via-[#0096C7]/3 to-[#0096C7]/0 
                      opacity-0 group-hover:opacity-100 rounded-md transition-all duration-400 pointer-events-none" />
      
      <div className="absolute -bottom-1 left-0 h-0.5 bg-[#0096C7]/40 w-0 group-hover:w-full 
                      transition-all duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
    </div>
  );
};




