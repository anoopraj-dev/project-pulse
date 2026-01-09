
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";
import { useParams } from "react-router-dom";
import ActionButton from "../../../shared/components/ActionButton";

const ProfileView = ({
  user,
  onUpdateProfilePicture,
  onEdit,
  onBlock,
  onUnblock,
}) => {
  const { id } = useParams();
  const isProfileReview = !!id;

  if (!user) return null;

  return (
    <div className=" flex flex-col items-center">
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
      <div className="flex flex-col w-md md:w-3xl lg:w-4xl p-10 rounded-md">
        {/* -----------Header----------- */}
        <div className="flex flex-col p-5 rounded-sm hover:rounded-4xl shodow-none hover:shadow-lg gap-5 hover:bg-blue-100 transition-all duration-300 ease-in-out">
          <div className="flex  px-5 items-center gap-5 justify-between">
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
                {user?.name?.charAt(0).toUpperCase() + user?.name.slice(1)}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Icon icon={"mingcute:star-fill"} className="text-yellow-600" />
              <h3 className="font-semibold">{user?.rating}</h3>
            </div>
          </div>
          <div className="flex py-2 px-5 justify-between font-medium border border-blue-100 rounded-3xl bg-blue-100">
            <span>Registration ID</span>
            <span>{user?.patientId}</span>
          </div>
        </div>

        {/* ------------Basic Personal Info----------------- */}
        <div className="flex justify-center gap-5 p-5">
          <BasicInfoCard val={user?.email} field="email" />
          <BasicInfoCard val={user?.gender} field="gender" />
          <BasicInfoCard val={user?.dob} field="dob" />
          <BasicInfoCard val={user?.address} field="location" />
          <BasicInfoCard val={user?.work} field="work" />
        </div>

        {/* --------------- Conditional Section ---------------------- */}
        <div className="flex justify-center gap-3 m-5">
          {/* ----------- Own Profile Actions ----------- */}
          {!isProfileReview && (
            <>
              <ActionButton
                action="edit"
                activeAction={null}
                onClick={onEdit}
                icon="mdi:pencil"
                text="Edit Profile"
                className="bg-[#0096C7] hover:bg-blue-600"
                disabled={user?.status === "blocked"}
              />

              <ActionButton
                action="updatePhoto"
                activeAction={null}
                onClick={onUpdateProfilePicture}
                icon="mdi:camera"
                text="Update Photo"
                className="bg-[#0096C7] hover:bg-blue-600"
                disabled={user?.status === "blocked"}
              />
            </>
          )}

          {/* ----------- Admin Review Actions ----------- */}
          {isProfileReview && user?.status === "active" && (
            <ActionButton
              action="block"
              activeAction={null}
              onClick={onBlock}
              icon="mdi:block"
              text="Block"
              className="bg-[#0096C7] hover:bg-blue-600"
            />
          )}

          {isProfileReview && user?.status === "blocked" && (
            <ActionButton
              action="unblock"
              activeAction={null}
              onClick={onUnblock}
              icon="mdi:block"
              text="Unblock"
              className="bg-[#0096C7] hover:bg-blue-600"
            />
          )}
        </div>

        {/* ------------- Medical History ------------*/}
        <div>
          <DynamicInfoSection
            data={user?.medical_history}
            title="Vitals Overview"
          />
        </div>

        {/* -------------- Lifestyle Information */}
        <div>
          <DynamicInfoSection
            data={user?.lifestyle_habits}
            title="LifeStyle & Habits"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
