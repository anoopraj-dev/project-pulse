import Footer from "../components/layout/components/Footer";
import OtpInputs from "../components/auth/components/OtpInputs";
import OtpImage from "@/components/auth/components/OtpImage";
import {motion} from 'framer-motion'

import { slideRight,slideLeft } from "@/utilis/animations";

const VerifyEmail = () => {
  return (

      <>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[40%_60%] min-h-screen" >
        <motion.div variants={slideRight} initial="hidden" animate="show" exit='exit' className="flex justify-center items-center px-4 ">
         <OtpInputs/>
        </motion.div>
        <motion.div variants={slideLeft} initial="hidden" animate="show" exit='exit' className="hidden md:block md:scale-100 ">
          <OtpImage/>
        </motion.div>
        

      </div>
  
  
    </>
  );
};

export default VerifyEmail;
