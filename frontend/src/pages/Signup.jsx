import AuthCard from "../components/auth/components/AuthCard";
import AuthImage from "../components/auth/components/AuthImage";
import {motion} from 'framer-motion'
import { slideLeft,slideRight } from "@/utilis/animations";

const Signup = () => {
  return (
    <>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[40%_60%] min-h-screen" >
        <motion.div variants={slideRight} initial="hidden" animate="show" exit='exit' className="flex justify-center items-center px-4 ">
          <AuthCard />
        </motion.div>
        <motion.div variants={slideLeft} initial="hidden" animate="show" exit='exit' className="hidden md:block md:scale-100 ">
          <AuthImage />
        </motion.div>
        

      </div>
    </>
  );
};

export default Signup;
