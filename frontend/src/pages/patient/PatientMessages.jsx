import PageBanner from "@/components/shared/components/PageBanner";
import ChatContainer from "../../components/ui/messages/ChatContainer";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import { useUser } from "@/contexts/UserContext";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";

const PatientMessages = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen">
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />
      {user?.status === "blocked" ? (
        <BlockedProfile  reason={user?.blockedReason}/>
      ) : (
        <>
          <PageBanner config={pageBannerConfig.patientMessages} />
          <ChatContainer />
        </>
      )}
    </div>
  );
};

export default PatientMessages;
