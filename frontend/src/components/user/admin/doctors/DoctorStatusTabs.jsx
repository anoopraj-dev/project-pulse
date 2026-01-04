const DoctorStatusTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "approved", label: "Active Doctors" },
    { key: "blocked", label: "Blocked Doctors" },
    { key: "pending", label: "Pending Request" },
    { key: 'rejected',label: 'Rejected Request'}
  ];

  return (
    <div className="flex border-b border-blue-200 mb-6">
      {tabs?.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 font-medium transition ${
            activeTab === tab.key
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DoctorStatusTabs;
