import { useEffect, useState } from "react";
import { api } from "../api/api";
import { useModal } from "../contexts/ModalContext";
import Headings from "./Headings";
import { useForm } from "react-hook-form";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const { email, id} = useUser();
  console.log(email,id)
  const navigate = useNavigate();
  const { openModal } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!email || !id ) return;
     console.log('hello world')
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("patientId", id);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("work", data.work);
      formData.append("dob", data.dob);
      formData.append("gender", data.gender);

      const response = await api.post("/api/patient/registration", formData);
      console.log(response.data)
      if (!response.data.success) {
        openModal(response.data.message);
      } else {
        openModal(response.data.message);
        navigate("/patient/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl p-10 rounded-xl">
        <Headings text="Tell us about yourself" />

        {/* Stepper */}
        <div className="flex items-center justify-center my-6 space-x-6">
          <div className="rounded-full flex items-center justify-center bg-[#0096C7] text-white w-12 h-12">
            <span className="font-bold">1</span>
          </div>
          <hr className="w-2/3 border border-gray-300" />
          <div className="rounded-full flex items-center justify-center border border-[#0096C7] w-12 h-12">
            <span className="font-bold">2</span>
          </div>
        </div>

        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-lg font-semibold mb-6 text-gray-700">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Left Section */}
            <div className="flex flex-col justify-between space-y-6 h-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="male"
                      {...register("gender", { required: "Gender is required" })}
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="female"
                      {...register("gender", { required: "Gender is required" })}
                    />
                    <span>Female</span>
                  </label>
                </div>
                {errors.gender && (
                  <span className="text-red-600 text-sm">{errors.gender.message}</span>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone"
                  {...register("phone", { required: "Phone field is required" })}
                  className="w-full p-4 border border-gray-300 rounded-md"
                />
                {errors.phone && (
                  <span className="text-red-600 text-sm">{errors.phone.message}</span>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Work"
                  {...register("work", { required: "Work field is required" })}
                  className="w-full p-4 border border-gray-300 rounded-md"
                />
                {errors.work && (
                  <span className="text-red-600 text-sm">{errors.work.message}</span>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col justify-between space-y-6 h-full">
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  {...register("address", { required: "Address is required" })}
                  className="w-full p-4 border border-gray-300 rounded-md"
                />
                {errors.address && (
                  <span className="text-red-600 text-sm">{errors.address.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dob", { required: "Date of Birth is required" })}
                  className="w-full p-4 border border-gray-300 rounded-md"
                />
                {errors.dob && (
                  <span className="text-red-600 text-sm">{errors.dob.message}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("profilePic")}
                  className="w-full p-4 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="px-8 py-3 bg-[#0096C7] text-white font-semibold rounded-lg hover:bg-[#0077a3] transition duration-200"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
