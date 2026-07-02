
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Footer from "../components/layout/components/Footer";
import { aboutUs, whyChooseUs, welcomeText } from "../constants/homePageData";
import GlobalStyles from "@/components/shared/components/GlobalStyles";
import { useNavigate } from "react-router-dom";
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
import { fetchHomepageStats } from "@/api/user/userApis";

// ---------------- ARROW ----------------
const ArrowRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------- PRIMARY BUTTON ----------------
const PrimaryBtn = ({ children, onClick }) => (
  <motion.button
    onClick={onClick}
    className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white w-full sm:w-auto"
    style={{ background: "#0096C7", boxShadow: "0 6px 24px rgba(0,150,199,.35)" }}
    whileHover={{ backgroundColor: "#007aa3", y: -2, boxShadow: "0 10px 28px rgba(0,150,199,.4)" }}
    whileTap={{ scale: 0.97 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.button>
);

// ---------------- HOME ----------------
const Home = () => {
  const [statsData, setStatsData] = useState([
    { label: "Happy Patients", value: 12500, icon: "mdi:account-heart-outline" },
    { label: "Expert Doctors", value: 1200, icon: "mdi:stethoscope" },
    { label: "Appointments", value: 45000, icon: "mdi:calendar-check" },
  ]);
  const [stats, setStats] = useState([0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  // ---------------- STATS LOAD ----------------
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchHomepageStats();
        if (res.data?.success) {
          const d = res.data.data;
          const formatted = [
            { label: "Happy Patients", value: d.patients, icon: "mdi:account-heart-outline" },
            { label: "Expert Doctors", value: d.doctors, icon: "mdi:stethoscope" },
            { label: "Appointments", value: d.appointments, icon: "mdi:calendar-check" },
          ].slice(0, 3);
          setStatsData(formatted);
          setStats(formatted.map(() => 0));
        }
      } catch (err) { console.error(err); }
    };
    load();
  }, []);

  useEffect(() => {
    if (!isVisible || statsData.length === 0) return;
    let frameId;
    let t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / 2000, 1);
      setStats(statsData.map((s) => Math.floor(s.value * p)));
      if (p < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isVisible, statsData]);

  const fmt = (val = 0, i) => {
    const raw = statsData[i]?.value || 0;
    const v = val >= raw ? raw : val;
    if (raw >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M+";
    if (raw >= 1_000) return Math.floor(v / 1000) + "K+";
    return v + "+";
  };

  // ---------------- JSX ----------------
  return (
    <div className="min-h-screen bg-slate-50 font-[Georgia,serif] overflow-x-hidden">
      <GlobalStyles />

      {/* ==========================================================
          HERO SECTION (Responsive unified layout, no 3D rendering)
      ========================================================== */}
      <div
        className="relative w-full min-h-[75vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/online_consultation_hero.png')",
        }}
      >
        {/* Dark gradient overlay for text readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent pointer-events-none"
        />

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* Ambient glowing blobs */}
        <motion.div
          className="absolute -top-48 -right-32 w-[560px] h-[560px] lg:w-[720px] lg:h-[720px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle,rgba(0,150,199,0.18) 0%,transparent 70%)",
            filter: "blur(72px)",
          }}
          {...floatY(14, 7)}
        />
        <motion.div
          className="absolute -bottom-28 -left-24 w-[420px] h-[420px] lg:w-[520px] lg:h-[520px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle,rgba(0,180,216,0.10) 0%,transparent 70%)",
            filter: "blur(64px)",
          }}
          {...floatYReverse(14, 9)}
        />

        {/* Hero content container */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-16 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Brand badge, Heading, Description, CTAs, Stats */}
            <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start space-y-6 sm:space-y-8 relative z-20">
              
              {/* Brand badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] sm:text-[11px] font-bold tracking-[.14em] uppercase"
                style={{
                  background: "rgba(0,150,199,.12)",
                  borderColor: "rgba(0,150,199,.3)",
                  color: "#48cae4",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#0096C7" }}
                  {...pulseRing}
                />
                Pulse360
              </motion.div>

              {/* Headline */}
              <motion.h1
                className="font-[Georgia] text-3xl sm:text-5xl lg:text-6xl font-medium text-white leading-[1.12]"
                style={{ textShadow: "0 2px 32px rgba(0,0,0,0.55)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Care that fits
                <br className="hidden sm:block" />
                your&nbsp;
                <span className="not-italic text-[#48cae4]">lifestyle</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-xl"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {welcomeText}
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <PrimaryBtn onClick={() => navigate("/signin")}>
                  Find your doctor <ArrowRight />
                </PrimaryBtn>
                <motion.button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border"
                  style={{
                    borderColor: "rgba(255,255,255,.2)",
                    color: "rgba(255,255,255,.68)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.10)",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/how-it-works")}
                >
                  How it works
                </motion.button>
              </motion.div>

              {/* Stats pills under CTAs */}
              {statsData.length > 0 && stats.length === statsData.length && (
                <motion.div
                  className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 pt-4 border-t w-full"
                  style={{ borderColor: "rgba(255,255,255,.1)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.45 }}
                >
                  {statsData.map((stat, i) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border"
                      style={{
                        background: "rgba(0,150,199,0.08)",
                        borderColor: "rgba(0,150,199,0.2)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        flex: "1 1 calc(50% - 12px)",
                        minWidth: "140px",
                        maxWidth: "180px",
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(0,150,199,0.15)" }}
                      >
                        <Icon icon={stat.icon} className="text-base text-[#48cae4]" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-white leading-none">
                          {fmt(stats[i], i)}
                        </div>
                        <div
                          className="text-[8px] uppercase tracking-wider mt-0.5 font-semibold"
                          style={{ color: "rgba(255,255,255,.4)" }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Right Column: Empty spacer to let the background image's subject (doctor/laptop) show through clearly */}
            <div className="lg:col-span-5 h-[200px] lg:h-auto pointer-events-none" />

          </div>
        </div>

        {/* Wave transition into light bg */}
        <svg
          viewBox="0 0 1440 56"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full block"
          style={{ height: "clamp(24px, 4vw, 56px)", marginBottom: "-2px" }}
        >
          <path d="M0,56 C480,0 960,0 1440,56 L1440,56 L0,56 Z" fill="#f8fafc" />
        </svg>
      </div>

      {/* ------------ Healthier Tomorrow ----------------*/}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-10 sm:py-14">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <motion.div
            className="space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <div className="space-y-4 sm:space-y-6">
              <motion.p
                variants={staggerChild}
                className="text-[11px] font-bold tracking-[.14em] uppercase"
                style={{ color: "#0096C7" }}
              >
                Our promise
              </motion.p>
              <motion.h2
                variants={staggerChild}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
              >
                A Healthier Tomorrow<br />
                <em className="not-italic" style={{ color: "#0096C7" }}>Starts Here</em>
              </motion.h2>
              <motion.p
                variants={staggerChild}
                className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                {welcomeText}
              </motion.p>
            </div>
            <motion.div variants={staggerChild}>
              <PrimaryBtn onClick={() => navigate("/signup")}>
                Find your doctor <ArrowRight />
              </PrimaryBtn>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative order-1 lg:order-2"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            custom={0.15}
          >
            <div
              className="absolute -top-4 -right-4 w-full h-full rounded-3xl border-2 border-dashed opacity-30 pointer-events-none hidden sm:block"
              style={{ borderColor: "#0096C7" }}
            />
            <img
              src="/banner.webp"
              alt="Healthcare Banner"
              className="w-full rounded-3xl object-cover shadow-2xl relative z-10"
              style={{ boxShadow: "0 24px 60px rgba(0,150,199,.2)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ------------- Stats ----------------- */}
      <section className="py-10 sm:py-14" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.div
            className="text-center mb-12 sm:mb-20 space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.p
              variants={staggerChild}
              className="text-[11px] font-bold tracking-[.14em] uppercase"
              style={{ color: "#0096C7" }}
            >
              By the numbers
            </motion.p>
            <motion.h2 variants={staggerChild} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
              Trusted By <em className="not-italic" style={{ color: "#0096C7" }}>Millions</em>
            </motion.h2>
            <motion.p variants={staggerChild} className="text-slate-500 text-sm sm:text-base">
              Real results from real users
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {statsData.length > 0 &&
              stats.length === statsData.length &&
              statsData.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={staggerChild}
                  className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-default"
                >
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{ background: "#ddf1f8" }}
                  >
                    <Icon icon={stat.icon} className="text-3xl text-[#0096C7]" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{fmt(stats[i], i)}</div>
                  <p className="text-sm text-slate-500 mt-2 font-medium tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* ------------- Why Pulse360 ---------------- */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-10 sm:py-14">
        <motion.div
          className="text-center mb-12 sm:mb-16 space-y-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p
            variants={staggerChild}
            className="text-[11px] font-bold tracking-[.14em] uppercase"
            style={{ color: "#0096C7" }}
          >
            Our advantages
          </motion.p>
          <motion.h2 variants={staggerChild} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
            Why <em className="not-italic" style={{ color: "#0096C7" }}>Pulse360?</em>
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {[
            { icon: "mdi:rocket-launch-outline", title: "Seamless Booking", text: whyChooseUs[0] },
            { icon: "mdi:doctor", title: "Trusted Doctors", text: whyChooseUs[1] },
            { icon: "mdi:shield-check-outline", title: "24/7 Support", text: whyChooseUs[2] },
            { icon: "mdi:lock-outline", title: "Secure & Private", text: whyChooseUs[3] },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              {...hoverLift}
              className="flex items-start gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm cursor-default"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#ddf1f8" }}
              >
                <Icon icon={item.icon} className="text-2xl text-[#0096C7]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/*-------------- About ------------------*/}
      <section className="py-10 sm:py-14" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-14 sm:gap-20 items-center">
            <motion.div
              className="relative order-2 lg:order-1"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              custom={0}
            >
              <div
                className="absolute -bottom-4 -left-4 w-full h-full rounded-3xl border-2 border-dashed opacity-30 pointer-events-none hidden sm:block"
                style={{ borderColor: "#0096C7" }}
              />
              <img
                src="/connection.webp"
                alt="Healthcare connection"
                className="w-full rounded-3xl object-cover shadow-2xl relative z-10"
                style={{ boxShadow: "0 24px 60px rgba(0,150,199,.18)" }}
              />
            </motion.div>

            <motion.div
              className="space-y-6 sm:space-y-8 order-1 lg:order-2 text-center lg:text-left"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <div className="space-y-4">
                <motion.p
                  variants={staggerChild}
                  className="text-[11px] font-bold tracking-[.14em] uppercase"
                  style={{ color: "#0096C7" }}
                >
                  Who we are
                </motion.p>
                <motion.h2
                  variants={staggerChild}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
                >
                  About Our <em className="not-italic" style={{ color: "#0096C7" }}>Mission</em>
                </motion.h2>
              </div>
              <motion.div variants={staggerChild} className="space-y-4 text-left">
                {[aboutUs[0], aboutUs[1]].map((text, i) => (
                  <motion.div
                    key={i}
                    {...hoverLiftSubtle}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
                        style={{ background: "#ddf1f8" }}
                      >
                        <Icon icon="mdi:check-bold" className="text-[10px] text-[#0096C7]" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{text}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={staggerChild}>
                <PrimaryBtn onClick={() => navigate("/about-us")}>Learn more <ArrowRight /></PrimaryBtn>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- Footer CTA ----------------------*/}
      <section className="px-6 lg:px-16 py-10 sm:py-12">
        <motion.div
          className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[3rem] px-8 sm:px-16 py-10 sm:py-14 flex flex-col lg:flex-row items-center justify-between gap-10"
          style={{
            background: "linear-gradient(135deg,#003554 0%,#006494 50%,#0096C7 100%)",
            boxShadow: "0 20px 60px rgba(0,150,199,.28)",
          }}
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          custom={0}
        >
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to take charge
              <br className="hidden sm:block" />
              of your{" "}
              <em className="not-italic" style={{ color: "#90e0ef" }}>health?</em>
            </h2>
            <p className="text-base sm:text-lg font-medium" style={{ color: "rgba(255,255,255,.7)" }}>
              Join millions who trust Pulse360 every day.
            </p>
          </div>
          <motion.button
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-base"
            style={{ background: "#fff", color: "#0096C7", boxShadow: "0 4px 20px rgba(0,0,0,.12)" }}
            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,.18)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/signup")}
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