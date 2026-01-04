import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

import BasicInfoCard from "../../../ui/cards/BasicInfoCard";
import DynamicInfoSection from "../../../ui/cards/DynamicInfoSection";
import { useModal } from "../../../../contexts/ModalContext";
import { useAsyncAction } from "../../../../hooks/useAsyncAction";
import {
  CertificateUploadModal,
  SendCommentModal,
  UpdateProfilePictureModal,
} from "../../../ui/modals/ModalInputs";

import {
  verifyDoctorDocuments,
  approveDoctorProfile,
  rejectDoctorProfile,
} from "../../../../api/doctor/doctorApis";


const ProfileView = ({user}) => {
  const [viewMore, setViewmore] = useState(false);
  const { id } = useParams();
  const isProfileReview = !!id;
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();
  const viewDocAction = useAsyncAction();
  const approveAction = useAsyncAction();


  //------------- VERIFY DOCUMENTS -------------
  const handleVerifyDocuments = async (id) => {
    try {
      await viewDocAction.executeAsyncFn(async () => {
        const res = await verifyDoctorDocuments(user._id);
        if (res.data.success) {
          navigate(`/admin/doctor/${id}/documents`)
        }
        
      });
    } catch(error) {
      console.log(error)
      toast("Failed to load documents");
    }
  };

  //------------- APPROVE DOCTOR --------------
  const handleApproveDoctor = async() => {
    try {
      await approveAction.executeAsyncFn( async () => {
        const res = await approveDoctorProfile(user._id);
        if(res.data.success){
          toast.success(res.data.message);
          navigate(`/admin/doctor/${id}`)
        }
      })
    } catch (error) {
      console.log(error);
      toast.error('Request Approval failed')
    }
  }

  //------------- REJECT DOCTOR -------------
  const handleReject = async () => {
    try {
      openModal("Reject this request?", SendCommentModal ,{id : user._id}
      );
    } catch {
      toast.error("Something went wrong");
    }
  };

  //---------------- BLOCK DOCTOR -------------
  const handleBlockDoctor = () =>{

  }

  //--------------- EDIT PROFILE ---------------

  const handleProfileEdit = () => {
    navigate("/doctor/edit-profile");
  };

  //--------------- UPLOAD PROFILE PICTURE ---------------

  const handleUpdateProfilePicture = () => {
    openModal("Update your profile picture", UpdateProfilePictureModal);
  };

  const handleUploadCertificates = () => {
    openModal("Upload a certificate", CertificateUploadModal);
  };


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
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                onClick={handleProfileEdit}
              >
                <Icon icon="mdi:pencil" className="w-5 h-5" />
                Edit Profile
              </button>
              <button
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl transition"
                onClick={handleUpdateProfilePicture}
              >
                <Icon icon="mdi:camera" className="w-5 h-5" />
                Update Photo
              </button>
              <button
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl transition"
                onClick={handleUploadCertificates}
              >
                <Icon icon="mdi:document" className="w-5 h-5" />
                Upload certifiactes
              </button>
            </>
          )}

          {isProfileReview && (
            <>
              <button
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
                onClick={()=>handleVerifyDocuments(user._id)}
                disabled={viewDocAction.loading}
              >
                <Icon icon="mdi:file-document" className="w-5 h-5" />
                Documents
              </button>
              {
                user.status === 'pending' && user.isBlocked=== false && (
                  <>
                    <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                onClick={()=>handleApproveDoctor(user._id)}
                disabled={approveAction.loading}
              >
                <Icon icon="mdi:check-bold" className="w-5 h-5" />
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
                )
              }
              {
                user?.status === 'approved' && user?.isBlocked===false && (
                  <button
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                onClick={handleReject}
              >
                <Icon icon="mdi:block" className="w-5 h-5" />
                Block
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
