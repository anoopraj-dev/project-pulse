import AuthCard from "../components/AuthCard";
import Footer from "../components/Footer";
import AuthImage from "../components/AuthImage";

const Signup = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] min-h-screen">
        {/* Left side (image) */}
        <div className="hidden lg:block">
          <AuthImage />
        </div>

        {/* Right side (auth form) */}
        <div className="flex justify-center items-center p-4">
          <AuthCard />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Signup;
