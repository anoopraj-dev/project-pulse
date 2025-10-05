import { Icon } from "@iconify/react";

const DoctorInfo = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div>
        <div className="border border-[#B0C4F2] rounded-sm p-4 bg-white shadow-md w-[500px]">
          <div className="flex gap-5 items-center">
            <Icon icon="mdi-face-male-shimmer" className="w-16 h-16 text-[#0096C7]" />
            <h3 className="text-center font-semibold text-2xl">{data.Name}</h3>
          </div>

          <div>
            <div className="flex flex-col gap-5 py-6 px-10">
              <div className="flex justify-between">
                <p>Doctor ID</p>
                <p>{data['Dcotor ID']}</p>
              </div>
              <div className="flex justify-between">
                <p>Member Since</p>
                <p>{new Date(data['Created At']).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between">
                <p>Patients Attended</p>
                <p>{data?.appointment}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-center font-semibold text-2xl">Weekly Availability</h3>
            <div></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-15">
        <div>
          <div className="border border-[#B0C4F2] rounded-sm p-4 bg-white shadow-md w-[500px]">
            <div className="flex gap-5 items-center">
              <Icon icon="mdi-account-graduation" className="w-16 h-16 text-[#0096C7]" />
              <h3 className="text-center font-semibold text-2xl">Professional Dashboard</h3>
            </div>

            <div>
              <div className="flex flex-col gap-5 py-6 px-10">
                <div className="flex justify-between">
                  <p>Specializations</p>
                  <p>{data['Specializations']}</p>
                </div>
                <div className="flex justify-between">
                  <p>Qualifications</p>
                  <p>{new Date(data['Created At']).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between">
                  <p>Years of Experience</p>
                  <p>{data?.Experience}</p>
                </div>
                <div className="flex justify-between">
                  <p>Clinic Name</p>
                  <p>{data?.clinic}</p>
                </div>
                <div className="flex justify-between">
                  <p>Location</p>
                  <p>{data?.Experience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="border border-[#B0C4F2] rounded-sm p-4 bg-white shadow-md w-[500px]">
            <div className="flex gap-5 items-center">
              <Icon icon="mdi:account" className="w-16 h-16 text-[#0096C7]" />
              <h3 className="text-center font-semibold text-2xl">Personal Information</h3>
            </div>

            <div>
              <div className="flex flex-col gap-5 py-6 px-10">
                <div className="flex justify-between">
                  <p>Date of Birth</p>
                  <p>{data['Patient Id']}</p>
                </div>
                <div className="flex justify-between">
                  <p>Email</p>
                  <p>{data.Email}</p>
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
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
