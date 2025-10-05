import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../api/api";
import { useModal } from "../contexts/ModalContext";
import Headings from "./Headings";
import PrimaryButton from "./PrimaryButton";
import SliderToggle from "./SliderToggle";
import { useUser } from "../contexts/UserContext";

const AuthCard = () => {
  const [isDoctor, setIsDoctor] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const isSignup = location.pathname === "/signup";
  const { dispatch } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const role = isDoctor ? "doctor" : "patient";

      if (isSignup) {
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
      } else {
        const signinData = {
          email: data.email,
          password: data.password,
          role,
        };

        const response = await api.post("/api/auth/signin", signinData);
        if (response.data.success) {
          const { user, token } = response.data;
          dispatch({ type: "SET_USER", payload: { ...user, token } });
        }

        const { user } = response.data;

        if (user.firstLogin) {
          if (user.role === "doctor") navigate("/doctor/register");
          else if (user.role === "patient") navigate("/patient/register");
        } else {
          navigate(`/${role}/profile`);
        }
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
            text={`${isDoctor ? "Doctor" : "Patient"} ${
              isSignup ? "Signup" : "Login"
            }`}
            className="flex justify-center"
          />
          <SliderToggle isChecked={isDoctor} onToggle={setIsDoctor} />
        </div>

        {/* Signup field: Name */}
        {isSignup && (
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

        {/* Email */}
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

        {/* Password */}
        <div className="w-full my-2">
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        {isSignup && (
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

        {/* Remember me for login */}
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

        {!isSignup && (
          <PrimaryButton
            text="SIGNIN WITH GOOGLE"
            className="w-full bg-[#BD2F2F] mt-2"
          />
        )}

        <div className="my-5 text-center">
          {isSignup ? (
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
                <span className="text-blue-600 underline">
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
