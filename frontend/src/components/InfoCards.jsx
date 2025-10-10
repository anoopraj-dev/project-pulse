import { Icon } from "@iconify/react";
import { formatLabel } from "../utilis/formLabelFormat";

const InfoCards = ({ data }) => {

  console.log(data)
  const fallback = "N/A";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full ">
      {/* Left Column */}
      <div className="flex flex-col gap-6">
        {/* Overview Card */}
        <div className="border border-[#c3d6fc] rounded-sm p-4 bg-white  w-full min-h-[200px]">
          <div className="flex gap-5 items-center mb-4">
            <Icon icon="mdi-face-male-shimmer" className="w-16 h-16 text-[#0096C7]" />
            <h3 className="text-center font-semibold text-2xl">{data?.Name.toUpperCase() || fallback}</h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <p>Patient ID</p>
              <p>{data?.["Patient Id"] || fallback}</p>
            </div>
            <div className="flex justify-between">
              <p>Member Since</p>
              <p>{data?.["Created At"] ? new Date(data["Created At"]).toLocaleDateString() : fallback}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Appointments</p>
              <p>{data?.appointment || 0}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="border border-[#c3d6fc] rounded-sm p-4 bg-white w-full min-h-[200px]">
          <div className="flex gap-5 items-center mb-4">
            <Icon icon="mdi:account" className="w-16 h-16 text-[#0096C7]" />
            <h3 className="text-center font-semibold text-2xl">Personal Information</h3>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <p>Date of Birth</p>
              <p>
                {data?.Dob ? new Date(data.Dob).toDateString() : fallback}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Email</p>
              <p>{data?.["Email"] || fallback}</p>
            </div>
            <div className="flex justify-between">
              <p>Phone</p>
              <p>{data?.['Phone'] || fallback}</p>
            </div>
            <div className="flex justify-between">
              <p>Address</p>
              <p>{data?.['Address'] || fallback}</p>
            </div>
            <div className="flex justify-between">
              <p>Employed As</p>
              <p>{data?.['Employment'] || fallback}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="border border-[#c3d6fc] rounded-sm p-4 bg-white  w-full ">
        <div className="flex gap-5 items-center mb-4">
          <Icon icon="healthicons:heart-cardiogram-24px" className="w-16 h-16 text-[#0096C7]" />
          <h3 className="text-center font-semibold text-2xl">Medical History</h3>
        </div>

        <div className="flex flex-col gap-3">
          {data?.Medical_history && Object.keys(data.Medical_history).length > 0 ? (
            Object.entries(data.Medical_history).map(([key, value], idx) => (
              <div key={idx} className="flex justify-between py-2 ">
                <p className="font-md">{formatLabel(key)}</p>
                <p>
                  {Array.isArray(value) ? value.join(", ") : value || fallback}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No medical history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
