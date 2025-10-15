import AuthCard from "../components/AuthCard";
import AuthImage from "../components/AuthImage";



const SignIn = () => {
    return (
        <>
            <div className=" grid grid-cols-1 md:grid-cols-[70%_30%] lg:grid-cols-2" >
                <div className="hidden md:block md:scale-75 lg:scale-100">
                <AuthImage/>
                </div>
                <div className="flex justify-center items-center p-4">
                    <AuthCard />
                </div>
                
            </div>
        </>
    )
}

export default SignIn;