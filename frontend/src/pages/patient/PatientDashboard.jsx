import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";
import Dashboard from "@/components/user/patient/dashboard/Dashboard";

const patientDashboard = () => {
  const {user} = useUser();
  return (
    <div className="min-h-screen">
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />
      {user?.status === "blocked" ? (
        <>
          <BlockedProfile reason={user?.blockedReason} />
        </>
      ) : (
        <>
          <PageBanner config={pageBannerConfig.patientDashboard} />
          <Dashboard/>
        </>
      )}
    </div>
  );
};

export default patientDashboard;
