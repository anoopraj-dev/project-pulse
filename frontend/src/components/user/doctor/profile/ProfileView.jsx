
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";
import ActionButton from "../../../shared/components/ActionButton";
import AvailabilityPreview from "../availability/AvailabilityPreview";
import { getAvailability } from "@/api/doctor/doctorApis";

//----------------------- DOCTOR PROFILE COMPONENT ---------------------
const ProfileView = ({
  viewer,
  user,
  availability,
  onApprove,
  onVerify,
  onReject,
  onBlock,
  onRevokeStatus,
  onResubmission,
  onResubmissionRequest,
  onEdit,
  onProfilePictureUpload,
  onCerticateUpload,
  onUnblock,
  onManageAvailability
}) => {
  const [viewMore, setViewmore] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const { id } = useParams();

  console.log(availability)

  const handleAction = async (action, fn) => {
    try {
      setActiveAction(action);
      await fn();
    } finally {
      setActiveAction(null);
    }
  };

  const navigate = useNavigate();

  const handleMessages = () => {
    navigate(`/patient/messages/${id}`);
  };


  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 border-4 border-gray-200 border-t-[#0096C7] rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen">
      {/* Welcome Banner */}
        <div className="my-2 bg-gradient-to-br from-sky-50 via-white to-cyan-100 rounded-xl">
        <div className="mx-auto max-w-4xl px-4 pb-6 pt-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
              Doctor · Profile
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Doctor Profile
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              View complete doctor details, specializations, and consultation options.
            </p>
          </div>
        </div>
      </div>
      
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
                    src={user?.profilePicture || "/default-avatar.png"}
                    alt={user?.name}
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover shadow-lg border-4 border-gray-100"
                  />
                  <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 border-3 sm:border-4 border-white rounded-lg" />
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 px-2 break-words">
                  Dr. {user?.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  ID: {user?.doctorId}
                </p>

                {/* Rating */}
                {user?.rating && (
                  <div className="flex items-center justify-center gap-1 mb-3 sm:mb-4">
                    <Icon
                      icon="mingcute:star-fill"
                      className="w-4 h-4 text-yellow-500"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.rating}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  {viewer === "doctor" && (
                    <>
                      <ActionButton
                        action="edit"
                        activeAction={activeAction}
                        icon="mdi:pencil"
                        text="Edit Profile"
                        onClick={() => handleAction("edit", onEdit)}
                        disabled={
                          !(
                            user?.status === "approved" ||
                            user?.status === "resubmit"
                          )
                        }
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />
                      <ActionButton
                        action="photo"
                        activeAction={activeAction}
                        icon="mdi:camera"
                        text="Update Photo"
                        onClick={() =>
                          handleAction("photo", onProfilePictureUpload)
                        }
                        disabled={
                          !(
                            user?.status === "approved" ||
                            user?.status === "resubmit"
                          )
                        }
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />
                      <ActionButton
                        action="certificate"
                        activeAction={activeAction}
                        icon="mdi:document"
                        text="Upload Certificates"
                        onClick={() =>
                          handleAction("certificate", onCerticateUpload)
                        }
                        disabled={
                          !(
                            user?.status === "approved" ||
                            user?.status === "resubmit"
                          )
                        }
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />
                       <ActionButton
                        action="availability"
                        activeAction={activeAction}
                        icon="mdi:calendar"
                        text="Manage Availability"
                        onClick={() =>
                          handleAction("availability", onManageAvailability)
                        }
                        disabled={
                          !(
                            user?.status === "approved" ||
                            user?.status === "resubmit"
                          )
                        }
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />

                      {user?.status === "rejected" && (
                        <ActionButton
                          action="request-resubmit"
                          activeAction={activeAction}
                          icon="mdi:document"
                          text="Request Re-Submission"
                          onClick={() =>
                            handleAction("request-resubmit", onResubmissionRequest)
                          }
                          className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        />
                      )}

                      {user?.status === "resubmit" && (
                        <ActionButton
                          action="resubmit"
                          activeAction={activeAction}
                          icon="mdi:document"
                          text="ReSubmit Profile"
                          onClick={() => handleAction("resubmit", onResubmission)}
                          className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        />
                      )}
                    </>
                  )}

                  {viewer === "patient" && (
                    <>
                      <ActionButton
                        action="book"
                        activeAction={activeAction}
                        icon="mdi:calendar-check"
                        text="Book Appointment"
                        onClick={() =>
                          handleAction("book", () => onVerify(user?._id))
                        }
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />
                      <ActionButton
                        action="message"
                        activeAction={activeAction}
                        icon="mdi:message-text"
                        text="Message"
                        onClick={() => handleAction("message", handleMessages)}
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />
                    </>
                  )}

                  {viewer === "admin" && (
                    <>
                      <ActionButton
                        action="documents"
                        activeAction={activeAction}
                        icon="mdi:file-document"
                        text="Documents"
                        onClick={() =>
                          handleAction("documents", () => onVerify(user?._id))
                        }
                        className="w-full bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />

                      {user?.status === "pending" &&
                        !user?.isBlocked &&
                        !user?.resubmission && (
                          <>
                            <ActionButton
                              action="approve"
                              activeAction={activeAction}
                              icon="mdi:check-bold"
                              text="Approve"
                              loadingText="Approving..."
                              onClick={() =>
                                handleAction("approve", () => onApprove(user?._id))
                              }
                              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                            />

                            <ActionButton
                              action="reject"
                              activeAction={activeAction}
                              icon="mdi:close-bold"
                              text="Reject"
                              loadingText="Rejecting..."
                              onClick={() => handleAction("reject", onReject)}
                              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                            />
                          </>
                        )}

                      {user?.status === "approved" && !user?.isBlocked && (
                        <ActionButton
                          action="block"
                          activeAction={activeAction}
                          icon="mdi:block-helper"
                          text="Block"
                          loadingText="Blocking..."
                          onClick={() => handleAction("block", onBlock)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        />
                      )}

                      {user?.status === "requestedResubmission" &&
                        !user?.isBlocked && (
                          <ActionButton
                            action="revoke"
                            activeAction={activeAction}
                            icon="mdi:block-helper"
                            text="Revoke Status"
                            loadingText="Revoking..."
                            onClick={() => handleAction("revoke", onRevokeStatus)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                          />
                        )}

                      {user?.isBlocked && (
                        <ActionButton
                          action="unblock"
                          activeAction={activeAction}
                          icon="mdi:block-helper"
                          text="Unblock"
                          loadingText="Unblocking..."
                          onClick={() => handleAction("unblock", onUnblock)}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        />
                      )}
                    </>
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
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* About Section */}
            {user?.about && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Icon
                    icon="mdi:information"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#0096C7]"
                  />
                  About
                </h3>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {user?.about?.length > 120 && !viewMore ? (
                    <>
                      <p>{user?.about.slice(0, 120)}...</p>
                      <button
                        className="text-[#0096C7] hover:text-[#0077B6] font-medium text-xs sm:text-sm mt-2 transition-colors"
                        onClick={() => setViewmore(true)}
                      >
                        View more
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{user?.about}</p>
                      {user?.about?.length > 120 && (
                        <button
                          className="text-[#0096C7] hover:text-[#0077B6] font-medium text-xs sm:text-sm mt-2 transition-colors"
                          onClick={() => setViewmore(false)}
                        >
                          View less
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Services Section */}
            {user?.services && user?.services?.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
                  <Icon
                    icon="mdi:medical-bag"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#0096C7]"
                  />
                  Services & Fees
                </h3>
                <div className="space-y-2">
                  {user?.services?.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {service.serviceType}
                      </span>
                      <span className="text-sm font-bold text-[#0096C7]">
                        ₹{service.fees}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* -------------- Availability -------------- */}

            { (viewer ==='doctor' || viewer ==='patient') && (
              
              <AvailabilityPreview availability={availability}/>
            )
            }

            {/* License & Registration */}
            {user?.professionalInfo?.medicalLicense && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <DynamicInfoSection
                  data={user?.professionalInfo?.medicalLicense}
                  title="License & Registration"
                />
              </div>
            )}

            {/* Experience */}
            {user?.professionalInfo?.experience && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <DynamicInfoSection
                  data={user?.professionalInfo?.experience}
                  title="Experience"
                />
              </div>
            )}

            {/* Education */}
            {user?.professionalInfo?.education && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5">
                <DynamicInfoSection
                  data={user?.professionalInfo?.education}
                  title="Education"
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