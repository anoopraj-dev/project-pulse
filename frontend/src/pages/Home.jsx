import Footer from "../components/layout/components/Footer";
import Headings from "../components/shared/components/Headings";
import PrimaryButton from "../components/shared/components/PrimaryButton";
import SubHeadings from "../components/shared/components/SubHeadings";
import Subtext from "../components/shared/components/Subtext";
import { aboutUs, whyChooseUs, welcomeText } from '../formConfigs/homePageData';

const Home = () => {
    return (
        <>
            <main>
                <div className="w-full h-[75vh] relative">
                    {/* Image */}
                    <img
                        src="./healthcare1.jpg"
                        alt="healthcare"
                        className="w-full h-[75vh] object-cover "
                    />

                    {/* Gradient overlay for smooth bottom fade */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>

                    {/* Text content on the left */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start px-5 lg:pl-12 text-[#0096C7]">
                        <Headings text={'"Care That Fits Your Lifestyle"'} className='text-white text-4xl md:text-7xl lg:text-9xl py-3 ' />
                        <div className="w-full md:w-1/2 lg:w-1/3">
                            
                            <Subtext text={welcomeText} className='text-sm' />
                            <PrimaryButton text={'Find your doctor now'} className="w-full mt-4" />
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-6 md:px-12 lg:px-48  ">

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
                                <img src="./seamless.webp" alt="booking image" width={350} className="my-2 rounded-md" />
                                <img src="./doctors-group.webp" alt="group of doctors" width={350} className="my-2 rounded-md" />
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
                                <img src="./medicsupport.webp" alt="booking image" width={350} className="my-2 rounded-md" />
                                <img src="./insurance.webp" alt="group of doctors" width={350} className="my-2 rounded-md" />
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
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Home;
