import AuthCard from "../components/auth/components/AuthCard";
import {motion} from 'framer-motion'
import { slideLeft,slideRight } from "@/utilis/animations";
import SignupImage from "@/components/auth/components/SignupImage";

const Signup = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[40%_60%] min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)]" >
        <motion.div variants={slideRight} initial="hidden" animate="show" exit='exit' className="flex justify-center items-center w-full px-5 py-8 sm:py-0 ">
          <AuthCard />
        </motion.div>
        <motion.div variants={slideLeft} initial="hidden" animate="show" exit='exit' className="hidden md:block md:scale-100 ">
          <SignupImage/>
        </motion.div>
        

      </div>
    </>
  );
};

export default Signup;
