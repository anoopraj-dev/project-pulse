import React from "react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Headings from "../../components/Headings";
import { Icon } from "@iconify/react";
import BasicInfoCard, {
  DetailsDisplayCard,
} from "../../components/BasicInfoCard";
import DynamicInfoSection from "../../components/DynamicInfoSection";

const DoctorsProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMore, setViewmore] = useState(false);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/doctor/profile");
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDoctor();
  }, []);
  return (
    <div className=" mt-18  flex flex-col items-center">
      <Headings
        text={`Welcome ${
          user?.name.charAt(0).toUpperCase() + user?.name.slice(1)
        }`}
      />
      <div className="flex flex-col w-md md:w-3xl lg:w-4xl border border-blue-100 p-10 rounded-md">
        {/* -----------Header----------- */}
        <div className="flex flex-col p-5 rounded-sm hover:rounded-4xl shodow-none hover:shadow-lg gap-5 hover:bg-blue-100 transition-all duration-300 ease-in-out">
          <div className="flex  px-5 items-center gap-5 justify-between">
            <div className="flex items-center gap-8">
              <Icon
                icon={
                  user?.gender === "male"
                    ? "healthicons:doctor-male"
                    : "healthicons:doctor-female"
                }
                className="h-12 w-12 text-[#0096C7]"
              />
              <h1 className="font-bold text-3xl text-[#0096C7]">
                Dr. {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Icon icon={"mingcute:star-fill"} className="text-yellow-600" />
              <h3 className="font-semibold">{user?.rating}</h3>
            </div>
          </div>
          <div className="flex py-2 px-5 justify-between font-medium border border-blue-100 rounded-3xl bg-blue-100">
            <span>Registration ID</span>
            <span>{user?.doctorId}</span>
          </div>
        </div>

        {/* ------------Basic Personal Info----------------- */}
        <div className="flex justify-center gap-5 p-5">
          <BasicInfoCard val={user?.email} field="email" />
          <BasicInfoCard val={user?.gender} field="gender" />
          <BasicInfoCard val={user?.dob} field="dob" />
          <BasicInfoCard val={user?.location} field="location" />
          <BasicInfoCard
            val={user?.professionalInfo?.qualifications}
            field="education"
          />
          <BasicInfoCard
            val={user?.professionalInfo?.specializations}
            field="specialization"
          />
        </div>

        {/* -------------- About ------------- */}
        <div className="p-5 transition-all duration-500 ease-in-out">
          {user?.about.length > 120 && !viewMore ? (
            <div className="transition-all duration-500 ease-in-out">
              <p>{user?.about.slice(0, 120) + "..."}</p>
              <span
                className=" font-medium text-[#0096C7] cursor-pointer "
                onClick={() => setViewmore(true)}
              >
                View more
              </span>
            </div>
          ) : (
            <div>
              <p>{user?.about}</p>
              <span
                className=" font-medium text-[#0096C7] cursor-pointer"
                onClick={() => setViewmore(false)}
              >
                View less
              </span>
            </div>
          )}
        </div>
        {/* ----------------- Services & Availability--------------  */}

        <div>
          <div className="flex p-5 shadow-sm gap-5">
            <div className="flex flex-col w-96 h-46 border border-blue-100 px-10 rounded-sm">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"mingcute-briefcase-fill"}
                  className="text-[#0096C7] h-6 w-6"
                />
                <h1 className="font-bold p-5">Services</h1>
              </div>

              {/* ------------Services & Fee------------ */}
              {user?.services?.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between py-1 border-b border-gray-200"
                >
                  <span>{service.serviceType}</span>
                  <span>₹ {service.fees}</span>
                </div>
              ))}
            </div>

            <div className="h-46 border border-blue-100 rounded-sm p-5">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"mingcute:calendar-2-fill"}
                  className="text-[#0096C7] h-6 w-6"
                />
                <h1 className="font-bold p-5">Availability</h1>
              </div>
              {user?.services?.availableDates ? (
                <div></div>
              ) : (
                <p className="text-gray-300">No available information!</p>
              )}
            </div>
          </div>
        </div>

        {/* ------------- License & Registration ------------*/}
        <div>
          <DynamicInfoSection
            data={user?.professionalInfo?.medicalLicense}
            title="License & Registration "
          />
        </div>

        {/* -------------- Experience Information */}
        <div>
          <DynamicInfoSection
            data={user?.professionalInfo.experience}
            title="Experience"
          />
        </div>

        {/* ----------------------Educational Information---------------------- */}
        <div>
          <DynamicInfoSection
            data={user?.professionalInfo?.education}
            title="Education"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorsProfile;
