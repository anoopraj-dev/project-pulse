import { useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import toast from "react-hot-toast";


export default function OtpVerification() {
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if(prev<=1){
          clearInterval(timer);
          return 0;
        }
        return prev-1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    try {

      const loadingToast = toast.loading ('Verifying your OTP...')

      const { data } = await api.post('/api/auth/verify-email', {
        otp: otpCode,
        email: email
      });

      toast.dismiss(loadingToast);

      if (!data.success) {

        toast.error(data.message)
        
        return;
      }

      toast.error(data.message)
      navigate('/signin', { state: { email } });

    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Something went wrong';
      openModal(message);
    }
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const time = `${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;

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
              <a href="#" className="text-blue-500">
                {secondsLeft === 0 ? "Resend" : time}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
