import Footer from "../components/Footer";
import OtpInputs from "../components/OtpInputs";

const VerifyEmail = () => {
  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-48 place-items-center bg-[linear-gradient(150deg,#FFFFFF_0%,#E0F7FA_26%,#B2EBF2_72%,#FFFFFF_100%)] h-screen">

      <div>
        <img
        src="/banner.webp"
        alt="OTP Illustration"
        className="w-full h-auto hidden lg:block"
      />
      </div>

      <div className="flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <OtpInputs />
      </div>

    </div>
  
    </>
  );
};

export default VerifyEmail;
