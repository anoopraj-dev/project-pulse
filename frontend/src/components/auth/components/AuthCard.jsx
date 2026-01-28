import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useModal } from "../../../contexts/ModalContext";
import PrimaryButton from "../../shared/components/PrimaryButton";
import SliderToggle from "./SliderToggle";
import { useUser } from "../../../contexts/UserContext";
import { useClerk, useUser as clerkUser, useAuth } from "@clerk/clerk-react";
import { Icon } from "@iconify/react";
import { ClipLoader } from "react-spinners";
import { EmailModal } from "../../ui/modals/ModalInputs";
import { useAsyncAction } from "../../../hooks/useAsyncAction";
import toast from "react-hot-toast";

//------------- AUTH SERVICES ---------------
import { signup, signin, adminLogin, updateClerkUser } from "../../../api/auth/authService";

const AuthCard = ({ role: initialRole }) => {
  const [isDoctor, setIsDoctor] = useState(() => {
    const storedRole = sessionStorage.getItem("userRole");
    return storedRole === "doctor";
  });

  const [oauthProgress, setOauthProgress] = useState(() => sessionStorage.getItem("oauthProgress") === "true");
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { dispatch, email, refreshUser } = useUser();
  const { user, isSignedIn, isLoaded } = clerkUser();
  const { openSignIn, signOut } = useClerk();
  const buttonRef = useRef(null);
  const isSignup = location.pathname === "/signup";
  const isAdmin = initialRole === "admin" || location.pathname.includes("/admin");
  const { getToken } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const authFormAction = useAsyncAction();

  // -------------- UTILITY HANDLERS ----------------
  const handleShowPassword = () => setShowPassword(prev => !prev);
  const toggleRole = () => setIsDoctor(prev => !prev);

  const handleForgotPassword = () => {
    openModal("Forgot your password?", EmailModal, {
      endPoint: "/api/auth/reset-password",
      type: "resetPassword",
      onSubmit: () => navigate("/verify-email"),
    });
  };

  const handleGoogleSignin = async () => {
    const role = isDoctor ? "doctor" : "patient";
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("oauthProgress", "true");
   
    openSignIn();
  };

  // ----------- FORM SUBMISSION HANDLER ----------------
  const onSubmit = async (data) => {
    try {
      await authFormAction.executeAsyncFn(async () => {
        const role = isAdmin ? "admin" : isDoctor ? "doctor" : "patient";

        // ---------- SIGNUP (DOCTOR / PATIENT) ----------
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

          const response = await signup(signupData);

          if (response.success) {
            toast.success(response.message);
            const payload = {
              email: data.email,
              type: "emailVerification",
              role,
            };
            sessionStorage.setItem("otpSession", JSON.stringify(payload));
            navigate("/verify-email");
          } else {
        
            toast.error(response.message);
          }
          return;
        }

        // ---------- ADMIN LOGIN ----------
        if (isAdmin) {
          const response = await adminLogin(data.email, data.password);

          if (response.success) {
            dispatch({ type: "SET_USER", payload: response.admin });
            toast.success(response.message);
            refreshUser().catch(() => {});
            navigate("/admin/dashboard", { replace: true });
          } else {
            toast.error(response.message);
          }
          return;
        }

        // ---------- DOCTOR / PATIENT LOGIN ----------
        const response = await signin(data.email, data.password, role);

        if (response.success) {
          const fetchedUser = response.user;
          dispatch({ type: "SET_USER", payload: fetchedUser });
          toast.success(response.message);

          const firstLoginFlag = fetchedUser?.firstLogin;
          const target = firstLoginFlag
            ? role === "doctor"
              ? "/doctor/personal-info"
              : "/patient/personal-info"
            : `/${role}/profile`;

          refreshUser().catch(() => {});
          navigate(target, { replace: true });
        } else {
          toast.error(response.message);
        }
      });
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!isLoaded || !user || !isSignedIn) return;
     setOauthProgress(true)
    const controller = new AbortController();
    const signal = controller.signal;

    const syncClerkUser = async () => {
      try {
        const token = await getToken();
        const role = sessionStorage.getItem("userRole");
        if (!role) return;

        const userData = {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName || user.name,
          role,
          profilePicture: user.imageUrl,
        };

        const response = await updateClerkUser(userData, token, signal);

        if (response.success) {
          dispatch({ type: "SET_USER", payload: response.user });
          toast.success(response.message);
          sessionStorage.removeItem("userRole");
          sessionStorage.removeItem("oauthProgress");

          const firstLoginFlag = response.user?.firstLogin;
          const target = firstLoginFlag
            ? response.user.role === "doctor"
              ? "/doctor/personal-info"
              : "/patient/personal-info"
            : `/${response.user.role}/profile`;

          refreshUser().catch(() => {});
          navigate(target, { replace: true });
        } else {
          toast.error(response.message);
        }
      } catch (err) {
        if (signal.aborted) return;
        toast.error(err?.message || "Authentication failed");
        await signOut({ redirectUrl: "/signin" });
        dispatch({ type: "CLEAR_USER" });
      } finally {
        sessionStorage.removeItem("oauthProgress");
        setOauthProgress(false)
      }
    };

    syncClerkUser();
    return () => controller.abort();
  }, [isLoaded, user, isSignedIn]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        {!isAdmin && !email && <SliderToggle isChecked={isDoctor} onToggle={toggleRole} />}
        <h1 className="text-2xl font-bold my-2">{`${isAdmin ? "ADMIN" : isDoctor ? "DOCTOR" : "PATIENT"} ${isSignup ? "SIGNUP" : "LOGIN"}`}</h1>
      </div>

      <form className="my-2 bg-white rounded-xl" onSubmit={handleSubmit(onSubmit)}>
        <div className={`flex flex-col items-center w-sm bg-white rounded-xl ${isAdmin ? "p-10" : "p-2"}`}>
          {!isAdmin && isSignup && (
            <div className="w-full my-2">
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="w-full p-4 border border-gray-300 rounded-md"
              />
              {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
            </div>
          )}

          <div className="w-full my-2">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="w-full p-4 border border-gray-300 rounded-md"
            />
            {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
          </div>

          <div className="w-full my-2 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-4 border border-gray-300 rounded-md"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" onClick={handleShowPassword}>
              <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="20" height="20" />
            </span>
            {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
          </div>

          {!isAdmin && isSignup && (
            <div className="w-full my-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword", { required: "Confirm your password" })}
                className="w-full p-4 border border-gray-300 rounded-md"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" onClick={handleShowPassword}>
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="20" height="20" />
              </span>
              {errors.confirmPassword && <span className="text-red-600 text-sm">{errors.confirmPassword.message}</span>}
            </div>
          )}

          {!authFormAction.loading ? (
            <PrimaryButton ref={buttonRef} text={isSignup ? "SIGN UP" : "SIGN IN"} className="w-full mt-2 text-white bg-[#0096C7]" type="submit" />
          ) : (
            <div className="my-4">
              <ClipLoader color="#0096C7" />
            </div>
          )}

          {!isSignup && !isAdmin && (
            <PrimaryButton
              type="button"
              onClick={handleGoogleSignin}
              disabled={oauthProgress}
              text={oauthProgress ? "Signing in.." : "SIGN IN WITH GOOGLE"}
              className="w-full bg-white mt-2 border border-[#0096C7] !text-[#0096C7]"
            />
          )}

          <div className="my-5 text-center">
            {isAdmin ? (
              <p className="text-gray-600">Login with your admin credentials</p>
            ) : isSignup ? (
              <p>
                Already a member? <Link to="/signin" className="text-blue-600 underline">SignIn Now</Link>
              </p>
            ) : (
              <>
                <p>
                  Forgot Password?{" "}
                  <span className="text-blue-600 underline cursor-pointer" onClick={handleForgotPassword}>
                    Reset Password
                  </span>
                </p>
                <p>
                  Not a member yet? <Link to="/signup" className="text-blue-600 underline">Signup Now</Link>
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