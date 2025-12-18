import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { Icon } from "@iconify/react";
import BasicInfoCard from "../../components/BasicInfoCard";
import DynamicInfoSection from "../../components/DynamicInfoSection";
import ShimmerCard from "../../components/ShimmerCard";
import toast from "react-hot-toast";
import { useModal } from "../../contexts/ModalContext";
import PrimaryButton from "../../components/PrimaryButton";
import { useAsyncAction } from "../../customHooks/useAsyncAction";

const DoctorsProfile = () => {
  const [user, setUser] = useState(null);
  const [viewMore, setViewmore] = useState(false);
  const { id } = useParams();
  const isProfileReview = !!id;
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const fetchDoctorAction = useAsyncAction();
  const approveAction = useAsyncAction();
  const rejectAction = useAsyncAction();

  //------------ FETCH DOCTOR --------------
  const fetchDoctor = async () => {
    try {
      await fetchDoctorAction.executeAsyncFn(async () => {
        let response;
        if (id) {
          //---------for admin profile review -------------
          response = await api.get(`/api/admin/doctor/${id}`);
          setUser(response.data.user);
        } else {
          //--------- when logged in as doctor---------------
          response = await api.get("/api/doctor/profile");
          setUser(response.data.user);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //-------------APPROVE DOCTORS-------------

  const handleApprove = async () => {
    try {
      await approveAction.executeAsyncFn(async () => {
        const res = await api.post(`/api/admin/doctor/approve/${user._id}`);
        if (res.data.success) {
          toast.success(res.data.message);
          navigate("/admin/dashboard");
        }
      });
    } catch (err) {
      toast("Request Approval Failed");
    }
  };

  // ------------------REJECT DOCTORS------------

  const handleReject = async () => {
    try {
      openModal("Reject this request?", PrimaryButton, {
        text: rejectAction.loading ? "Processing.." : "Continue",
        disabled: rejectAction.loading,
        onClick: async () => {
          try {
            // ------------DELETE DOCTOR FROM DB--------------
            await rejectAction.executeAsyncFn(async () => {
              const response = await api.delete(
                `/api/admin/doctor/reject/${user._id}`
              );

              if (response.data.success) {
                toast.success(`Rejected request from ${user.name}`);
                navigate("/admin/dashboard");
              } else {
                toast.error("Request rejection failed");
              }
            });
          } catch (err) {
            toast.error("Request rejection failed");
          }

          closeModal();
        },
      });
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (fetchDoctorAction.loading) return <ShimmerCard />;

  return (
    <div className="min-h-screen mt-18  flex flex-col items-center">
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
      <div className="flex flex-col w-md md:w-3xl lg:w-5xl  p-10 rounded-md">
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

        {/* --------------- Conditional Section (doctor/admin) ---------------------- */}

        <div className="flex justify-center gap-3">
          {!isProfileReview && (
            <>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition">
                <Icon icon="mdi:pencil" className="w-5 h-5" />
                Edit Profile
              </button>
              <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl transition">
                <Icon icon="mdi:camera" className="w-5 h-5" />
                Update Photo
              </button>
            </>
          )}

          {isProfileReview && (
            <>
              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                onClick={handleApprove}
                disabled={approveAction.loading}
              >
                {approveAction.loading ? (
                  <Icon icon={"line:md-uploading"} className="w-5 h-5" />
                ) : (
                  <Icon icon="mdi:check-bold" className="w-5 h-5" />
                )}
                Approve
              </button>
              <button
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                onClick={handleReject}
              >
                <Icon icon="mdi:close-bold" className="w-5 h-5" />
                Reject
              </button>
            </>
          )}
        </div>

        {/* -------------- About ------------- */}
        <div className="p-5 transition-all duration-500 ease-in-out">
          {user?.about?.length > 120 && !viewMore ? (
            <div className="transition-all duration-500 ease-in-out">
              <p>{user?.about?.slice(0, 120) + "..."}</p>
              <span
                className=" font-medium text-[#0096C7] cursor-pointer "
                onClick={() => setViewmore(true)}
              >
                View more
              </span>
            </div>
          ) : (
            <div>
              <p>{user?.about}</p>
              <span
                className=" font-medium text-[#0096C7] cursor-pointer"
                onClick={() => setViewmore(false)}
              >
                View less
              </span>
            </div>
          )}
        </div>
        {/* ----------------- Services & Availability--------------  */}

        <div>
          <div className="flex p-5 shadow-sm gap-5">
            <div className="flex flex-col w-96 h-46 border border-blue-100 px-10 rounded-sm">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"mingcute-briefcase-fill"}
                  className="text-[#0096C7] h-6 w-6"
                />
                <h1 className="font-bold p-5">Services</h1>
              </div>

              {/* ------------Services & Fee------------ */}
              {user?.services?.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between py-1 border-b border-gray-200"
                >
                  <span>{service.serviceType}</span>
                  <span>₹ {service.fees}</span>
                </div>
              ))}
            </div>

            <div className="h-46 border border-blue-100 rounded-sm p-5">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"mingcute:calendar-2-fill"}
                  className="text-[#0096C7] h-6 w-6"
                />
                <h1 className="font-bold p-5">Availability</h1>
              </div>
              {user?.services?.availableDates ? (
                <div></div>
              ) : (
                <p className="text-gray-300">No available information!</p>
              )}
            </div>
          </div>
        </div>

        {/* ------------- License & Registration ------------*/}
        <div>
          <DynamicInfoSection
            data={user?.professionalInfo?.medicalLicense}
            title="License & Registration "
          />
        </div>

        {/* -------------- Experience Information */}
        <div>
          <DynamicInfoSection
            data={user?.professionalInfo.experience}
            title="Experience"
          />
        </div>

        {/* ----------------------Educational Information---------------------- */}
        <div>
          <DynamicInfoSection
            data={user?.professionalInfo?.education}
            title="Education"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorsProfile;
