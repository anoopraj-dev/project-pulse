import AuthCard from "../components/AuthCard";
import Footer from "../components/Footer";
import AuthImage from "../components/AuthImage";
const Signup = () => {
    return (
      <>
            <div className=" grid grid-cols-[60%_40%]"  >
                <div className="">
                <AuthImage/>
                </div>
                <div className="flex justify-center items-center">
                    <AuthCard />
                </div>
                
            </div>

     </> 
    )
}

export default Signup;