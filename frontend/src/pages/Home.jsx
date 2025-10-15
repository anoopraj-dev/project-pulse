import Footer from "../components/Footer";
import Headings from "../components/Headings";
import PrimaryButton from "../components/PrimaryButton";
import SubHeadings from "../components/SubHeadings";
import Subtext from "../components/Subtext";
import { aboutUs, whyChooseUs, welcomeText } from '../formConfigs/homePageData';

const Home = () => {
    return (
        <>
            <main className="px-4 sm:px-6 md:px-12 lg:px-48 py-8 bg-[linear-gradient(150deg,#FFFFFF_0%,#E0F7FA_26%,#B2EBF2_72%,#FFFFFF_100%)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="py-8 lg:py-48 px-5 lg:px-12">
                        <Headings text={'"A Healthier Tomorrow Starts Here"'} />
                        <Subtext text={welcomeText} />
                        <PrimaryButton text={'Find your doctor now'} className="w-full" />
                    </div>
                    <div>
                        <img src="/banner.webp" alt="banner image" />
                    </div>
                </div>

                <Headings text="Why Choose Us ?" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="grid grid-cols-1 justify-self-center">
                            <img src="./seamless.webp" alt="booking image" width={350} className="my-2" />
                            <img src="./doctors-group.webp" alt="group of doctors" width={350} className="my-2" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="flex flex-col justify-center items-center">
                            <SubHeadings text="Seamless Experience" />
                            <Subtext text={whyChooseUs[0]} />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <SubHeadings text="Trusted Doctors" />
                            <Subtext text={whyChooseUs[1]} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="flex flex-col justify-center items-center">
                            <SubHeadings text="24X7 Availability" />
                            <Subtext text={whyChooseUs[2]} />
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <SubHeadings text="Security & Privacy" />
                            <Subtext text={whyChooseUs[3]} />
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 justify-self-center">
                            <img src="./medicsupport.webp" alt="booking image" width={350} className="my-2" />
                            <img src="./insurance.webp" alt="group of doctors" width={350} className="my-2" />
                        </div>
                    </div>
                </div>

                <div>
                    <Headings text="Who We Are?" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <img src="./connection.webp" alt="" />
                    </div>
                    <div className="px-3 lg:px-12">
                        <div className="my-2">
                            <Subtext text={aboutUs[0]} />
                        </div>
                        <div>
                            <Subtext text={aboutUs[1]} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Home;
