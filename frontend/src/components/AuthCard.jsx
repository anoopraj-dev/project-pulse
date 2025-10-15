
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../api/api";
import { useModal } from "../contexts/ModalContext";
import Headings from "./Headings";
import PrimaryButton from "./PrimaryButton";
import SliderToggle from "./SliderToggle";
import { useUser } from "../contexts/UserContext";
import { useClerk, useUser as clerkUser } from "@clerk/clerk-react";
import { Icon } from "@iconify/react";
import { PropagateLoader } from 'react-spinners'
import ShimmerCard from "./ShimmerCard";
import { EmailModal } from "./ModalInputs";
import toast from "react-hot-toast";


const AuthCard = ({ role: initialRole }) => {
  const [isDoctor, setIsDoctor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal} = useModal();
  const { dispatch} = useUser();
  const { user, isSignedIn, isLoaded } = clerkUser();
  const { openSignIn } = useClerk()
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const isSignup = location.pathname === "/signup";
  const isAdmin = initialRole === "admin" || location.pathname.includes("/admin");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //show password
  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  }

  //submit function
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const role = isAdmin ? "admin" : isDoctor ? "doctor" : "patient";

      // signup flow (Patient/Doctor) 
      if (isSignup && !isAdmin) {
        if (data.password !== data.confirmPassword) {
          openModal('Passwords do not match!')
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
        if (response.data.success) {
          toast.success(response.data.message);
          const payload = {
            email: data.email,
            type:'emailVerification',
            role:data.role
          }
          sessionStorage.setItem('otpSession',JSON.stringify(payload));
          navigate('/verify-email')

        } else {
          toast.error(response.data.message)
        }

        return;
      }

      // signin flow (Admin / Doctor / Patient) 
      if (isAdmin) {

        const response = await api.post("/api/admin/login", {
          email: data.email,
          password: data.password,
        });



        if (response.data.success) {
          const { admin } = response.data;
          dispatch({ type: "SET_USER", payload: { ...admin } });
          navigate("/admin/profile");
        } else {
          openModal(response.data.message)
        }
        return;
      }


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
        toast.error(response.data.message)
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      openModal(message)
    } finally {
      setLoading(false)
    }
  };



  

//forgot password - password reset
  const handleForgotPassword = () => {
  openModal("Forgot your password?", EmailModal, {
    endPoint: "/api/auth/reset-password",
    type:'resetPassword',
    onSubmit: (res) => navigate("/verify-email"),
  });
};




  //for users authenticated with clerk
  useEffect(() => {

    if (!isLoaded) return;

    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (role === 'doctor') {
        navigate('/doctor/profile');
      } else {
        navigate('/patient/profile')
      }
    }



  }, [isSignedIn, user, navigate]);


  if (!isLoaded) return (
    <div>
      <ShimmerCard />
    </div>

  );
  if (isSignedIn && user) return null;


  return (
    <form className="my-16 mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[550px] p-4 sm:p-6 md:p-8 bg-white rounded-xl" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center w-[550px] h-auto bg-white rounded-xl p-6 px-16 ">
        <div className="flex flex-col items-center ">
          {!isAdmin && <SliderToggle isChecked={isDoctor} onToggle={setIsDoctor} />}
          <Headings
            text={`${isAdmin ? "Admin" : isDoctor ? "DOCTOR" : "PATIENT"} ${isSignup ? "SIGNUP" : "LOGIN"
              }`}
            className="flex justify-center"
          />


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
        <div className="w-full my-2 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-4 border border-gray-300 rounded-md"
          />

          <span
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={handleShowPassword}
          >
            <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="20" height="20" />
          </span>

          {errors.password && (
            <span className="text-red-600 text-sm">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password (signup only, not admin) */}
        {!isAdmin && isSignup && (
          <div className="w-full my-2 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm your password",
              })}
              className="w-full p-4 border border-gray-300 rounded-md"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={handleShowPassword}
            >  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="20" height="20" /></span>
            {errors.confirmPassword && (
              <span className="text-red-600 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        )}


        {!loading ? (
          <PrimaryButton
            ref={buttonRef}
            text={isSignup ? "SIGN UP" : "SIGN IN"}
            className="w-full mt-2 text-white bg-[#0096C7]"
            type="submit"
          />
        ) : (
          <div className="my-4">
            <PropagateLoader color="#0096C7" />

          </div>
        )}



        {/* Google signin only for patient/doctor */}
        {!isSignup && !isAdmin && (
          <PrimaryButton onClick={openSignIn}
            text="SIGNIN WITH GOOGLE"
            className="w-full  bg-white mt-2 border border-[#0096C7] !text-[#0096C7]"
          />
        )}

        {/* Admin only has signin */}
        <div className="my-5 text-center">
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
                  <span className="text-blue-600 underline cursor-pointer" onClick={() => handleForgotPassword()}>
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
