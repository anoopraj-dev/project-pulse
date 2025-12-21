import React from "react";
import { useEffect, useState } from "react";
import Headings from "../../components/shared/components/Headings";
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../components/ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../components/ui/cards/DynamicInfoSection";
import ShimmerCard from "../../components/ui/loaders/ShimmerCard";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPatientProfile } from "../../api/patient/patientApis";
import SidebarShimmer from "../../components/ui/loaders/SidebarShimmer";


const PatientsProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const isProfileReview = !!id;
  const navigate = useNavigate();

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await fetchPatientProfile();
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileEdit = () => {
    navigate('/patient/edit-profile');
  }

  useEffect(() => {
    fetchPatient();
  }, []);

  if (loading) return <div className="flex"> <SidebarShimmer/> <ShimmerCard/></div>;
  if (!user) return <div className="flex"> <SidebarShimmer/> <ShimmerCard/></div>;

  return (
    <div className=" mt-18  flex flex-col items-center">
      <Headings
        text={`Welcome ${
          user?.name?.charAt(0).toUpperCase() + user?.name.slice(1)
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
                {user?.name?.charAt(0).toUpperCase() + user?.name.slice(1)}
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
          <BasicInfoCard val={user?.work} field="work" />
        </div>

         {/* --------------- Conditional Section ---------------------- */}
        <div className="flex justify-center gap-3">
          {!isProfileReview && (
            <>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition" onClick={handleProfileEdit}>
                <Icon icon="mdi:pencil" className="w-5 h-5" />
                Edit Profile
              </button>
              <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl transition">
                <Icon icon="mdi:camera" className="w-5 h-5" />
                Update Photo
              </button>
            </>
          )}
          </div>

        {/* ------------- Medical History ------------*/}
        <div>
          <DynamicInfoSection
            data={user?.medical_history}
            title="Vitals Overview"
          />
        </div>

        {/* -------------- Lifestyle Information */}
        <div>
          <DynamicInfoSection
            data={user?.lifestyle_habits}
            title="LifeStyle & Habits"
          />
        </div>
      </div>
    </div>
  );
};

export default PatientsProfile;
