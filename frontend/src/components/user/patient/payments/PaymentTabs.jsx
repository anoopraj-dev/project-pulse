import { Icon } from "@iconify/react";

const PatientPaymentTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "all", label: "All", icon: "solar:wallet-linear" },
    { key: "success", label: "Success", icon: "solar:check-circle-linear" },
    { key: "failed", label: "Failed", icon: "solar:close-circle-linear" },
    { key: "refunded", label: "Refunds", icon: "solar:refresh-linear" },
  ];

  return (
    <div className="mb-4">
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1 bg-slate-100 rounded-xl w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }
              `}
            >
              {/* Icon */}
              <Icon icon={tab.icon} width="18" height="18" />

              {/* Label */}
              <span>{tab.label}</span>

              {/* Optional Badge */}
              {counts[tab.key] !== undefined && (
                <span
                  className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-200 text-slate-600"
                    }
                  `}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PatientPaymentTabs;