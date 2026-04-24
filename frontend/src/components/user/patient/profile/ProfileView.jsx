import React from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";
import { useUser } from "@/contexts/UserContext";
import ActionButton from "@/components/shared/components/ActionButton";

// ---------------- Shared Card Components --------------
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ icon, title, subtitle }) => (
  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
      <Icon icon={icon} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

const ProfileView = ({
  user,
  viewer = "patient",
  onEdit,
  onUpdateProfilePicture,
  onBlock,
  onUnblock,
  onViewMedicalRecords,
}) => {
  const { id } = useParams();
  const { profilePicture } = useUser();
  const isProfileReview = !!id;
  const isDoctorViewing = viewer === "doctor";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-3 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-950">
      <div className="w-full px-4 py-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ----------- LEFT COLUMN ----------- */}
          <div className="lg:col-span-1 space-y-4">
            {/* ----------- PROFILE CARD ----------------*/}
            <Card>
              <div className="p-5 space-y-5">
                {/* Profile Header */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative w-fit">
                    <img
                      src={
                        profilePicture || user?.profilePicture || "/profile.png"
                      }
                      alt={user?.name}
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-800"
                    />

                    {/* Edit overlay */}
                    {!isProfileReview && !isDoctorViewing && (
                      <button
                        onClick={onUpdateProfilePicture}
                        className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Icon icon="mdi:camera" className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </h2>

                    <p className="text-[11px] text-gray-400 font-mono">
                      {user?.patientId}
                    </p>
                  </div>
                </div>

                {/*----------- ACTION GRID -------------- */}
                <div className="flex gap-2">
                  {!isProfileReview && !isDoctorViewing && (
                    <>
                      <ActionButton
                        action="edit"
                        onClick={onEdit}
                        icon="mdi:pencil"
                        text="Edit"
                        className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        disabled={user?.status === "blocked"}
                      />
                    </>
                  )}

                  {isDoctorViewing && (
                    <ActionButton
                      action="viewMedicalRecords"
                      onClick={() => onViewMedicalRecords(user?._id)}
                      icon="mdi:folder-account"
                      text="Records"
                      className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                    />
                  )}

                  {!isDoctorViewing && isProfileReview && (
                    <ActionButton
                      action={user?.status === "active" ? "block" : "unblock"}
                      onClick={user?.status === "active" ? onBlock : onUnblock}
                      icon="mdi:block-helper"
                      text={user?.status === "active" ? "Block" : "Unblock"}
                      className={`py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium ${
                        user?.status === "active"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white"
                      }`}
                    />
                  )}
                </div>
              </div>
            </Card>

            {/* PERSONAL INFO */}
            <Card>
              <CardHeader
                icon="mdi:account-details"
                title="Personal Information"
                subtitle="Contact & background"
              />
              <div className="px-5 py-2">
                <BasicInfoCard val={user?.email} field="email" />
                <BasicInfoCard val={user?.gender} field="gender" />
                <BasicInfoCard val={user?.dob} field="dob" />
                <BasicInfoCard val={user?.address} field="location" />
                <BasicInfoCard val={user?.work} field="work" />
              </div>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Appointments */}
            {!isDoctorViewing && !isProfileReview && (
              <Card>
                <CardHeader
                  icon="mdi:calendar-clock"
                  title="Appointments"
                  subtitle="Upcoming schedule"
                />
                <div className="px-5 py-4">
                  {user?.appointments > 0 ? (
                    <div className="text-xs text-gray-600">
                      You have upcoming appointments.
                    </div>
                  ) : (
                    <div className="text-center py-6 text-xs text-gray-400">
                      No upcoming appointments
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Medical History */}
            {user?.medical_history && (
              <DynamicInfoSection
                data={user?.medical_history}
                title="Vitals Overview"
              />
            )}

            {/* Lifestyle */}
            {user?.lifestyle_habits && (
              <DynamicInfoSection
                data={user?.lifestyle_habits}
                title="Lifestyle & Habits"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
