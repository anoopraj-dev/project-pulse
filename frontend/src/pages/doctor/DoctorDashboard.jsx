import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import DoctorStatusBanner from "@/components/user/doctor/profile/DoctorStatusBanner";

const DoctorDashboard = () => {
  const { user } = useUser();
  return (
    <div>
       <DoctorStatusBanner
            approvalStatus={user?.status}
            submissionCount={user?.submissionCount}
            variant="doctor"
          />
      {user?.isBlocked ? (
        <>
         
          <BlockedProfile />
        </>
      ) : (
        <>
          <PageBanner config={pageBannerConfig.doctorDashboard} />
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;
