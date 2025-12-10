import React from "react";
import { Icon } from "@iconify/react";

const DashboardInfoCards = ({ title, val, icon, color }) => {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
      
      {/* ICON WRAPPER */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${color}`}>
        <Icon icon={icon} width="30" className="text-gray-700" />
      </div>

      {/* TEXT */}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{val}</p>
      </div>
    </div>
  );
};

export default DashboardInfoCards;
