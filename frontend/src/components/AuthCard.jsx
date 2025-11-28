import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../api/api";
import { useModal } from "../contexts/ModalContext";
import PrimaryButton from "./PrimaryButton";
import SliderToggle from "./SliderToggle";
import { useUser } from "../contexts/UserContext";
import { useClerk, useUser as clerkUser , useAuth, SignUp} from "@clerk/clerk-react";
import { Icon } from "@iconify/react";
import { PropagateLoader } from "react-spinners";
import ShimmerCard from "./ShimmerCard";
import { EmailModal } from "./ModalInputs";
import toast from "react-hot-toast";

const AuthCard = ({ role: initialRole }) => {
  const [isDoctor, setIsDoctor] = useState(()=> {
    const storedRole = sessionStorage.getItem('userRole');
    return storedRole === 'doctor'
  });
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { dispatch } = useUser();
  const { user, isSignedIn, isLoaded } = clerkUser();
  const { openSignIn } = useClerk();
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const isSignup = location.pathname === "/signup";
  const isAdmin =
    initialRole === "admin" || location.pathname.includes("/admin");

  const { getToken } = useAuth()


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //------- SHOW PASSWORD ----------
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  //--------SUBMIT FORM ----------
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const role = isAdmin ? "admin" : isDoctor ? "doctor" : "patient";

      // ---------- SIGNUP FLOW (ADMIN/PATIENT)------
      if (isSignup && !isAdmin) {
        if (data.password !== data.confirmPassword) {
          openModal("Passwords do not match!");
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

        // ---------- SESSION STORAGE USED IDENTIFYING TYPE OF VERIFICATION-----------
        const response = await api.post("/api/auth/signup", signupData);
        if (response.data.success) {
          toast.success(response.data.message);
          const payload = {
            email: data.email,
            type: "emailVerification",
            role: data.role,
          };
          sessionStorage.setItem("otpSession", JSON.stringify(payload));
          navigate("/verify-email");
        } else {
          toast.error(response.data.message);
        }

        return;
      }
      // -----------SIGNIN FLOWS----------
      // ---------- (ADMIM)---------
      if (isAdmin) {
        const response = await api.post("/api/admin/login", {
          email: data.email,
          password: data.password,
        });

        if (response.data.success) {
          const { admin } = response.data;
          dispatch({ type: "SET_USER", payload: { ...admin } });
          navigate("/admin/profile", { replace: true });
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        return;
      }

      // ---------- (DOCTOR / PATIENT)-----------
      const response = await api.post("/api/auth/signin", {
        email: data.email,
        password: data.password,
        role,
      });

      if (response.data.success) {
        localStorage.setItem('loginMethod', 'manual')
        const { user, token } = response.data;
        dispatch({ type: "SET_USER", payload: { ...user, token } });
        toast.success(response.data.message);

        if (user.firstLogin) {
          if (role === "doctor")
            navigate("/doctor/personal-info", { replace: true });
          else if (role === "patient")
            navigate("/patient/personal-info", { replace: true });
        } else {
          navigate(`/${role}/profile`, { replace: true });
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = () =>{
    setIsDoctor(prev=>!prev)
    console.log(isDoctor)
  }

  //------------FORGOT PASSWROD (PASSWORD RESETTING)------------
  const handleForgotPassword = () => {
    openModal("Forgot your password?", EmailModal, {
      endPoint: "/api/auth/reset-password",
      type: "resetPassword",
      onSubmit: (res) => navigate("/verify-email"),
    });
  };

  //--------------- USERS AUTHENTICATED WITH CLERK--------------

  const handleGoogleSignin = async() => {
    const role = isDoctor ? 'doctor' : 'patient';
     sessionStorage.setItem('userRole',role)
     openSignIn();
  }
 

    useEffect(()=>{
      if (!isLoaded || !user || !isSignedIn) return ;    

      const currentRole = sessionStorage.getItem('userRole')
      if(!currentRole) return ;

      const userData  = {
        id: user.id,
        role: currentRole,

      }

      const updateUserRole = async () => {
        try{
          const token = await getToken();
          console.log(token)

          const response = await api.post('/api/auth/update-user-role', userData,
            {                                          
        headers: {
          'Authorization': `Bearer ${token}`,      
          'Content-Type': 'application/json'
        }
      }
        )
        }catch(err){
          console.log('error updating role',err)
        }
      }

      updateUserRole();

    },[isLoaded,isSignedIn,user])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center ">
        {!isAdmin && (
          <SliderToggle isChecked={isDoctor} onToggle={toggleRole} />
        )}
        <h1 className="text-2xl font-bold my-2 ">{`${
          isAdmin ? "ADMIN" : isDoctor ? "DOCTOR" : "PATIENT"
        } ${isSignup ? "SIGNUP" : "LOGIN"}`}</h1>
      </div>
      <form
        className="my-2   bg-white rounded-xl "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div
          className={`flex flex-col items-center w-sm bg-white rounded-xl ${
            isAdmin ? "p-10" : "p-2"
          }`}
        >
          {/* ------NAME (ONLY FOR SIGNUP - NON-ADMIN)-------- */}
          {!isAdmin && isSignup && (
            <div className="w-full my-2">
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="w-full p-4 border border-gray-300 rounded-md"
              />
              {errors.name && (
                <span className="text-red-600 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
          )}

          {/* --------EMAIL--------------- */}
          <div className="w-full my-2">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-4 border border-gray-300 rounded-md"
            />
            {errors.email && (
              <span className="text-red-600 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* ----------PASSWORD -------------- */}
          <div className="w-full my-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-4 border border-gray-300 rounded-md"
            />

            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={handleShowPassword}
            >
              <Icon
                icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                width="20"
                height="20"
              />
            </span>

            {errors.password && (
              <span className="text-red-600 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* -------------CONFIRM PASSWORD (SIGNUP ONLY - NON ADMIN)--------- */}
          {!isAdmin && isSignup && (
            <div className="w-full my-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                })}
                className="w-full p-4 border border-gray-300 rounded-md"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={handleShowPassword}
              >
                {" "}
                <Icon
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  width="20"
                  height="20"
                />
              </span>
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

          {/* ----------GOOGLE SIGNIN (PATIENT/DOCTOR)----------- */}
          {!isSignup && !isAdmin && (
            <PrimaryButton
              onClick={handleGoogleSignin}
              text="SIGNIN WITH GOOGLE"
              className="w-full  bg-white mt-2 border border-[#0096C7] !text-[#0096C7]"
            />

            //  <SignUp unsafeMetadata={isDoctor ? 'doctor' :'patient'} path="/sign-up" routing="path" />
          )}

          {/* ------------ADMIN (SIGNIN)------------ */}
          <div className="my-5 text-center">
            {isAdmin ? (
              <p className="text-gray-600">Login with your admin credentials</p>
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
                  <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => handleForgotPassword()}
                  >
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
    </div>
  );
};

export default AuthCard;
