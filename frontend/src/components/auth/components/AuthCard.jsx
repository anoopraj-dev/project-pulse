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
import { motion } from "framer-motion";
import { fadeIn } from "@/utilis/animations";

// ---------------- AUTH SERVICES ----------------
import {
  signup,
  signin,
  updateClerkUser,
} from "../../../api/auth/authService";

const AuthCard = ({ role: initialRole }) => {
  const [isDoctor, setIsDoctor] = useState(() => {
    const storedRole = sessionStorage.getItem("userRole");
    return storedRole === "doctor";
  });

  const [oauthProgress, setOauthProgress] = useState(
    () => sessionStorage.getItem("oauthProgress") === "true",
  );
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { dispatch, email, refreshUser } = useUser();
  const { user, isSignedIn, isLoaded } = clerkUser();
  const { openSignIn, signOut } = useClerk();
  const buttonRef = useRef(null);
  const isSignup = location.pathname === "/signup";
  const isAdmin =
    initialRole === "admin" || location.pathname.includes("/admin");
  const { getToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const authFormAction = useAsyncAction();

  // ---------------- UTILITY HANDLERS ----------------
  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleRole = () => setIsDoctor((prev) => !prev);

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

  const isValidPassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // ---------------- FORM SUBMISSION HANDLER ----------------
  const onSubmit = async (data) => {
    try {
      await authFormAction.executeAsyncFn(async () => {
        const role = isAdmin ? "admin" : isDoctor ? "doctor" : "patient";

        // ---------------- SIGNUP (DOCTOR / PATIENT) ----------------
        if (isSignup && !isAdmin) {
          if (!isValidPassword(data.password)) {
            return toast.error(
              "Password should of minimum length 8 & alpha numeric combination",
            );
          }
          if (data.password !== data.confirmPassword) {
            return toast.error("Passwords do not match");
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

            const expiryTime = Date.now() + 600 * 1000; // 10 minutes
            const payload = {
              email: data.email,
              type: "emailVerification",
              role,
              expiryTime,
            };
            sessionStorage.setItem("otpSession", JSON.stringify(payload));
            navigate("/verify-email");
          } else {
            toast.error(response.message);
          }
          return;
        }

        // ---------------- ADMIN LOGIN ----------------
        if (isAdmin) {
          const response = await signin(data.email, data.password,'admin');

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

        // ---------------- DOCTOR / PATIENT LOGIN ----------------
        const response = await signin(data.email, data.password, role);
        if (!response.user.isVerified) {
          return toast.error("Verify your email");
        }
        if (response.success) {
          const fetchedUser = response.user;
          dispatch({ type: "SET_USER", payload: fetchedUser });
          toast.success(response.message);

          const firstLoginFlag = fetchedUser?.firstLogin;

          const target = firstLoginFlag
            ? role === "doctor"
              ? "/doctor/personal-info"
              : "/patient/personal-info"
            : `/${role}/dashboard`;

          // refreshUser().catch(() => {});
          navigate(target, { replace: true });
        } else {
          toast.error(response.message);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!isLoaded || !user || !isSignedIn) return;

    // Clerk users are already authenticated and verified, no additional email verification needed
    setOauthProgress(true);
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
        setOauthProgress(false);
      }
    };

    syncClerkUser();
    return () => controller.abort();
  }, [isLoaded, user, isSignedIn]);

  return (
    <motion.div
      custom={0.5}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col">

        <form
          className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            className={`flex flex-col w-full max-w-md bg-white ${
              isAdmin ? "p-10" : "px-6 py-10 sm:p-12"
            } space-y-8`}
          >
            <div className="flex flex-col items-center space-y-6">
              {!isAdmin && !email && (
                <div className="scale-110">
                  <SliderToggle isChecked={isDoctor} onToggle={toggleRole} />
                </div>
              )}
              <div className="w-full text-center">
                <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                  {isAdmin ? "Admin" : isDoctor ? "Doctor" : "Patient"}
                  <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                    {isSignup ? "Create Account" : "Access Portal"}
                  </span>
                </h1>
              </div>
            </div>
            <div className="space-y-4">
              {!isAdmin && isSignup && (
                <div className="w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative mt-1.5">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon icon="ph:user-bold" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      {...register("name", { required: "Name is required" })}
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  {errors.name && (
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1 block">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              )}

              <div className="w-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative mt-1.5">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="ph:envelope-simple-bold" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1 block">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="w-full">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative mt-1.5">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="ph:lock-bold" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password", { required: "Password is required" })}
                    className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                    onClick={handleShowPassword}
                  >
                    <Icon
                      icon={showPassword ? "ph:eye-slash-bold" : "ph:eye-bold"}
                      className="text-lg"
                    />
                  </button>
                </div>
                {errors.password && (
                  <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1 block">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {!isAdmin && isSignup && (
                <div className="w-full">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative mt-1.5">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Icon icon="ph:lock-key-bold" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      {...register("confirmPassword", {
                        required: "Confirm your password",
                      })}
                      className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-md text-sm font-medium text-gray-900 placeholder:font-normal placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1 block">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-2">
              {!authFormAction.loading ? (
                <PrimaryButton
                  ref={buttonRef}
                  text={isSignup ? "Create Account" : "Sign In"}
                  className="w-full py-4 text-white bg-[#0096C7] hover:bg-[#0280ab] rounded-md shadow-lg shadow-blue-100 active:scale-[0.98] transition-all text-xs font-bold uppercase tracking-widest"
                  type="submit"
                />
              ) : (
                <div className="flex justify-center py-2">
                  <ClipLoader color="#0096C7" size={28} />
                </div>
              )}

              {!isSignup && !isAdmin && (
                <button
                  type="button"
                  onClick={handleGoogleSignin}
                  disabled={oauthProgress}
                  className="w-full py-4 px-6 bg-white border border-gray-100 rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {oauthProgress ? (
                    <ClipLoader color="#2563eb" size={16} />
                  ) : (
                    <Icon icon="logos:google-icon" className="text-lg" />
                  )}
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    {oauthProgress ? "Signing in..." : "Continue with Google"}
                  </span>
                </button>
              )}
            </div>

            <div className="text-center pt-2">
              {isAdmin ? (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Secure Admin Authentication Required
                </p>
              ) : isSignup ? (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-500 transition-all"
                  >
                    Sign In
                  </Link>
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Forgot your credentials?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-500 transition-all"
                      onClick={handleForgotPassword}
                    >
                      Reset Password
                    </button>
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    New to Pulse360?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-500 transition-all"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AuthCard;
