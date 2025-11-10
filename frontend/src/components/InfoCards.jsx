import { Icon } from "@iconify/react";
import { formatLabel } from "../utilis/formLabelFormat";

const InfoCards = ({ data }) => {
  const fallback = "N/A";

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-gray-100 py-2">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium">{value || fallback}</span>
    </div>
  );

  console.log(data.Lifestyle_habits)

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header Section */}
      <div className="bg-white border border-[#c3d6fc] rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#0096C7]">
            {data?.Name?.toUpperCase() || fallback}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Patient ID: {data?.["Patient Id"] || fallback}
          </p>
        </div>

        <div className="flex gap-10 mt-4 md:mt-0">
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-semibold text-gray-800">
              {data?.["Created At"]
                ? new Date(data["Created At"]).toLocaleDateString()
                : fallback}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="font-semibold text-gray-800">
              {data?.appointment || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Info Section */}
      <div className="bg-white border border-[#c3d6fc] rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-[#c3d6fc]/50 pb-3">
          <Icon icon="mdi:account-details-outline" className="w-6 h-6 text-[#0096C7]" />
          <h3 className="text-xl font-semibold text-[#0096C7]">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
          <InfoRow
            label="Date of Birth"
            value={data?.Dob ? new Date(data.Dob).toDateString() : fallback}
          />
          <InfoRow label="Email" value={data?.["Email"]} />
          <InfoRow label="Phone" value={data?.["Phone"]} />
          <InfoRow label="Address" value={data?.["Address"]} />
          <InfoRow label="Employed As" value={data?.["Work"]} />
        </div>
      </div>

      {/* Medical History Section */}
      <div className="bg-white border border-[#c3d6fc] rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-[#c3d6fc]/50 pb-3">
          <Icon icon="healthicons:stethoscope" className="w-6 h-6 text-[#0096C7]" />
          <h3 className="text-xl font-semibold text-[#0096C7]">
            Medical History
          </h3>
        </div>

        {data?.Medical_history && Object.keys(data.Medical_history).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.Medical_history).map(([key, value], idx) => (
              <div key={idx} className="flex flex-col bg-[#f9fbff] p-3 rounded-lg">
                <span className="text-gray-500 text-sm">{formatLabel(key)}</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(value) ? (
                    value.length > 0 ? (
                      value.map((item, i) => (
                        <span
                          key={i}
                          className="bg-[#d6e6fd] text-[#0096C7] px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">{fallback}</span>
                    )
                  ) : (
                    <span className="text-gray-800 font-medium">{value || fallback}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No medical history available
          </p>
        )}
      </div>

      {/* LifeStyle & Habits */}
      <div className="bg-white border border-[#c3d6fc] rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5 border-b border-[#c3d6fc]/50 pb-3">
          <Icon icon="healthicons:exercise" className="w-6 h-6 text-[#0096C7]" />
          <h3 className="text-xl font-semibold text-[#0096C7]">
            Lifestyle & Habits
          </h3>
        </div>
        {data?.Lifestyle_habits && Object.keys(data?.Lifestyle_habits).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.Lifestyle_habits).map(([key, value], idx) => (
              <div key={idx} className="flex flex-col bg-[#f9fbff] p-3 rounded-lg">
                <span className="text-gray-500 text-sm">{formatLabel(key)}</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(value) ? (
                    value.length > 0 ? (
                      value.map((item, i) => (
                        <span
                          key={i}
                          className="bg-[#d6e6fd] text-[#0096C7] px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">{fallback}</span>
                    )
                  ) : (
                    <span className="text-gray-800 font-medium">{value || fallback}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No lifestyle data available
          </p>
        )}
      </div>


    </div>
  );
};

export default InfoCards;
