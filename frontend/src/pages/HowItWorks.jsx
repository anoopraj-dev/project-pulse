import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  fadeUp,
  scaleIn,
  floatY,
  floatYReverse,
  pulseRing,
  hoverLift,
  hoverLiftSubtle,
  tapScale,
  staggerContainer,
  staggerChild,
  viewportOnce,
} from "@/utilis/animations";
import GlobalStyles from "@/components/shared/components/GlobalStyles";
import { Icon } from "@iconify/react";
import Footer from "@/components/layout/components/Footer";

// ---------------- ICON HELPERS ----------------
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

const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("patient"); // patient | doctor

  const patientSteps = [
    {
      num: "01",
      icon: "mdi:account-plus-outline",
      title: "Register & Profile",
      desc: "Create your secure account in under 30 seconds. Complete your personal health profile so our medical team has context when you consult.",
      tip: "We use bank-grade AES-256 encryption to protect your personal details."
    },
    {
      num: "02",
      icon: "mdi:magnify",
      title: "Find Your Specialist",
      desc: "Search our roster of verified, top-rated doctors. Filter by specialty, fee structure, language, or patient reviews.",
      tip: "Every doctor is verified manually by our medical board before listing."
    },
    {
      num: "03",
      icon: "mdi:calendar-check-outline",
      title: "Book & Pay Securely",
      desc: "Choose between virtual calls (video/voice) or physical clinic visits. Pick a slot that fits your day and confirm with easy online payments.",
      tip: "Rescheduling is free up to 2 hours before your appointment."
    },
    {
      num: "04",
      icon: "mdi:television-play",
      title: "Consult & Recover",
      desc: "Launch your secure video room with one tap. Talk to your doctor, receive live advice, and view digital prescriptions instantly in your inbox.",
      tip: "Prescriptions are digitally signed and valid at all local pharmacies."
    }
  ];

  const doctorSteps = [
    {
      num: "01",
      icon: "mdi:shield-check-outline",
      title: "Apply & Verify",
      desc: "Register as a practitioner. Upload your license, medical council credentials, and specialties for verification.",
      tip: "Verification is completed by our compliance team within 24-48 hours."
    },
    {
      num: "02",
      icon: "mdi:clock-outline",
      title: "Set Availability & Fees",
      desc: "Easily set your weekly consultation hours, select consultation formats (audio/video/offline), and set your standard fees.",
      tip: "You can adjust your schedule in real-time or block out holidays anytime."
    },
    {
      num: "03",
      icon: "mdi:doctor",
      title: "Consult Patients",
      desc: "Receive booking notifications. Join calls directly from your dashboard, review patient files, and write digital prescriptions in minutes.",
      tip: "Access past medical records inside the call window for accurate diagnoses."
    },
    {
      num: "04",
      icon: "mdi:wallet-outline",
      title: "Track & Withdraw",
      desc: "Check your consultation statistics, review feedback ratings, and request secure direct-to-bank payouts from your earnings dashboard.",
      tip: "Payouts are processed weekly with detailed statements."
    }
  ];

  const faqItems = [
    {
      q: "Is my consultation private and secure?",
      a: "Yes, absolutely. Pulse360 uses encrypted peer-to-peer audio/video channels for all consultations. Your digital records are stored securely and are only visible to you and the doctors you authorize."
    },
    {
      q: "What equipment do I need for virtual sessions?",
      a: "You just need a smartphone or a laptop with a working front camera and microphone, plus a stable internet connection. No extra app downloads are required."
    },
    {
      q: "How do refund policies work for cancellations?",
      a: "If your doctor cancels the appointment or is a no-show, a full refund is immediately credited to your Pulse Wallet. Patient cancellations done 2 hours prior also qualify for 100% refund."
    },
    {
      q: "How do I download digital prescriptions?",
      a: "Once the doctor completes the consultation, the prescription is generated and saved as an encrypted PDF in your 'Medical Records' tab. You can download or print it anytime."
    }
  ];

  const stepsToRender = activeRole === "patient" ? patientSteps : doctorSteps;

  return (
    <div className="h-root min-h-screen bg-slate-50 overflow-x-hidden">
      <GlobalStyles />

      {/* ------------------ HERO SECTION ------------------ */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        {/* Dark backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)",
          }}
        />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* Ambient glow blobs */}
        <motion.div
          {...floatY(12, 7)}
          className="absolute -top-48 -right-32 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle,rgba(0,150,199,.26) 0%,transparent 70%)",
            filter: "blur(72px)",
          }}
        />
        <motion.div
          {...floatYReverse(12, 9)}
          className="absolute -bottom-28 -left-24 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle,rgba(0,180,216,.15) 0%,transparent 70%)",
            filter: "blur(64px)",
          }}
        />

        {/* Hero content container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-16 sm:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Heading + Subhead */}
          <div className="flex-1 w-full space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              variants={fadeUp}
              custom={0.1}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[10px] sm:text-[11px] tracking-[.12em] uppercase"
              style={{
                background: "rgba(0,150,199,.12)",
                borderColor: "rgba(0,150,199,.3)",
                color: "#48cae4",
              }}
            >
              <motion.span
                {...pulseRing}
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#0096C7" }}
              />
              Simplified Telemedicine
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={0.25}
              initial="hidden"
              animate="visible"
              className="font-[Georgia,serif] text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.1]"
            >
              A simpler path to
              <br />
              your&nbsp;
              <em className="not-italic" style={{ color: "#48cae4" }}>
                well-being
              </em>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.4}
              initial="hidden"
              animate="visible"
              className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans"
              style={{ color: "rgba(255,255,255,.58)" }}
            >
              From booking certified medical specialists to receiving digital prescriptions,
              discover how Pulse360 streamlines your health management journey.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.55}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 font-sans"
            >
              <motion.button
                {...tapScale}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold text-white transition-all shadow-lg"
                style={{ background: "#0096C7" }}
                onClick={() => navigate("/signup")}
              >
                Get Started Now <ArrowRight />
              </motion.button>
              <motion.a
                {...tapScale}
                href="#workflows"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold border transition-all text-white/70 hover:text-white hover:border-white/40"
                style={{ borderColor: "rgba(255,255,255,.18)" }}
              >
                Learn the Steps
              </motion.a>
            </motion.div>
          </div>

          {/* Right Column: Floating interactive card */}
          <motion.div
            variants={scaleIn}
            custom={0.5}
            initial="hidden"
            animate="visible"
            className="hidden lg:block shrink-0"
          >
            <div
              className="w-80 rounded-[2.5rem] p-8 space-y-6 border backdrop-blur-2xl shadow-2xl"
              style={{
                background: "rgba(255,255,255,.05)",
                borderColor: "rgba(255,255,255,.1)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  Interactive Preview
                </span>
              </div>
              <div className="space-y-4">
                <h3 className="text-white font-bold font-sans text-lg">
                  Booking in 3 Steps
                </h3>
                <div className="space-y-3.5">
                  {[
                    { s: "1", t: "Select Doctor", d: "Choose from 1,200+ practitioners", active: true },
                    { s: "2", t: "Select Time & Type", d: "Audio, video call or offline visit", active: false },
                    { s: "3", t: "Confirm & Consult", d: "Instant link, zero waiting room", active: false },
                  ].map((step) => (
                    <div key={step.s} className="flex gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          step.active
                            ? "bg-[#0096C7] text-white"
                            : "bg-white/10 text-white/50 border border-white/15"
                        }`}
                      >
                        {step.s}
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold font-sans ${
                            step.active ? "text-[#48cae4]" : "text-white/80"
                          }`}
                        >
                          {step.t}
                        </div>
                        <div className="text-[10px] text-white/40 mt-0.5 leading-normal">
                          {step.d}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            preserveAspectRatio="none"
            className="w-full h-8 sm:h-12 md:h-16"
          >
            <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ------------------ WORKFLOW EXPLORER SECTION ------------------ */}
      <section id="workflows" className="max-w-7xl mx-auto px-6 lg:px-16 py-16 sm:py-24">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <p className="text-[11px] font-bold tracking-[.14em] uppercase text-[#0096C7]">
            Step-by-Step Guide
          </p>
          <h2 className="font-[Georgia,serif] text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            How Pulse360 Works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-sans leading-relaxed">
            Select your role below to explore your personalized dashboard workflow and booking steps.
          </p>

          {/* Role Toggles */}
          <div className="inline-flex p-1.5 bg-slate-100 rounded-full border border-slate-200/60 font-sans mt-4">
            {[
              { id: "patient", label: "For Patients", icon: "mdi:account-heart-outline" },
              { id: "doctor", label: "For Doctors", icon: "mdi:stethoscope" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeRole === r.id
                    ? "bg-[#0096C7] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon icon={r.icon} className="text-sm" />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Cards Grid */}
        <div className="relative font-sans">
          {/* Vertical connecting line on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-slate-200/70 -translate-x-1/2 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              viewport={viewportOnce}
              className="space-y-12 lg:space-y-20"
            >
              {stepsToRender.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={step.num}
                    variants={staggerChild}
                    className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full ${
                      isEven ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Left/Right Text Side */}
                    <div className="flex-1 w-full space-y-4 text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                          style={{
                            background: "linear-gradient(135deg,#0096C7,#48cae4)",
                            boxShadow: "0 4px 12px rgba(0,150,199,0.2)",
                          }}
                        >
                          {step.num}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                        {step.desc}
                      </p>
                      <div
                        className="p-3.5 rounded-xl border border-sky-100 flex items-start gap-2.5 text-left bg-sky-50/40"
                      >
                        <Icon icon="mdi:information-outline" className="text-sky-500 text-lg shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium text-sky-700 leading-normal">
                          {step.tip}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Node Connector (Visual badge in the middle) */}
                    <div className="hidden lg:flex shrink-0 w-16 h-16 rounded-full bg-slate-50 border-4 border-white shadow-md items-center justify-center z-10">
                      <Icon icon={step.icon} className="text-2xl text-[#0096C7]" />
                    </div>

                    {/* Step Card Visual Placeholder */}
                    <motion.div
                      {...hoverLiftSubtle}
                      className="flex-1 w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/80 shadow-sm text-center relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform pointer-events-none" />
                      <div
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-105"
                        style={{ background: "#ddf1f8" }}
                      >
                        <Icon icon={step.icon} className="text-[#0096C7]" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">
                        {step.title} Stage
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Monitor, modify, and track this milestone live in your personalized dashboard panels.
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ------------------ DASHBOARD NAVIGATION GUIDE ------------------ */}
      <section className="py-16 sm:py-24 bg-slate-100/60 font-sans border-y border-slate-200/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center space-y-4 mb-14"
          >
            <p className="text-[11px] font-bold tracking-[.14em] uppercase text-[#0096C7]">
              Dashboard Features
            </p>
            <h2 className="font-[Georgia,serif] text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Platform Navigation
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              Explore the key tabs inside your secure portal. We’ve designed navigation to be straightforward and responsive.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "ph:calendar-check-bold",
                title: "Appointments Panel",
                desc: "Check upcoming bookings, request reschedules, and start live consultations with a single tap. Complete logs of past appointments are always available."
              },
              {
                icon: "ph:chat-teardrop-text-bold",
                title: "Direct Messages",
                desc: "Follow up with your doctor or patient post-consultation using our secure text chat. Send text notes, summaries, and stay in touch."
              },
              {
                icon: "ph:wallet-bold",
                title: "Pulse Wallet",
                desc: "Fund your account, check consultation logs, pay doctors, or request direct withdrawals to your bank accounts instantly and securely."
              }
            ].map((panel, idx) => (
              <motion.div
                key={panel.title}
                variants={staggerChild}
                {...hoverLift}
                className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-6"
                  style={{ background: "#ddf1f8" }}
                >
                  <Icon icon={panel.icon} className="text-[#0096C7]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{panel.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{panel.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------ FAQ SECTION ------------------ */}
      <section className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center space-y-4 mb-14"
        >
          <p className="text-[11px] font-bold tracking-[.14em] uppercase text-[#0096C7]">
            Got Questions?
          </p>
          <h2 className="font-[Georgia,serif] text-3xl sm:text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4 font-sans">
          {faqItems.map((faq, idx) => (
            <motion.div
              key={idx}
              {...hoverLiftSubtle}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/50 shadow-sm"
            >
              <h4 className="text-base sm:text-lg font-bold text-slate-800 mb-2 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0096C7] shrink-0" />
                {faq.q}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed pl-4">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ------------------ CTA SECTION ------------------ */}
      <section className="px-6 lg:px-16 pb-16 sm:pb-24">
        <motion.div
          variants={scaleIn}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[3rem] px-8 sm:px-16 py-12 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-10"
          style={{
            background: "linear-gradient(135deg,#003554 0%,#006494 50%,#0096C7 100%)",
            boxShadow: "0 20px 60px rgba(0,150,199,.28)",
          }}
        >
          <div className="text-center lg:text-left space-y-4">
            <h2 className="font-[Georgia,serif] text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to take charge
              <br className="hidden sm:block" />
              of your{" "}
              <em className="not-italic" style={{ color: "#90e0ef" }}>
                health?
              </em>
            </h2>
            <p className="text-base sm:text-lg opacity-80 font-sans" style={{ color: "rgba(255,255,255,.8)" }}>
              Join thousands of users who have streamlined scheduling with Pulse360.
            </p>
          </div>
          <motion.button
            {...tapScale}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-base bg-white text-[#0096C7] shadow-xl font-sans"
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

export default HowItWorks;
