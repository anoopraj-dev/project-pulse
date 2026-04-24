import { slideLeft, slideRight } from "@/utilis/animations";
import AuthCard from "../components/auth/components/AuthCard";
import SigninImage from "../components/auth/components/SigninImage";
import {motion} from 'framer-motion'

const SignIn = () => {
  return (
    <>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[60%_40%] min-h-screen">
        <motion.div variants={slideRight} initial="hidden" animate="show" exit='exit' className="hidden md:block md:scale-100 ">
          <SigninImage />
        </motion.div>
        <motion.div  variants={slideLeft} initial="hidden" animate="show" exit='exit' className="flex justify-center items-center px-4 ">
          <AuthCard />
        </motion.div>
      </div>
    </>
  );
};

export default SignIn;
