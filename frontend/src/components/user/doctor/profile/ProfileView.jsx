import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";
import ActionButton from "../../../shared/components/ActionButton";

//----------------------- DOCTOR PROFILE COMPONENT ---------------------
const ProfileView = ({
  viewer,
  user,
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
}) => {
  const [viewMore, setViewmore] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const { id } = useParams();
  const isProfileReview = !!id;

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
    navigate(`/patient/messages/${id}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* ------------Welcome text------- */}
      {!viewer === 'doctor' && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            Welcome back{" "}
            {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)}!
          </h1>
          <p className="text-gray-600">
            Your profile is all set. You can update your details anytime.
          </p>
        </div>
      )}

      <div className="flex flex-col w-md md:w-3xl lg:w-5xl p-10 rounded-md">
        {/* -----------Header----------- */}
        <div className="flex flex-col p-5 rounded-sm hover:rounded-4xl hover:shadow-lg gap-5 hover:bg-blue-100 transition-all duration-300 ease-in-out">
          <div className="flex px-5 items-center gap-5 justify-between">
            <div className="flex items-center gap-8">
              {viewer==='admin' || 'patient' ? (
                <div className="w-32 h-32 rounded-full border border-blue-300">
                  <img
                    src={user?.profilePicture}
                    alt=""
                    className="object-cover h-32 w-32 rounded-full"
                  />
                </div>
              ) : (
                <Icon
                  icon={
                    user?.gender === "male"
                      ? "healthicons:doctor-male"
                      : "healthicons:doctor-female"
                  }
                  className="h-12 w-12 text-[#0096C7]"
                />
              )}
              <h1 className="font-bold text-3xl text-[#0096C7]">
                Dr. {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Icon icon={"mingcute:star-fill"} className="text-yellow-600" />
              <h3 className="font-semibold">{user?.rating}</h3>
            </div>
          </div>

          <div className="flex py-2 px-5 justify-between font-medium border border-blue-100 rounded-3xl bg-blue-100">
            <span>Registration ID</span>
            <span>{user?.doctorId}</span>
          </div>
        </div>

        {/* ------------Basic Personal Info----------------- */}
        <div className="flex justify-center gap-5 p-5">
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

        {/* --------------- Conditional Section ---------------------- */}

        <div className="flex justify-center gap-3">
          {viewer==='doctor' && (
            <>
              <ActionButton
                action="edit"
                activeAction={activeAction}
                icon="mdi:pencil"
                text="Edit Profile"
                onClick={() => handleAction("edit", onEdit)}
                disabled={
                  !(user?.status === "approved" || user?.status === "resubmit")
                }
                className="bg-[#0096C7] hover:bg-blue-600"
              />

              <ActionButton
                action="photo"
                activeAction={activeAction}
                icon="mdi:camera"
                text="Update Photo"
                onClick={() => handleAction("photo", onProfilePictureUpload)}
                disabled={
                  !(user?.status === "approved" || user?.status === "resubmit")
                }
                className="bg-[#0096C7] hover:bg-blue-600"
              />

              <ActionButton
                action="certificate"
                activeAction={activeAction}
                icon="mdi:document"
                text="Upload Certificates"
                onClick={() => handleAction("certificate", onCerticateUpload)}
                disabled={
                  !(user?.status === "approved" || user?.status === "resubmit")
                }
                className="bg-[#0096C7] hover:bg-blue-600"
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
                  className="bg-[#0096C7] hover:bg-blue-600"
                />
              )}

              {user?.status === "resubmit" && (
                <ActionButton
                  action="resubmit"
                  activeAction={activeAction}
                  icon="mdi:document"
                  text="ReSubmit Profile"
                  onClick={() => handleAction("resubmit", onResubmission)}
                  className="bg-[#0096C7] hover:bg-blue-600"
                />
              )}
            </>
          )}

          {
            viewer==='patient' && (
              <>
              <ActionButton
                action="documents"
                activeAction={activeAction}
                icon="mdi:file-document"
                text="Book Appointment"
                onClick={() =>
                  handleAction("documents", () => onVerify(user?._id))
                }
                className="bg-blue-500 hover:bg-blue-600"
              />
              <ActionButton
                action="documents"
                activeAction={activeAction}
                icon="mdi:file-document"
                text="Message"
                onClick={() =>
                  handleAction("documents", handleMessages)
                }
                className="bg-blue-500 hover:bg-blue-600"
              />
              </>
            )
          }

          {viewer==='admin' && (
            <>
              <ActionButton
                action="documents"
                activeAction={activeAction}
                icon="mdi:file-document"
                text="Documents"
                onClick={() =>
                  handleAction("documents", () => onVerify(user?._id))
                }
                className="bg-blue-500 hover:bg-blue-600"
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
                      className="bg-green-600 hover:bg-green-700"
                    />

                    <ActionButton
                      action="reject"
                      activeAction={activeAction}
                      icon="mdi:close-bold"
                      text="Reject"
                      loadingText="Rejecting..."
                      onClick={() => handleAction("reject", onReject)}
                      className="bg-red-600 hover:bg-red-700"
                    />
                  </>
                )}

              {user?.status === "approved" && !user?.isBlocked && (
                <ActionButton
                  action="block"
                  activeAction={activeAction}
                  icon="mdi:block"
                  text="Block"
                  loadingText="Blocking..."
                  onClick={() => handleAction("block", onBlock)}
                  className="bg-red-600 hover:bg-red-700"
                />
              )}

              {user?.status === "requestedResubmission" && !user?.isBlocked && (
                <ActionButton
                  action="revoke"
                  activeAction={activeAction}
                  icon="mdi:block"
                  text="Revoke Status"
                  loadingText="Revoking..."
                  onClick={() => handleAction("revoke", onRevokeStatus)}
                  className="bg-red-600 hover:bg-red-700"
                />
              )}

              {user?.isBlocked && (
                <ActionButton
                  action="unblock"
                  activeAction={activeAction}
                  icon="mdi:block"
                  text="Unblock"
                  loadingText="Unblocking..."
                  onClick={() => handleAction("unblock", onUnblock)}
                  className="bg-red-600 hover:bg-red-700"
                />
              )}
            </>
          )}
        </div>

        {/* -------------- About ------------- */}
        <div className="p-5">
          {user?.about?.length > 120 && !viewMore ? (
            <>
              <p>{user?.about.slice(0, 120)}...</p>
              <span
                className="text-[#0096C7] cursor-pointer"
                onClick={() => setViewmore(true)}
              >
                View more
              </span>
            </>
          ) : (
            <>
              <p>{user?.about}</p>
              <span
                className="text-[#0096C7] cursor-pointer"
                onClick={() => setViewmore(false)}
              >
                View less
              </span>
            </>
          )}
        </div>

        {/* ----------------- Services & Availability-------------- */}
        <div className="flex p-5 shadow-sm gap-5">
          <div className="flex flex-col w-96 border border-blue-100 px-10 rounded-sm">
            <h1 className="font-bold p-5 text-center">Services</h1>
            {user?.services?.map((service, index) => (
              <div key={index} className="flex justify-between py-1 border-b">
                <span>{service.serviceType}</span>
                <span>₹ {service.fees}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ------------- License & Registration ------------*/}
        <DynamicInfoSection
          data={user?.professionalInfo?.medicalLicense}
          title="License & Registration"
        />

        {/* -------------- Experience ------------*/}
        <DynamicInfoSection
          data={user?.professionalInfo?.experience}
          title="Experience"
        />

        {/* -------------- Education ------------*/}
        <DynamicInfoSection
          data={user?.professionalInfo?.education}
          title="Education"
        />
      </div>
    </div>
  );
};

export default ProfileView;
