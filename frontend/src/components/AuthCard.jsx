
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../api/api";
import { useModal } from "../contexts/ModalContext";
import Headings from "./Headings";
import PrimaryButton from "./PrimaryButton";
import SliderToggle from "./SliderToggle";
import { useUser } from "../contexts/UserContext";

const AuthCard = ({ role: initialRole }) => {
  const [isDoctor, setIsDoctor] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { dispatch } = useUser();

  const isSignup = location.pathname === "/signup";
  const isAdmin = initialRole === "admin" || location.pathname.includes("/admin");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

 //submit function
  const onSubmit = async (data) => {
  try {
    const role = isAdmin ? "admin" : isDoctor ? "doctor" : "patient";

    // --- SIGNUP FLOW (Only for Patient/Doctor) ---
    if (isSignup && !isAdmin) {
      if (data.password !== data.confirmPassword) {
        openModal("Passwords do not match");
        return;
      }

      const signupData = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role,
        firstLogin: true,
      };

      const response = await api.post("/api/auth/signup", signupData);
      if (!response.data.success) {
        openModal(response.data.message);
      } else {
        openModal(response.data.message);
        reset();
        navigate("/verify-email", { state: { email: data.email } });
      }
      return;
    }

    // --- SIGNIN FLOW (Admin / Doctor / Patient) ---
    if (isAdmin) {
      // ✅ ADMIN LOGIN
      const response = await api.post("/api/admin/login", {
        email: data.email,
        password: data.password,
      });

      if (response.data.success) {
        const { admin } = response.data;
        dispatch({ type: "SET_USER", payload: { ...admin } });
        navigate("/admin/profile");
      } else {
        openModal(response.data.message);
      }
      return; // stop execution here for admin
    }

    // ✅ PATIENT / DOCTOR LOGIN
    const response = await api.post("/api/auth/signin", {
      email: data.email,
      password: data.password,
      role,
    });

    if (response.data.success) {
      const { user, token } = response.data;
      dispatch({ type: "SET_USER", payload: { ...user, token } });

      if (user.firstLogin) {
        if (role === "doctor") navigate("/doctor/personal-info");
        else if (role === "patient") navigate("/patient/personal-info");
      } else {
        navigate(`/${role}/profile`);
      }
    } else {
      openModal(response.data.message);
    }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
    openModal(message);
  }
};


  return (
    <form className="my-32" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center w-[550px] h-auto bg-white rounded-xl shadow-2xl p-6 px-16 border border-[rgba(117,202,255,0.5)]">
        <div className="flex items-center ml-16">
          <Headings
            text={`${isAdmin ? "Admin" : isDoctor ? "Doctor" : "Patient"} ${
              isSignup ? "Signup" : "Login"
            }`}
            className="flex justify-center"
          />
          {/* Hide toggle for admin */}
          {!isAdmin && <SliderToggle isChecked={isDoctor} onToggle={setIsDoctor} />}
        </div>

        {/* Name (only for signup, non-admin) */}
        {!isAdmin && isSignup && (
          <div className="w-full my-2">
            <input
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
              className="w-full p-4 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <span className="text-red-600 text-sm">{errors.name.message}</span>
            )}
          </div>
        )}

        {/* Email */}
        <div className="w-full my-2">
          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="w-full my-2">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password (signup only, not admin) */}
        {!isAdmin && isSignup && (
          <div className="w-full my-2">
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm your password",
              })}
              className="w-full p-4 border border-gray-300 rounded-md"
            />
            {errors.confirmPassword && (
              <span className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        )}

        {/* Remember Me (signin only) */}
        {!isSignup && (
          <div className="flex items-center mt-5">
            <input type="checkbox" className="mr-2" />
            <p>Remember me</p>
          </div>
        )}

        <PrimaryButton
          text={isSignup ? "SIGN UP" : "SIGN IN"}
          className="w-full mt-2"
          type="submit"
        />

        {/* Google signin only for patient/doctor */}
        {!isSignup && !isAdmin && (
          <PrimaryButton
            text="SIGNIN WITH GOOGLE"
            className="w-full bg-[#BD2F2F] mt-2"
          />
        )}

        <div className="my-5 text-center">
          {/* Admin only has signin */}
          {isAdmin ? (
            <p className="text-gray-600">
              Login with your admin credentials
            </p>
          ) : isSignup ? (
            <p>
              Already a member?{" "}
              <Link to="/signin" className="text-blue-600 underline">
                SignIn Now
              </Link>
            </p>
          ) : (
            <>
              <p>
                Forgot Password?{" "}
                <span className="text-blue-600 underline cursor-pointer">
                  Reset Password
                </span>
              </p>
              <p>
                Not a member yet?{" "}
                <Link to="/signup" className="text-blue-600 underline">
                  Signup Now
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default AuthCard;
