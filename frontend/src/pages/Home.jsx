import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Footer from "../components/layout/components/Footer";
import { aboutUs, whyChooseUs, welcomeText } from "../constants/homePageData";
import GlobalStyles from "@/components/shared/components/GlobalStyles";
import DoctorFanCards from "@/components/ui/cards/DoctorFanCards";
import {
  scaleIn,
  staggerContainer,
  staggerChild,
  floatY,
  floatYReverse,
  pulseRing,
  hoverLift,
  hoverLiftSubtle,
  viewportOnce,
} from "../utilis/animations";

//----------------- Primary Button -------------------
const ArrowRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PrimaryBtn = ({ children, onClick }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white"
    style={{ background: "#0096C7", boxShadow: "0 6px 24px rgba(0,150,199,.35)" }}
    whileHover={{ backgroundColor: "#007aa3", y: -2, boxShadow: "0 10px 28px rgba(0,150,199,.4)" }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.button>
);

//---------------- Stats Data ---------------------------
const statsData = [
  { label: "Happy Patients",  value: "50000",   display: "50K+",  icon: "mdi:account-heart-outline" },
  { label: "Expert Doctors",  value: "2500",    display: "2.5K+", icon: "mdi:stethoscope" },
  { label: "Appointments",    value: "1200000", display: "1.2M+", icon: "mdi:calendar-check" },
  { label: "Clinics",         value: "150",     display: "150+",  icon: "mdi:hospital-building" },
];

//----------------- Home Page -------------------------
const Home = () => {
  const [stats, setStats]         = useState(statsData.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  //-------------- Stats Animation -------------------
  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / 2000, 1);
      setStats(statsData.map((s) => Math.floor(parseInt(s.value) * progress)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible]);

  const formatStat = (val, idx) => {
    const raw = parseInt(statsData[idx].value);
    if (val >= raw)       return statsData[idx].display;
    if (raw >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M+`;
    if (raw >= 1_000)     return `${(val / 1_000).toFixed(0)}K+`;
    return `${val}+`;
  };

  return (
    <div className="h-root min-h-screen bg-slate-50">
      <GlobalStyles />

      {/* ------------ Hero Section ------------ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

        <div className="absolute inset-0"
          style={{ background: "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)" }} />

        <div className="absolute inset-0 opacity-[.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }} />

        {/* Blobs */}
        <motion.div
          className="absolute -top-48 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,150,199,.3) 0%,transparent 70%)", filter: "blur(72px)" }}
          {...floatY(14, 7)}
        />
        <motion.div
          className="absolute -bottom-28 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,180,216,.18) 0%,transparent 70%)", filter: "blur(64px)" }}
          {...floatYReverse(14, 9)}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-20 flex items-center justify-between gap-12">

          <motion.div
            className="flex-1 min-w-0 space-y-7"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={staggerChild}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[11px] font-bold tracking-[.12em] uppercase"
              style={{ background: "rgba(0,150,199,.12)", borderColor: "rgba(0,150,199,.3)", color: "#48cae4" }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#0096C7" }}
                {...pulseRing}
              />
              Modern Healthcare Platform
            </motion.div>

            <motion.h1 variants={staggerChild}
              className="h-serif text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.07]">
              Care That Fits<br />
              Your&nbsp;<em className="not-italic" style={{ color: "#48cae4" }}>Lifestyle</em>
            </motion.h1>

            <motion.p variants={staggerChild}
              className="text-[1.05rem] leading-relaxed max-w-[480px]"
              style={{ color: "rgba(255,255,255,.55)" }}>
              {welcomeText}
            </motion.p>

            <motion.div variants={staggerChild} className="flex flex-wrap gap-3">
              <PrimaryBtn>Find your doctor <ArrowRight /></PrimaryBtn>
              <motion.button
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
                style={{ border: "1.5px solid rgba(255,255,255,.18)", color: "rgba(255,255,255,.65)" }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.07)", color: "#fff" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                How it works
              </motion.button>
            </motion.div>

            <motion.div variants={staggerChild}
              className="flex gap-10 pt-6 border-t"
              style={{ borderColor: "rgba(255,255,255,.1)" }}>
              {[["50K+","Happy Patients"],["2.5K+","Expert Doctors"],["150+","Partner Clinics"]].map(([v,l]) => (
                <div key={l}>
                  <div className="h-serif text-2xl font-bold text-white">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest mt-0.5"
                    style={{ color: "rgba(255,255,255,.38)" }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/*---------- Right card ----------------- */}
          <motion.div
  className="hidden lg:flex shrink-0 items-center justify-center"
  variants={scaleIn}
  initial="hidden"
  animate="visible"
  custom={0.5}
>
  <DoctorFanCards />
</motion.div>
        </div>

        <div className="h-wave absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60 }}>
            <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>


      {/* -------------- Healthier tommorow --------------- */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          <motion.div className="space-y-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <motion.p variants={staggerChild}
              className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>
              Our promise
            </motion.p>
            <motion.h2 variants={staggerChild}
              className="h-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              A Healthier Tomorrow<br />
              <em className="not-italic" style={{ color: "#0096C7" }}>Starts Here</em>
            </motion.h2>
            <motion.p variants={staggerChild} className="text-slate-500 text-base leading-relaxed">
              {welcomeText}
            </motion.p>
            <motion.div variants={staggerChild}>
              <PrimaryBtn>Find your doctor <ArrowRight /></PrimaryBtn>
            </motion.div>
          </motion.div>

          <motion.div className="relative"
            variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewportOnce} custom={0.15}>
            <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl border-2 border-dashed opacity-30 pointer-events-none"
              style={{ borderColor: "#0096C7" }} />
            <img src="/banner.webp" alt="Banner"
              className="relative w-full rounded-3xl object-cover shadow-2xl"
              style={{ boxShadow: "0 24px 60px rgba(0,150,199,.2)" }} />
          </motion.div>
        </div>
      </section>

      {/* ------------- Stats display -------------------- */}
      <section className="py-20" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          <motion.div className="text-center mb-14 space-y-2"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <motion.p variants={staggerChild}
              className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>
              By the numbers
            </motion.p>
            <motion.h2 variants={staggerChild}
              className="h-serif text-3xl md:text-4xl font-bold text-slate-900">
              Trusted By <em className="not-italic" style={{ color: "#0096C7" }}>Millions</em>
            </motion.h2>
            <motion.p variants={staggerChild} className="text-slate-500 text-sm">Real results from real users</motion.p>
          </motion.div>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-5"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            {statsData.map((stat, i) => (
              <motion.div key={stat.label} variants={staggerChild} {...hoverLift}
                className="bg-white rounded-2xl p-6 text-center border border-slate-100 cursor-default"
                style={{ boxShadow: "0 2px 12px rgba(0,150,199,.07)" }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ background: "#ddf1f8" }}>
                  <Icon icon={stat.icon} style={{ color: "#0096C7", fontSize: "1.5rem" }} />
                </div>
                <div className="h-serif text-2xl font-bold text-slate-900">{formatStat(stats[i], i)}</div>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ----------------- Why Pulse360 */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">

        <motion.div className="text-center mb-12 space-y-2"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.p variants={staggerChild}
            className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>
            Our advantages
          </motion.p>
          <motion.h2 variants={staggerChild}
            className="h-serif text-3xl md:text-4xl font-bold text-slate-900">
            Why <em className="not-italic" style={{ color: "#0096C7" }}>Pulse360?</em>
          </motion.h2>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 gap-5"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {[
            { icon: "mdi:rocket-launch-outline", title: "Seamless Booking",  text: whyChooseUs[0] },
            { icon: "mdi:doctor",                title: "Trusted Doctors",   text: whyChooseUs[1] },
            { icon: "mdi:shield-check-outline",  title: "24/7 Support",      text: whyChooseUs[2] },
            { icon: "mdi:lock-outline",          title: "Secure & Private",  text: whyChooseUs[3] },
          ].map((item, i) => (
            <motion.div key={i} variants={staggerChild} {...hoverLift}
              className="h-why-card flex items-start gap-5 bg-white p-6 rounded-2xl border border-slate-100 cursor-default"
              style={{ boxShadow: "0 2px 12px rgba(0,150,199,.07)" }}>
              <div className="h-why-icon w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                style={{ background: "#ddf1f8" }}>
                <Icon icon={item.icon} style={{ color: "#0096C7", fontSize: "1.5rem" }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --------------- About ---------------------- */}
      <section className="py-20" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-14 items-center">

            <motion.div className="relative"
              variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewportOnce} custom={0}>
              <div className="absolute -bottom-4 -left-4 w-full h-full rounded-3xl border-2 border-dashed opacity-30 pointer-events-none"
                style={{ borderColor: "#0096C7" }} />
              <img src="/connection.webp" alt="Healthcare connection"
                className="relative w-full rounded-3xl object-cover shadow-2xl"
                style={{ boxShadow: "0 24px 60px rgba(0,150,199,.18)" }} />
            </motion.div>

            <motion.div className="space-y-6"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <motion.p variants={staggerChild}
                className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>
                Who we are
              </motion.p>
              <motion.h2 variants={staggerChild}
                className="h-serif text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                About Our <em className="not-italic" style={{ color: "#0096C7" }}>Mission</em>
              </motion.h2>
              <motion.div variants={staggerChild} className="space-y-4">
                {[aboutUs[0], aboutUs[1]].map((text, i) => (
                  <motion.div key={i} {...hoverLiftSubtle}
                    className="bg-white p-5 rounded-2xl border border-slate-100"
                    style={{ boxShadow: "0 2px 12px rgba(0,150,199,.07)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "#ddf1f8" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#0096C7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={staggerChild}>
                <PrimaryBtn>Learn more <ArrowRight /></PrimaryBtn>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* -------------------- Footer CTA-------------------- */}
      <section className="px-6 lg:px-10 py-14">
        <motion.div
          className="max-w-6xl mx-auto rounded-3xl px-10 py-12 flex flex-wrap items-center justify-between gap-8"
          style={{
            background: "linear-gradient(135deg,#003554 0%,#006494 50%,#0096C7 100%)",
            boxShadow: "0 20px 60px rgba(0,150,199,.28)",
          }}
          variants={scaleIn} initial="hidden" whileInView="visible" viewport={viewportOnce} custom={0}
        >
          <div>
            <h2 className="h-serif text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to take charge<br />
              of your <em className="not-italic" style={{ color: "#90e0ef" }}>health?</em>
            </h2>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,.5)" }}>
              Join millions who trust Pulse360 every day.
            </p>
          </div>
          <motion.button
            className="flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm"
            style={{ background: "#fff", color: "#0096C7", boxShadow: "0 4px 20px rgba(0,0,0,.12)" }}
            whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(0,0,0,.18)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Get Started Now <ArrowRight />
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;