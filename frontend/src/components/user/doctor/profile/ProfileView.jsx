import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";
import AvailabilityPreview from "../availability/AvailabilityPreview";
import ActionButton from "@/components/shared/components/ActionButton";

//------------- Card Shell --------------
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  icon,
  iconBg = "bg-blue-50 dark:bg-blue-950",
  iconColor = "text-blue-600 dark:text-blue-400",
  title,
  subtitle,
  right,
}) => (
  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        <Icon icon={icon} className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {right && <div>{right}</div>}
  </div>
);

// ------------ MAIN COMPONENT ------------------
const ProfileView = ({
  viewer,
  user,
  availability,
  onBookAppointment,
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
  onManageAvailability,
}) => {
  const [viewMore, setViewmore] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const isSlotExpired = (date, endTime, isBooked) => {
    if (isBooked) return false;

    const now = new Date();
    const slotDateTime = new Date(date);

    const [h, m] = endTime.split(":").map(Number);
    slotDateTime.setHours(h, m, 0, 0);

    return slotDateTime < now;
  };

  const handleAction = async (action, fn) => {
    try {
      setActiveAction(action);
      await fn();
    } finally {
      setActiveAction(null);
    }
  };

  const canEdit = user?.status === "approved" || user?.status === "resubmit";

  const filteredAvailability = availability
    ?.map((day) => {
      const validSlots = day.slots.filter(
        (slot) =>
          !slot.isBooked &&
          !isSlotExpired(day.date, slot.endTime, slot.isBooked),
      );

      return { ...day, slots: validSlots };
    })
    .filter((day) => day.slots.length > 0);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-3 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading profile…</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="w-full px-4 py-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* -------------- LEFT COLUMN ---------------*/}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <div className="p-5 space-y-5">
                {/* ── TOP PROFILE ── */}
                <div className="flex items-center gap-4">
                  {/* Avatar with edit icon */}
                  <div className="relative w-fit">
                    <img
                      src={user?.profilePicture || "/profile.png"}
                      alt={user?.name}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-800"
                    />

                    {viewer === "doctor" && canEdit && (
                      <button
                        onClick={() =>
                          handleAction("photo", onProfilePictureUpload)
                        }
                        className="absolute bottom-0 right-0 p-1.5 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                      >
                        <Icon icon="mdi:camera" className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      Dr. {user?.name}
                    </h2>

                    <p className="text-[11px] text-gray-400 font-mono">
                      {user?.doctorId}
                    </p>

                    {/* Rating */}
                    {user?.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            icon="mingcute:star-fill"
                            className={`w-3 h-3 ${
                              i < Math.round(user.rating)
                                ? "text-yellow-400"
                                : "text-gray-200 dark:text-gray-700"
                            }`}
                          />
                        ))}
                        <span className="text-[11px] text-gray-600 dark:text-gray-300 ml-1">
                          {user?.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/*---------- ACTION GRID ----------*/}
                <div className="flex gap-2">
                  {/* DOCTOR */}
                  {viewer === "doctor" && (
                    <>
                      <ActionButton
                        action="edit"
                        activeAction={activeAction}
                        icon="mdi:pencil"
                        text="Edit"
                        onClick={() => handleAction("edit", onEdit)}
                        disabled={
                          !(
                            user?.status === "approved" ||
                            user?.status === "resubmit"
                          )
                        }
                        className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />

                      <ActionButton
                        action="certificate"
                        activeAction={activeAction}
                        icon="mdi:document"
                        text="Docs"
                        onClick={() =>
                          handleAction("certificate", onCerticateUpload)
                        }
                        disabled={
                          !(
                            user?.status === "approved" ||
                            user?.status === "resubmit"
                          )
                        }
                        className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />

                      <ActionButton
                        action="availability"
                        activeAction={activeAction}
                        icon="mdi:calendar"
                        text="Slots"
                        onClick={() =>
                          handleAction("availability", onManageAvailability)
                        }
                        disabled={
                          !(
                            user?.status === "approved" ||
                            user?.status === "resubmit"
                          )
                        }
                        className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                      />

                      {user?.status === "rejected" && (
                        <ActionButton
                          action="request-resubmit"
                          activeAction={activeAction}
                          icon="mdi:document"
                          text="Re-Submission"
                          onClick={() =>
                            handleAction(
                              "request-resubmit",
                              onResubmissionRequest,
                            )
                          }
                          className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        />
                      )}

                      {user?.status === "resubmit" && (
                        <ActionButton
                          action="resubmit"
                          activeAction={activeAction}
                          icon="mdi:document"
                          text="ReSubmit"
                          onClick={() =>
                            handleAction("resubmit", onResubmission)
                          }
                          className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        />
                      )}
                    </>
                  )}

                  {/* PATIENT */}
                  {viewer === "patient" && (
                    <ActionButton
                      action="book"
                      activeAction={activeAction}
                      icon="mdi:calendar-check"
                      text="Book Appointment"
                      onClick={() =>
                        handleAction("book", () => onBookAppointment(user?._id))
                      }
                      className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                    />
                  )}

                  {/* ADMIN */}
                  {viewer === "admin" && (
                    <>
                      <ActionButton
                        action="documents"
                        activeAction={activeAction}
                        icon="mdi:file-document"
                        text="Docs"
                        onClick={() =>
                          handleAction("documents", () => onVerify(user?._id))
                        }
                        className="bg-[#0096C7] hover:bg-[#0077B6] text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
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
                                handleAction("approve", () =>
                                  onApprove(user?._id),
                                )
                              }
                              className="bg-green-500 hover:bg-green-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                            />

                            <ActionButton
                              action="reject"
                              activeAction={activeAction}
                              icon="mdi:close-bold"
                              text="Reject"
                              loadingText="Rejecting..."
                              onClick={() => handleAction("reject", onReject)}
                              className="bg-red-500 hover:bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
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
                          className="bg-red-500 hover:bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
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
                            onClick={() =>
                              handleAction("revoke", onRevokeStatus)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
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
                          className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-medium"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* ── Personal Information ── */}
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
            </Card>
          </div>

          {/* ------------- RIGHT COLUMN -------------*/}
          <div className="lg:col-span-2 space-y-4">
            {/* Availability first */}
            {(viewer === "doctor" || viewer === "patient") && (
              <AvailabilityPreview availability={filteredAvailability} />
            )}

            {/* About */}
            {user?.about && (
              <Card>
                <CardHeader
                  icon="mdi:information-outline"
                  title="About"
                  subtitle="Professional summary"
                />
                <div className="px-5 py-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {user.about.length > 200 && !viewMore
                      ? `${user.about.slice(0, 200)}…`
                      : user.about}
                  </p>
                  {user.about.length > 200 && (
                    <button
                      onClick={() => setViewmore((v) => !v)}
                      className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      <Icon
                        icon={viewMore ? "mdi:chevron-up" : "mdi:chevron-down"}
                        className="w-3.5 h-3.5"
                      />
                      {viewMore ? "View less" : "View more"}
                    </button>
                  )}
                </div>
              </Card>
            )}

            {/* Services & Fees */}
            {user?.services?.length > 0 && (
              <Card>
                <CardHeader
                  icon="mdi:medical-bag"
                  iconBg="bg-emerald-50 dark:bg-emerald-950"
                  iconColor="text-emerald-600 dark:text-emerald-400"
                  title="Services & Fees"
                  subtitle="Available consultation types"
                  right={
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 uppercase tracking-wide">
                      {user.services.length} service
                      {user.services.length !== 1 ? "s" : ""}
                    </span>
                  }
                />
                <div className="px-5 py-2">
                  {user.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800/60 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center flex-shrink-0">
                          <Icon
                            icon="mdi:stethoscope"
                            className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {service.serviceType}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 tabular-nums">
                        ₹{service.fees}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* License & Registration */}
            {user?.professionalInfo?.medicalLicense && (
              <DynamicInfoSection
                data={user.professionalInfo.medicalLicense}
                title="License & Registration"
              />
            )}

            {/* Experience */}
            {user?.professionalInfo?.experience && (
              <DynamicInfoSection
                data={user.professionalInfo.experience}
                title="Experience"
              />
            )}

            {/* Education */}
            {user?.professionalInfo?.education && (
              <DynamicInfoSection
                data={user.professionalInfo.education}
                title="Education"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
