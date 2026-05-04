import { Icon } from "@iconify/react";

import TableTabs from "@/components/shared/components/TableTabs";

const DoctorStatusTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "approved", label: "Active", icon: "solar:user-check-linear" },
    { key: "blocked", label: "Blocked", icon: "solar:user-block-linear" },
    { key: "pending", label: "Pending", icon: "solar:clock-circle-linear" },
    { key: "rejected", label: "Rejected", icon: "solar:close-circle-linear" },
    { key: "requestedResubmission", label: "Resubmissions", icon: "solar:refresh-linear" },
  ];

  return (
    <TableTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      counts={counts}
      className="mb-4 lg:justify-center"
    />
  );
};

export default DoctorStatusTabs;