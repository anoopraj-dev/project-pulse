import AuthCard from "../components/AuthCard";
import AuthImage from "../components/AuthImage";
import Footer from "../components/Footer";


const SignIn = () => {
    return (
        <>
            <div className=" grid grid-cols-[70%_30%] "  >
                <div className="px-2 ">
                <AuthImage/>
                </div>
                <AuthCard />
            </div>
        </>
    )
}

export default SignIn;