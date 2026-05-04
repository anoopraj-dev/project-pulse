import { Icon } from "@iconify/react";

import TableTabs from "@/components/shared/components/TableTabs";

const PatientPaymentTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "all", label: "All", icon: "solar:wallet-linear" },
    { key: "success", label: "Success", icon: "solar:check-circle-linear" },
    { key: "failed", label: "Failed", icon: "solar:close-circle-linear" },
    { key: "refunded", label: "Refunds", icon: "solar:refresh-linear" },
  ];

  return (
    <TableTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      counts={counts}
      className="mb-4"
    />
  );
};

export default PatientPaymentTabs;