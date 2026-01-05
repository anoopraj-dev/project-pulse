import React, {  useState } from "react";
import { useParams} from "react-router-dom";
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";

//----------------------- DOCTOR PROFILE COMPONENT ---------------------
const ProfileView = ({ user,onApprove,onVerify,onReject,onBlock,onRevokeStatus,onResubmission, onResubmissionRequest, onEdit,onProfilePictureUpload,onCerticateUpload,onUnblock}) => {
  const [viewMore, setViewmore] = useState(false);
  const { id } = useParams();
  const isProfileReview = !!id;

  return (
    <div className="min-h-screen mt-18 flex flex-col items-center">
      {/* ------------Welcome text------- */}
      {!isProfileReview && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            Welcome back{" "}
            {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}!
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
              {isProfileReview ? (
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
                Dr. {user?.name.charAt(0).toUpperCase() + user?.name.slice(1)}
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
          {!isProfileReview && (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition bg-[#0096C7] hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={onEdit}
                disabled={!(user.status === 'approved' || user.status === 'resubmit')}
              >
                <Icon icon="mdi:pencil" className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition bg-[#0096C7] hover:bg-blue-600 text-white disabled:bg-gray-300 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={onProfilePictureUpload}
                disabled={!(user.status === 'approved' || user.status === 'resubmit')}
                
              >
                <Icon icon="mdi:camera" className="w-5 h-5" />
                Update Photo
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition bg-[#0096C7] hover:bg-blue-600 text-white  disabled:bg-gray-300 disabled:hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={onCerticateUpload}
                disabled={!(user.status === 'approved' || user.status === 'resubmit')}
              >
                <Icon icon="mdi:document" className="w-5 h-5" />
                Upload certifiactes
              </button>
              {user.status === "rejected" && (
                  <button
                    className="flex items-center gap-2 bg-[#0096C7] hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                    onClick={onResubmissionRequest}
                  >
                    <Icon icon="mdi:document" className="w-5 h-5" />
                    Request Re-Submission
                  </button>
                )}

                {user.status === "resubmit" &&
                (
                  <button
                    className="flex items-center gap-2 bg-[#0096C7] hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                    onClick={onResubmission}
                  >
                    <Icon icon="mdi:document" className="w-5 h-5" />
                    ReSubmit Profile
                  </button>
                )}
            </>
          )}

          {isProfileReview && (
            <>
              <button
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                onClick={() => onVerify(user._id)}
              >
                <Icon icon="mdi:file-document" className="w-5 h-5" />
                Documents
              </button>
              {user.status === "pending"  && user.isBlocked === false && !user.resubmission&& (
                <>
                  <button
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                    onClick={() => onApprove(user._id)}
                  >
                    <Icon icon="mdi:check-bold" className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                    onClick={onReject}
                  >
                    <Icon icon="mdi:close-bold" className="w-5 h-5" />
                    Reject
                  </button>
                </>
              )}
              {user?.status === "approved" && user?.isBlocked === false && (
                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                  onClick={onBlock}
                >
                  <Icon icon="mdi:block" className="w-5 h-5" />
                  Block
                </button>
              )}
              {user?.status === "requestedResubmission" && user.isBlocked === false && (
                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                  onClick={onRevokeStatus}
                >
                  <Icon icon="mdi:block" className="w-5 h-5" />
                  Revoke Status
                </button>
              )}

              {
                user?.isBlocked && (
                  <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                  onClick={onUnblock}
                >
                  <Icon icon="mdi:block" className="w-5 h-5" />
                  Unblock
                </button>
                )
              }
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
