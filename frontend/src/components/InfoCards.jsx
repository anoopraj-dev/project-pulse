import { Icon } from "@iconify/react";

const InfoCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      {/* Left Column */}
      <div className="flex flex-col gap-15">
        {/* Overview Card */}
        <div className="border border-[#B0C4F2] rounded-sm p-4 bg-white shadow-md w-[500px]">
          <div className="flex gap-5 items-center">
            <Icon icon="mdi-face-male-shimmer" className="w-16 h-16 text-[#0096C7]" />
            <h3 className="text-center font-semibold text-2xl">{data.Name}</h3>
          </div>

          <div className="flex flex-col gap-5 py-6 px-10">
            <div className="flex justify-between">
              <p>Patient ID</p>
              <p>{data["Patient Id"]}</p>
            </div>
            <div className="flex justify-between">
              <p>Member Since</p>
              <p>{new Date(data["Created At"]).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Total Appointments</p>
              <p>{data?.appointment}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="border border-[#B0C4F2] rounded-sm p-4 bg-white shadow-md w-[500px] mt-6">
          <div className="flex gap-5 items-center">
            <Icon icon="mdi:account" className="w-16 h-16 text-[#0096C7]" />
            <h3 className="text-center font-semibold text-2xl">Personal Information</h3>
          </div>

          <div className="flex flex-col gap-5 py-6 px-10">
            <div className="flex justify-between">
              <p>Date of Birth</p>
              <p>{data["Patient Id"]}</p>
            </div>
            <div className="flex justify-between">
              <p>Email</p>
              <p>{new Date(data["Created At"]).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-between">
              <p>Phone</p>
              <p>{data?.appointment}</p>
            </div>
            <div className="flex justify-between">
              <p>Address</p>
              <p>{data?.appointment}</p>
            </div>
            <div className="flex justify-between">
              <p>Employed As</p>
              <p>{data?.appointment}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="border border-[#B0C4F2] rounded-sm p-4 bg-white shadow-md w-[500px]">
        <div className="flex gap-5 items-center">
          <Icon icon="healthicons:heart-cardiogram-24px" className="w-16 h-16 text-[#0096C7]" />
          <h3 className="text-center font-semibold text-2xl">Medical History</h3>
        </div>

        <div className="flex flex-col gap-5 py-6 px-10">
          <div className="flex justify-between">
            <p>Date of Birth</p>
            <p>{data["Patient Id"]}</p>
          </div>
          <div className="flex justify-between">
            <p>Email</p>
            <p>{new Date(data["Created At"]).toLocaleDateString()}</p>
          </div>
          <div className="flex justify-between">
            <p>Phone</p>
            <p>{data?.appointment}</p>
          </div>
          <div className="flex justify-between">
            <p>Address</p>
            <p>{data?.appointment}</p>
          </div>
          <div className="flex justify-between">
            <p>Employed As</p>
            <p>{data?.appointment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
