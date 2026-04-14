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
              onChange={(e) => handleInputs(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="bg-white border border-opacity-20 border-[rgba(117,202,255,0.5)] rounded-md w-12 h-12 text-center text-xl focus:border-blue-500 focus:outline-none"
            />
          ))}
        </div>

        <PrimaryButton text="Submit OTP" className="w-full" type="submit" />
      </form>

      <div className="flex justify-center p-8 text-sm text-gray-600">
        Didn’t receive the OTP?{" "}
        {!loading ? (
          <button
            disabled={secondsLeft > 0}
            onClick={handleResendOtp}
            className={`${
              secondsLeft > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500 cursor-pointer"
            }`}
          >
            {secondsLeft === 0 ? "Resend OTP" : time}
          </button>
        ) : (
          <Icon icon="line-md:loading-twotone-loop" className="w-5 h-5" />
        )}
      </div>
    </div>
  );
};

export default OtpInputs;
