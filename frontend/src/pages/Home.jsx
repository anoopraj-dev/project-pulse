import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Footer from "../components/layout/components/Footer";
import Headings from "../components/shared/components/Headings";
import PrimaryButton from "../components/shared/components/PrimaryButton";
import SubHeadings from "../components/shared/components/SubHeadings";
import Subtext from "../components/shared/components/Subtext";
import { aboutUs, whyChooseUs, welcomeText } from '../constants/homePageData';

const statsData = [
  { label: 'Happy Patients', value: '50K+', icon: 'mdi:account-heart-outline' },
  { label: 'Expert Doctors', value: '2.5K+', icon: 'mdi:stethoscope' },
  { label: 'Appointments', value: '1.2M+', icon: 'mdi:calendar-check' },
  { label: 'Clinics', value: '150+', icon: 'mdi:hospital-building' }
];

const Home = () => {
  const [stats, setStats] = useState(statsData.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const animateStats = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 2000, 1);
      setStats(statsData.map((stat, i) => {
        const target = parseInt(stat.value);
        return Math.floor(target * progress);
      }));
      if (progress < 1) requestAnimationFrame(animateStats);
    };
    requestAnimationFrame(animateStats);
  }, [isVisible]);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen mt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <section className="relative h-[80vh] md:h-[90vh] w-full px-4 md:px-8">
          <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/healthcare1.jpg"
              alt="Healthcare hero"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-2xl space-y-6 text-white px-6 lg:px-12">
                <Headings
                  text={'Care That Fits Your Lifestyle'}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
                />
                <Subtext
                  text={welcomeText}
                  className="text-lg md:text-xl text-white/60 "
                />
                <PrimaryButton
                  text="Find your doctor now"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* “A Healthier Tomorrow Starts Here” Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 py-20">
          <div className="flex flex-col justify-center space-y-6 px-4 md:px-0">
            <Headings text={'"A Healthier Tomorrow Starts Here"'} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900" />
            <Subtext text={welcomeText} className="text-gray-600 text-lg md:text-xl leading-relaxed" />
            <PrimaryButton text="Find your doctor now" className="w-full md:w-auto" />
          </div>
          <div className="flex justify-center items-center">
            <img
              src="/banner.webp"
              alt="Banner"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-3xl shadow-2xl object-cover"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Headings text="Trusted By Millions" className="text-4xl lg:text-5xl font-black text-gray-900 mb-4" />
            <Subtext text="Real results from real users" className="text-lg text-gray-600" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {statsData.map((stat, index) => (
              <div key={stat.label} className="p-6 bg-white rounded-3xl shadow-xl flex flex-col items-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                  <Icon icon={stat.icon} className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-black mb-2">
                  {stats[index] >= parseInt(stat.value) ? stat.value : `${stats[index]}+`}
                </div>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Headings text="Why Pulse360?" className="text-4xl lg:text-6xl font-black text-gray-900 mb-4" />
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            {[
              { icon: 'mdi:rocket-launch-outline', title: 'Seamless Booking', text: whyChooseUs[0], color: 'from-emerald-500 to-teal-600' },
              { icon: 'mdi:doctor', title: 'Trusted Doctors', text: whyChooseUs[1], color: 'from-blue-500 to-indigo-600' },
              { icon: 'mdi:shield-check-outline', title: '24/7 Support', text: whyChooseUs[2], color: 'from-orange-500 to-amber-600' },
              { icon: 'mdi:lock-outline', title: 'Secure & Private', text: whyChooseUs[3], color: 'from-purple-500 to-pink-600' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 p-6 bg-white rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon icon={item.icon} className="w-8 h-8 text-white" />
                </div>
                <div>
                  <SubHeadings text={item.title} className="text-2xl font-bold mb-2" />
                  <Subtext text={item.text} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <img 
                src="./connection.webp" 
                alt="Healthcare connection"
                className="w-full h-[450px] lg:h-[550px] object-cover rounded-3xl shadow-2xl ring-8 ring-white/50 hover:scale-105 transition-all duration-700"
              />
            </div>
            <div className="space-y-6">
              <Headings text="About Our Mission" className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight" />
              <div className="space-y-4">
                <div className="p-6 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50">
                  <Subtext text={aboutUs[0]} className="text-lg leading-relaxed" />
                </div>
                <div className="p-6 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50">
                  <Subtext text={aboutUs[1]} className="text-lg leading-relaxed" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;
