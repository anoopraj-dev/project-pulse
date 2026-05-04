import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../shared/components/PrimaryButton";
import { useModal } from "../../../contexts/ModalContext";
import { SetPasswordModal } from "../../ui/modals/ModalInputs";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

import { resendOtp, verifyOtp } from "../../../api/auth/otpService";

const OTP_EXPIRY_SECONDS = 60;

const OtpInputs = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const { openModal } = useModal();

  const sessionData = JSON.parse(sessionStorage.getItem("otpSession") || "{}");
  const type = sessionData.type || "";
  const email = sessionData.email || "";

  const initialSeconds = sessionData.expiryTime
    ? Math.max(Math.floor((sessionData.expiryTime - Date.now()) / 1000), 0)
    : 0;

  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  // ---------------- FOCUS FIRST INPUT ON LOAD ----------------
  useEffect(() => {
    document.getElementById("otp-0")?.focus();
  }, []);

  // ---------------- OTP INPUT HANDLER ----------------
  const handleInputs = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // ---------------- RESEND OTP ----------------
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const res = await resendOtp({ email, type });

      if (!res.success) {
        toast.error(res.message || "Failed to resend OTP");
        setSecondsLeft(0);
        return;
      }

      toast.success("OTP has been resent!");

      const newExpiryTime = Date.now() + OTP_EXPIRY_SECONDS * 1000;

      sessionStorage.setItem(
        "otpSession",
        JSON.stringify({
          ...sessionData,
          expiryTime: newExpiryTime,
        }),
      );

      setSecondsLeft(OTP_EXPIRY_SECONDS);
    } catch (err) {
      toast.error(err?.message || err);
      setSecondsLeft(0);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TIMER ----------------
  // useEffect(() => {
  //   if (secondsLeft <= 0) return;

  //   const timer = setInterval(() => {
  //     setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [secondsLeft]);

  useEffect(() => {
    const interval = setInterval(() => {
      const session = JSON.parse(sessionStorage.getItem("otpSession") || "{}");

      if (!session.expiryTime) {
        setSecondsLeft(0);
        return;
      }

      const remaining = Math.max(
        Math.floor((session.expiryTime - Date.now()) / 1000),
        0,
      );

      setSecondsLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- SUBMIT OTP ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    try {
      const res = await verifyOtp({
        otp: otpCode,
        email,
        type,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);

      if (type === "emailVerification") {
        navigate("/signin");
      }

      if (type === "resetPassword") {
        openModal("Forgot your password?", SetPasswordModal, {
          endPoint: "/api/auth/set-password",
          type: "resetPassword",
          onSubmit: () => navigate("/signin"),
        });
      }

      setOtp(new Array(6).fill(""));
    } catch (err) {
      toast.error(err?.message || err);
      setOtp(new Array(6).fill(""));
    }
  };

  // ---------------- PASTE HANDLER ----------------
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();

    if (!/^\d{6}$/.test(pasteData)) return;

    const otpArray = pasteData.split("");
    setOtp(otpArray);

    document.getElementById(`otp-5`)?.focus();
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const time = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="flex flex-col space-y-8 w-full max-w-md">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Verify Identity</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <form 
        className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8 sm:p-10 space-y-8" 
        onSubmit={handleSubmit}
      >
        <div className="flex gap-2 sm:gap-3 justify-center">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleInputs(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-10 h-12 sm:w-12 sm:h-14 bg-gray-50 border border-gray-100 rounded-md text-center text-xl font-medium text-gray-900 placeholder:font-normal placeholder:text-xs placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 focus:bg-white transition-all"
            />
          ))}
        </div>

        <div className="space-y-4">
          <PrimaryButton 
            text="Verify OTP" 
            className="w-full py-4 text-white bg-[#0096C7] hover:bg-[#0280ab] rounded-md shadow-lg shadow-blue-100 active:scale-[0.98] transition-all text-xs font-bold uppercase tracking-widest" 
            type="submit" 
          />
          
          <div className="text-center">
            {!loading ? (
              <button
                disabled={secondsLeft > 0}
                onClick={handleResendOtp}
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  secondsLeft > 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-[#0096C7] hover:text-[#0280ab] underline underline-offset-4"
                }`}
              >
                {secondsLeft === 0 ? "Resend Verification Code" : `Resend in ${time}`}
              </button>
            ) : (
              <div className="flex justify-center">
                <Icon icon="ph:spinner-gap-bold" className="w-5 h-5 text-[#0096C7] animate-spin" />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default OtpInputs;
