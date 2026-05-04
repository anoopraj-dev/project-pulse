
import { Icon } from "@iconify/react";

import TableTabs from "@/components/shared/components/TableTabs";

const DoctorPaymentTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "all", label: "All", icon: "solar:wallet-linear" },

    // doctor actually earned money
    { key: "earnings", label: "Earnings", icon: "solar:check-circle-linear" },

    // settlement not processed yet
    { key: "pending", label: "Pending", icon: "solar:clock-circle-linear" },

    // refunds to patient
    { key: "refunds", label: "Refunds", icon: "solar:refresh-linear" },
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

export default DoctorPaymentTabs;