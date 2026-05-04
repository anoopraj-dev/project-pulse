import { Icon } from "@iconify/react";

import TableTabs from "@/components/shared/components/TableTabs";

const PatientStatusTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "active", label: "Active", icon: "solar:user-check-linear" },
    { key: "blocked", label: "Blocked", icon: "solar:user-block-linear" },
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

export default PatientStatusTabs;