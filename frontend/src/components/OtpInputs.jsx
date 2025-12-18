import { useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useModal } from "../contexts/ModalContext";
import { SetPasswordModal } from "./ModalInputs";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

const OtpInputs = () => {
  const [loading,setLoading]= useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const { openModal } = useModal();
  const sessionData = JSON.parse(sessionStorage.getItem("otpSession" || "{}"));
  const type = sessionData.type || "";
  const email = sessionData.email || "";

  const initialSeconds = sessionData.expiryTime
    ? Math.max(Math.floor((sessionData.expiryTime - Date.now()) / 1000), 0)
    : 0;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);


  const handleInputs = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // --------------- RESEND OTP --------------------
const OTP_EXPIRY_SECONDS = 60;

const handleResendOtp = async () => {
  try {
    setLoading(true);
    const payload = { email, type };
    const response = await api.post("/api/auth/resend-otp", payload);

    if (response.data.success) {
      toast.success("OTP has been resent!");

      const newExpiryTime = Date.now() + OTP_EXPIRY_SECONDS * 1000;

      sessionStorage.setItem(
        "otpSession",
        JSON.stringify({
          ...sessionData,
          expiryTime: newExpiryTime,
        })
      );

      setSecondsLeft(OTP_EXPIRY_SECONDS); 
    } else {
      toast.error(response.data.message || "Failed to resend OTP");
      setSecondsLeft(0);
    }
  } catch (err) {
    toast.error("Error resending OTP. Please try again.");
    setSecondsLeft(0);
  }finally{
    setLoading(false)
  }
};


 useEffect(() => {
  if (secondsLeft <= 0) return;

  const timer = setInterval(() => {
    setSecondsLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [secondsLeft]);


  //--------- SUBMIT OTP -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    const payload = { otp: otpCode, type, email };

    try {
      const { data } = await api.post("/api/auth/verify-email", payload);

      if (!data.success) {
        console.log("error sending payload");
        toast.error(data.message);
        return;
      }

      if (type === "emailVerification") {
        toast.success(data.message);
        navigate("/signin");
      } else if (type === "resetPassword") {
        toast.success(data.message);
        openModal("Forgot your password?", SetPasswordModal, {
          endPoint: "/api/auth/set-password",
          type: "resetPassword",
          onSubmit: (res) => navigate("/signin"),
        });
      }
      setOtp(new Array(6).fill(""));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      setOtp(new Array(6).fill(""));
      toast.error(message);
    }
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const time = `${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="flex flex-col">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="mb-6">Enter the OTP sent to your email.</p>
        <div className="flex gap-2 justify-center mb-4">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={value}
              placeholder=""
              onChange={(e) => handleInputs(e, index)}
              className="bg-white border border-opacity-20 border-[rgba(117,202,255,0.5)] rounded-md w-12 h-12 text-center text-xl focus:border-blue-500 focus:outline-none"
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <PrimaryButton text="Submit OTP" className="w-full" type="submit" />
        </div>
      </form>

      <div className="flex w-full items-center justify-center p-8">
        <div className="w-full">
          <div className="flex justify-evenly">
            <p className="mt-4 text-sm text-gray-600 text-center">
              Didn’t receive the OTP?{" "}
              {
                !loading ? (
                  <button className="text-blue-500 cursor-pointer " onClick={handleResendOtp}>
                {secondsLeft === 0 ? "Resend" : time}
              </button>
                ) : (
                  <Icon icon={'line-md:loading-twotone-loop'} className=" inline w-5 h-5"/>
                )
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpInputs;
