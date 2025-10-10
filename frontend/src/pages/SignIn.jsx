import AuthCard from "../components/AuthCard";
import AuthImage from "../components/AuthImage";
import Footer from "../components/Footer";


const SignIn = () => {
    return (
        <>
            <div className=" grid grid-cols-[60%_40%] "  >
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

export default SignIn;