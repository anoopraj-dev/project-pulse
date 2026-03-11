
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";
import { useParams } from "react-router-dom";
import ActionButton from "../../../shared/components/ActionButton";
import { useUser } from "@/contexts/UserContext";

const ProfileView = ({
  user,
  viewer = "patient", 
  onUpdateProfilePicture,
  onEdit,
  onBlock,
  onUnblock,
  onViewMedicalRecords, 
}) => {
  const { id } = useParams();
  const isProfileReview = !!id;
  const {profilePicture} = useUser();
  console.log(profilePicture)

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 border-4 border-gray-200 border-t-[#0096C7] rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );

  const isDoctorViewing = viewer === "doctor";

  return (
    <div className="min-h-screen ">

      <div className="w-full px-4 pb-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-5">
            {/* Profile Picture & Name */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <div className="text-center mb-4 sm:mb-5">
                <div className="relative inline-block mb-3 sm:mb-4">
                  <img
                    src={profilePicture || user?.profilePicture || "/profile.png"}
                    alt={user?.name}
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover shadow-lg border-4 border-gray-100"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 border-3 sm:border-4 border-white rounded-lg" />
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 px-2 break-words">
                  {user?.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  ID: {user?.patientId}
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!isProfileReview && !isDoctorViewing && (
                    <>
                      <ActionButton
                        action="edit"
                        onClick={onEdit}
                        icon="mdi:pencil"
                        text="Edit Profile"
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        disabled={user?.status === "blocked"}
                      />
                      <ActionButton
                        action="updatePhoto"
                        onClick={onUpdateProfilePicture}
                        icon="mdi:camera"
                        text="Update Photo"
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        disabled={user?.status === "blocked"}
                      />
                    </>
                  )}

                  {isDoctorViewing && (
                    <ActionButton
                      action="viewMedicalRecords"
                      onClick={onViewMedicalRecords}
                      icon="mdi:folder-account"
                      text="View Medical Records"
                      className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                    />
                  )}

                  {!isDoctorViewing && isProfileReview && (
                    <ActionButton
                      action={user?.status === "active" ? "block" : "unblock"}
                      onClick={user?.status === "active" ? onBlock : onUnblock}
                      icon="mdi:block-helper"
                      text={
                        user?.status === "active" ? "Block User" : "Unblock User"
                      }
                      className={`w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium ${
                        user?.status === "active"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Icon
                  icon="mdi:account-details"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0096C7]"
                />
                Personal Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <BasicInfoCard val={user?.email} field="email" />
                <BasicInfoCard val={user?.gender} field="gender" />
                <BasicInfoCard val={user?.dob} field="dob" />
                <BasicInfoCard val={user?.address} field="location" />
                <BasicInfoCard val={user?.work} field="work" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Upcoming Appointments or Stats (hide if doctor viewing) */}
            {!isDoctorViewing && !isProfileReview && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                {/* --- keep entire appointments section as-is --- */}
                <div className="flex items-center justify-between mb-4 sm:mb-5 gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Icon
                      icon="mdi:calendar-clock"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#0096C7]"
                    />
                    <span className="hidden xs:inline">Upcoming Appointments</span>
                    <span className="xs:hidden">Appointments</span>
                  </h3>
                  <button className="text-xs sm:text-sm text-[#0096C7] hover:text-[#0077B6] font-medium transition-colors whitespace-nowrap">
                    View All
                  </button>
                </div>

                {/* Appointments Placeholder */}
                <div className="space-y-2 sm:space-y-3">
                  {user?.appointments > 0 ? (
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#0096C7]/10 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Icon
                          icon="mdi:doctor"
                          className="w-5 h-5 sm:w-6 sm:h-6 text-[#0096C7]"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                          General Checkup
                        </p>
                        <p className="text-xs text-gray-500">
                          Tomorrow at 10:00 AM
                        </p>
                      </div>
                      <Icon
                        icon="mdi:chevron-right"
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Icon
                          icon="mdi:calendar-blank"
                          className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        No upcoming appointments
                      </p>
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100">
                  <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      {user?.appointments || 0}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      Appointments
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      {user?.visits || 0}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      Visits
                    </div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                      {user?.rating || "N/A"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-medium">
                      Rating
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical History */}
            {user?.medical_history && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <DynamicInfoSection
                  data={user?.medical_history}
                  title="Vitals Overview"
                />
              </div>
            )}

            {/* Lifestyle Habits */}
            {user?.lifestyle_habits && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <DynamicInfoSection
                  data={user?.lifestyle_habits}
                  title="Lifestyle & Habits"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;