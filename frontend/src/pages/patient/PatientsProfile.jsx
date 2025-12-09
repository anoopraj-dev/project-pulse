import React from "react";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Headings from "../../components/Headings";
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../components/BasicInfoCard";
import DynamicInfoSection from "../../components/DynamicInfoSection";

const PatientsProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(user)

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/patient/profile");
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPatient();
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
                    ? "mdi:face-male-shimmer"
                    : "mdi:face-female-shimmer"
                }
                className="h-12 w-12 text-[#0096C7]"
              />
              <h1 className="font-bold text-3xl text-[#0096C7]">
               {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Icon icon={"mingcute:star-fill"} className="text-yellow-600" />
              <h3 className="font-semibold">{user?.rating}</h3>
            </div>
          </div>
          <div className="flex py-2 px-5 justify-between font-medium border border-blue-100 rounded-3xl bg-blue-100">
            <span>Registration ID</span>
            <span>{user?.patientId}</span>
          </div>
        </div>

        {/* ------------Basic Personal Info----------------- */}
        <div className="flex justify-center gap-5 p-5">
          <BasicInfoCard val={user?.email} field="email" />
          <BasicInfoCard val={user?.gender} field="gender" />
          <BasicInfoCard val={user?.dob} field="dob" />
          <BasicInfoCard val={user?.address} field="location" />
          <BasicInfoCard val={user?.work} field='work'/>
        </div>

      

        {/* ------------- Medical History ------------*/}
        <div>
          <DynamicInfoSection data={user?.medical_history} title="Vitals Overview"/>
        </div>

        {/* -------------- Experience Information */}
        <div>
              <DynamicInfoSection data={user?.lifestyle_habits} title="LifeStyle & Habits"/>
        </div>
       

        {/* ----------------------Educational Information---------------------- */}
       
      </div>
    </div>
  );
};

export default PatientsProfile;
