import AuthCard from "../components/auth/components/AuthCard";
import AuthImage from "../components/auth/components/AuthImage";

const Signup = () => {
  return (
    <>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[60%_40%] min-h-screen" >
        <div className="hidden md:block md:scale-100 ">
          <AuthImage />
        </div>
        <div className="flex justify-center items-center px-4 ">
          <AuthCard />
        </div>

      </div>
    </>
  );
};

export default Signup;
