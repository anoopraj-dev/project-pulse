
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getApprovedDoctors } from "@/api/user/userApis";
import {
  fadeUp,
  scaleIn,
  floatY,
  floatYReverse,
  pulseRing,
  hoverLift,
  tapScale,
  staggerContainer,
  staggerChild,
  viewportOnce,
} from "@/utilis/animations";
import GlobalStyles from "@/components/shared/components/GlobalStyles";
import { Icon } from "@iconify/react";
import Footer from "@/components/layout/components/Footer";

//--------------- Icon helpers -------------
const ArrowRight = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B">
    <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.1 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z" />
  </svg>
);


const DoctorLanding = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getApprovedDoctors();
        setDoctors(res.data?.users || []);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="h-root min-h-screen bg-slate-50 ">
      <GlobalStyles/>
      {/* -------------- Hero section ---------------- */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

        {/* dark backdrop */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)" }} />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }} />

        {/* glow blobs */}
        <motion.div
          {...floatY(12, 7)}
          className="absolute -top-48 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,150,199,.3) 0%,transparent 70%)", filter: "blur(72px)" }}
        />
        <motion.div
          {...floatYReverse(12, 9)}
          className="absolute -bottom-28 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,180,216,.18) 0%,transparent 70%)", filter: "blur(64px)" }}
        />

        {/* inner */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-20 flex items-center justify-between gap-12">

          {/* ── Left copy ── */}
          <div className="flex-1 min-w-0 space-y-7">

            <motion.div
              variants={fadeUp} custom={0.10} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[11px] tracking-[.12em] uppercase"
              style={{ background: "rgba(0,150,199,.12)", borderColor: "rgba(0,150,199,.3)", color: "#48cae4" }}
            >
              <motion.span
                {...pulseRing}
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#0096C7" }}
              />
              Trusted by 50,000+ patients
            </motion.div>

            <motion.h1
              variants={fadeUp} custom={0.25} initial="hidden" animate="visible"
              className="font-[Georgia,serif] text-5xl md:text-6xl lg:text-[4.25rem] font-medium text-white leading-[1.09] "
            >
              Healthcare<br />
              at your&nbsp;
              <em className="not-italic" style={{ color: "#48cae4" }}>fingertips</em>
            </motion.h1>

            <motion.p
              variants={fadeUp} custom={0.40} initial="hidden" animate="visible"
              className="text-[1.05rem] leading-relaxed max-w-[480px]"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              Consult online or book appointments with trusted, verified doctors — instantly, from anywhere.
            </motion.p>

            <motion.div
              variants={fadeUp} custom={0.55} initial="hidden" animate="visible"
              className="flex flex-wrap gap-3"
            >
              <motion.button
                {...tapScale}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-200"
                style={{ background: "#0096C7", boxShadow: "0 6px 28px rgba(0,150,199,.45)" }}
                onMouseEnter={e => e.currentTarget.style.background = "#007aa3"}
                onMouseLeave={e => e.currentTarget.style.background = "#0096C7"}
              >
                Find your doctor <ArrowRight />
              </motion.button>
              <motion.button
                {...tapScale}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ border: "1.5px solid rgba(255,255,255,.18)", color: "rgba(255,255,255,.65)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.65)"; }}
              >
                How it works
              </motion.button>
            </motion.div>

            {/* stats */}
            <motion.div
              variants={fadeUp} custom={0.70} initial="hidden" animate="visible"
              className="flex gap-10 pt-6 border-t"
              style={{ borderColor: "rgba(255,255,255,.1)" }}
            >
              {[["1,200+", "Verified Doctors"], ["4.9 ★", "Avg. Rating"], ["15 min", "Avg. Wait"]].map(([v, l]) => (
                <div key={l}>
                  <div className="font-[Georgia,serif] text-2xl font-bold text-white">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,.38)" }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right floating card ── */}
          <motion.div
            variants={scaleIn} custom={0.55} initial="hidden" animate="visible"
            className="hidden lg:block shrink-0"
          >
            <div className="w-72 rounded-3xl p-6 space-y-4 border backdrop-blur-2xl"
              style={{ background: "rgba(255,255,255,.07)", borderColor: "rgba(255,255,255,.12)" }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: "linear-gradient(135deg,#0096C7,#00B4D8)" }}>R</div>
                <div>
                  <div className="text-white font-semibold text-sm">Dr. Reena Nair</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,.45)" }}>Cardiologist</div>
                </div>
                <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(0,150,199,.22)", color: "#48cae4" }}>Available</span>
              </div>

              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,.08)" }}>
                {[["Experience","12 years"],["Patients","3,200+"],["Next Slot","2:30 PM Today"],["Rating","4.9 ★"]].map(([k,v])=>(
                  <div key={k} className="flex justify-between py-2.5">
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,.38)" }}>{k}</span>
                    <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,.8)" }}>{v}</span>
                  </div>
                ))}
              </div>

              <motion.button
                {...tapScale}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
                style={{ background: "#0096C7" }}
                onMouseEnter={e => e.currentTarget.style.background="#007aa3"}
                onMouseLeave={e => e.currentTarget.style.background="#0096C7"}
              >
                Book Appointment
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width:"100%", height:60 }}>
            <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

                {/* ---------------- What we offer -------------- */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={viewportOnce}
          className="mb-10 space-y-2"
        >
          <p className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>What we offer</p>
          <h2 className="font-[Georgia,serif] text-3xl md:text-4xl font-bold text-slate-900">
            Care that fits your <em className="not-italic" style={{ color: "#0096C7" }}>lifestyle</em>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {[
            {
              icon: "mdi:phone",
              title: "Voice Consultation",
              desc: "Talk to verified doctors in real-time.",
            },
            {
              icon: "mdi:hospital-building",
              title: "Offline Visits",
              desc: "Book physical consultations nearby.",
            },
            {
              icon: "mdi:pill",
              title: "Digital Prescription",
              desc: "Receive prescriptions instantly.",
            },
            {
              icon: "mdi:file-document",
              title: "Health Records",
              desc: "Securely store medical history.",
            },
          ].map((c) => (
            <OfferCard key={c.title} {...c} />
          ))}
        </motion.div>
      </section>


      {/* -------------- Find a doctor --------------------- */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-20">
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={viewportOnce}
          className="flex items-end justify-between flex-wrap gap-4 mb-8"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>Our specialists</p>
            <h2 className="font-[Georgia,serif] text-3xl md:text-4xl font-bold text-slate-900">
              Find a <em className="not-italic" style={{ color: "#0096C7" }}>Doctor</em>
            </h2>
          </div>

          <motion.button
            {...tapScale}
            className="px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all duration-200"
            style={{ borderColor: "#0096C7", color: "#0096C7" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0096C7"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0096C7"; }}
          >
            View all
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl h-60"
                style={{
                  background: "linear-gradient(90deg,#ddf1f8 25%,#b8e4f3 50%,#ddf1f8 75%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 1.5s linear infinite",
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {doctors.slice(0, 8).map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
          </motion.div>
        )}
      </section>


     {/* ---------------- Testimonials---------------- */}
      <section className="py-20" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={viewportOnce}
            className="mb-10 space-y-2"
          >
            <p className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>Patient stories</p>
            <h2 className="font-[Georgia,serif] text-3xl md:text-4xl font-bold text-slate-900">
              What people <em className="not-italic" style={{ color: "#0096C7" }}>say</em>
            </h2>
          </motion.div>
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            <Testimonial name="Hari Narayanan"   rating={4.8} text="The consultation was smooth and reassuring. Got answers in minutes and felt genuinely heard. Great experience." />
            <Testimonial name="Ajith Sudharsnan" rating={4.8} text="Quick diagnosis and friendly doctor. Took time to explain everything clearly. Highly recommended to all." />
            <Testimonial name="Anoop Raj"         rating={4.8} text="Very professional and helpful. Clear, actionable guidance without the usual long wait times. Will use again." />
          </motion.div>
        </div>
      </section>


      {/* ---------------- Footer ---------------- */}
      <section className="px-6 lg:px-10 py-14">
        <motion.div
          variants={scaleIn} custom={0} initial="hidden" whileInView="visible" viewport={viewportOnce}
          className="max-w-6xl mx-auto rounded-3xl px-10 py-12 flex flex-wrap items-center justify-between gap-8"
          style={{
            background: "linear-gradient(135deg,#003554 0%,#006494 50%,#0096C7 100%)",
            boxShadow: "0 20px 60px rgba(0,150,199,.28)",
          }}
        >
          <div>
            <h2 className="font-[Georgia,serif] text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to take charge<br />
              of your <em className="not-italic" style={{ color: "#90e0ef" }}>health?</em>
            </h2>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,.5)" }}>Join thousands who trust us every day.</p>
          </div>
          <motion.button
            {...tapScale}
            className="flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm transition-all duration-200"
            style={{ background: "#fff", color: "#0096C7", boxShadow: "0 4px 20px rgba(0,0,0,.12)" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Get Started Now <ArrowRight />
          </motion.button>
        </motion.div>
      </section>

      <Footer/>

    </div>
  );
};


// ---------------------sub components -------------------
const OfferCard = ({ icon, title, desc, featured }) => (
  <motion.div
    variants={staggerChild}
    {...hoverLift}
    {...tapScale}
    className="relative rounded-2xl p-6 flex flex-col gap-4 cursor-pointer border overflow-hidden"
    style={featured
      ? { background: "linear-gradient(150deg,#003554,#0077a8)", borderColor: "transparent" }
      : { background: "#fff", borderColor: "#e2f4f9" }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
      style={{ background: featured ? "rgba(255,255,255,.15)" : "#ddf1f8" }}>
      <Icon icon={icon} className="text-blue-400"/>
    </div>
    <div className="flex-1 space-y-1.5">
      <h3 className={`font-bold text-[1rem] ${featured ? "text-white" : "text-slate-900"}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${featured ? "text-white/55" : "text-slate-500"}`}>{desc}</p>
    </div>
    <div
      className="self-end w-8 h-8 rounded-full flex items-center justify-center"
      style={featured
        ? { background: "rgba(255,255,255,.15)", color: "#fff" }
        : { background: "#ddf1f8", color: "#0096C7" }}
    >
      <ArrowRight size={14} />
    </div>
  </motion.div>
);

const DoctorCard = ({ doctor }) => (
  <motion.div
    variants={staggerChild}
    {...hoverLift}
    className="relative bg-white rounded-2xl p-5 text-center border border-slate-100 cursor-pointer overflow-hidden"
  >
    <div className="relative w-20 h-20 mx-auto mb-4">
      <div
        className="w-full h-full rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${doctor.profilePicture || "/images/doctor-avatar.jpg"})`, border: "3px solid #ddf1f8" }}
      />
      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
    </div>

    <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
      style={{ background: "#ddf1f8", color: "#0096C7" }}>
      {doctor.professionalInfo?.specializations?.[0] || "Specialist"}
    </span>

    <h4 className="font-bold text-slate-900 text-sm mb-1.5">Dr. {doctor.name}</h4>

    <div className="flex items-center justify-center gap-1 text-sm font-semibold text-slate-500">
      <StarIcon /> {doctor.rating || "0.0"}
    </div>

    <div className="my-3 border-t border-slate-100" />

    <motion.button
      {...tapScale}
      className="w-full py-2 rounded-xl text-xs font-bold transition-all duration-200"
      style={{ background: "#ddf1f8", color: "#0096C7" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#0096C7"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#ddf1f8"; e.currentTarget.style.color = "#0096C7"; }}
    >
      Book Now
    </motion.button>
  </motion.div>
);

const Testimonial = ({ name, rating, text }) => (
  <motion.div
    variants={staggerChild}
    {...hoverLift}
    className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4"
  >
    <div className="font-[Georgia,serif] text-5xl leading-none font-bold" style={{ color: "#0096C7" }}>"</div>
    <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{ background: "linear-gradient(135deg,#0096C7,#00B4D8)" }}>
        {name.charAt(0)}
      </div>
      <div>
        <div className="font-bold text-slate-900 text-sm">{name}</div>
        <div className="flex items-center gap-0.5 mt-0.5">
          {Array.from({ length: Math.round(rating) }).map((_, i) => <StarIcon key={i} />)}
          <span className="text-[11px] text-slate-400 ml-1">{rating}</span>
        </div>
      </div>
    </div>
  </motion.div>
  
);

export default DoctorLanding;