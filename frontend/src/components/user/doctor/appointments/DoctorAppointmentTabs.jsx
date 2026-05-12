import { Icon } from "@iconify/react";

import TableTabs from "@/components/shared/components/TableTabs";

const DoctorAppointmentTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "upcoming", label: "Upcoming", icon: "solar:clock-circle-linear" },
    { key: "cancelled", label: "Cancelled", icon: "solar:close-circle-linear" },
    { key: "history", label: "History", icon: "solar:history-linear" },
    { key: "expired", label: "Expired", icon: "solar:calendar-remove-linear" },
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

export default DoctorAppointmentTabs;