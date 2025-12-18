import React from "react";
import { formatLabel } from "../../../utilis/formLabelFormat";
import { DetailsDisplayCard } from "./BasicInfoCard";

const DynamicInfoSection = ({ data, title = "Information", variant = "default" }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="p-8 border-t border-gray-100 bg-gray-50/50">
        <p className="text-gray-500 text-sm font-medium">No {title.toLowerCase()} data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="-mb-px flex items-center pb-4 border-b border-blue-100">
        <div className="w-6 h-px bg-gradient-to-r from-transparent via-[#0096C7] to-transparent flex-1" />
        <h2 className="px-4 text-base font-semibold text-[#0096C7] whitespace-nowrap">{title}</h2>
        <div className="w-6 h-px bg-gradient-to-r from-transparent via-[#0096C7] to-transparent flex-1" />
      </div>

      <DataGrid data={data} />
    </div>
  );
};

const DataGrid = ({ data }) => {
  if (typeof data === "string" || typeof data === "number") {
    return <DetailsDisplayCard label="Value" value={data || "Data not available"} />;
  }

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    const entries = Object.entries(data).filter(([key]) => !key.match(/^(id|_id|Id|ID)$/i));
    return (
      <div className={`grid gap-4 ${entries.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {entries.map(([key, value]) => (
          <DetailsDisplayCard 
            key={key} 
            label={formatLabel(key)} 
            value={value ?? "Data not available"} 
          />
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="pt-4 first:pt-0 border-t border-gray-100 last:border-b-0">
            {typeof item === "string" || typeof item === "number" ? (
              <DetailsDisplayCard label="" value={item ?? "Data not available"} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(item)
                  .filter(([key]) => !key.match(/^(id|_id|Id|ID)$/i))
                  .map(([key, value]) => (
                    <DetailsDisplayCard 
                      key={key} 
                      label={formatLabel(key)} 
                      value={value ?? "Data not available"} 
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default DynamicInfoSection;
