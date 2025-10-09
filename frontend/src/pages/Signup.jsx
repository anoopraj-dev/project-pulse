import AuthCard from "../components/AuthCard";
import Footer from "../components/Footer";
import AuthImage from "../components/AuthImage";
const Signup = () => {
    return (
      <>
            <div className=" grid grid-cols-[70%_30%]"  >
                <div className="px-2">
                <AuthImage/>
                </div>
                <AuthCard />
            </div>

        </> 
    )
}

export default Signup;