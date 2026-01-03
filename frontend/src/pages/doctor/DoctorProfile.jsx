import React, { useState, useEffect } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { fetchDoctorProfile } from "../../api/doctor/doctorApis";
import { useParams } from "react-router-dom";
import ProfileView from "../../components/user/doctor/profile/ProfileView";
import ShimmerCard from "../../components/ui/loaders/ShimmerCard";
import DoctorStatusBanner from '../../components/user/doctor/profile/DoctorStatusBanner'

const DoctorProfile = () => {
  const [user, setUser] = useState(null);
  const fetchDoctorAction = useAsyncAction();
  const { id } = useParams(); 
  const fetchDoctor = async () => {
    try {
      await fetchDoctorAction.executeAsyncFn(async () => {
        const response = await fetchDoctorProfile(id); 
        setUser(response.data.user);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (fetchDoctorAction.loading) return <ShimmerCard />;
  if (!user) return null;

  return (
    <div className="flex flex-col mt-18">
      <DoctorStatusBanner approvalStatus={user?.status} variant="doctor"/>
      <ProfileView user={user} /> 
    </div>
  );
};

export default DoctorProfile;
