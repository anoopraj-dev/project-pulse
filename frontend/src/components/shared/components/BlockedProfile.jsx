// BlockedProfilePage.jsx
import { Icon } from "@iconify/react";

const BlockedProfile = ({ reason }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Icon icon="mdi:block-helper" className="w-20 h-20 text-red-600 mb-4" />
      
      <h1 className="text-2xl font-bold text-gray-800">
        Your account has been blocked
      </h1>

      <p className="text-gray-600 mt-2 max-w-md">
        {
          `Your profile has been temporarily blocked by the administration for ${reason}. Please contact support for more information.`}
      </p>
    </div>
  );
};

export default BlockedProfile;
