import { Icon } from "@iconify/react";

import TableTabs from "@/components/shared/components/TableTabs";

const AdminAppointmentTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "all", label: "All", icon: "solar:list-linear" },
    { key: "upcoming", label: "Confirmed", icon: "solar:check-circle-linear" },
    { key: "pending", label: "Pending", icon: "solar:clock-circle-linear" },
    { key: "cancelled", label: "Cancelled", icon: "solar:close-circle-linear" },
    { key: "history", label: "Completed", icon: "solar:history-linear" },
    { key: "expired", label: "Expired", icon: "solar:calendar-remove-linear" },
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

export default AdminAppointmentTabs;