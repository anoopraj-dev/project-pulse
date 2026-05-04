import { Icon } from "@iconify/react";

import TableTabs from "@/components/shared/components/TableTabs";

const PatientAppointmentTabs = ({ activeTab, setActiveTab, counts = {} }) => {
  const tabs = [
    { key: "book", label: "Book", icon: "solar:calendar-add-linear" },
    { key: "confirmed", label: "Upcoming", icon: "solar:clock-circle-linear" },
    { key: "cancelled", label: "Cancelled", icon: "solar:close-circle-linear" },
    { key: "history", label: "History", icon: "solar:history-linear" },
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

export default PatientAppointmentTabs;