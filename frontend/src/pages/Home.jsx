
// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   motion,
//   useSpring,
//   useTransform,
//   useMotionValue,
// } from "framer-motion";
// import { Icon } from "@iconify/react";
// import Footer from "../components/layout/components/Footer";
// import { aboutUs, whyChooseUs, welcomeText } from "../constants/homePageData";
// import GlobalStyles from "@/components/shared/components/GlobalStyles";
// import { useNavigate } from "react-router-dom";

// import {
//   scaleIn,
//   staggerContainer,
//   staggerChild,
//   floatY,
//   floatYReverse,
//   pulseRing,
//   hoverLift,
//   hoverLiftSubtle,
//   viewportOnce,
// } from "../utilis/animations";
// import Heart from "@/components/ui/3D/Heart";
// import { fetchHomepageStats } from "@/api/user/userApis";

// // -------------- Arrow ----------------------------------
// const ArrowRight = ({ size = 15 }) => (
//   <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
//     <path
//       d="M3 8h10M9 4l4 4-4 4"
//       stroke="currentColor"
//       strokeWidth="2.2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// );

// // ---------------- Primary Button ----------------------
// const PrimaryBtn = ({ children, onClick }) => (
//   <motion.button
//     onClick={onClick}
//     className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white"
//     style={{ background: "#0096C7", boxShadow: "0 6px 24px rgba(0,150,199,.35)" }}
//     whileHover={{ backgroundColor: "#007aa3", y: -2, boxShadow: "0 10px 28px rgba(0,150,199,.4)" }}
//     whileTap={{ scale: 0.97 }}
//     transition={{ duration: 0.2 }}
//   >
//     {children}
//   </motion.button>
// );

// // --------------------- Feature badge (top bar) ---------------------
// const FeatureBadge = ({ icon, value, label, delay = 0 }) => (
//   <motion.div
//     className="flex items-center gap-2 px-3 py-2 rounded-xl pointer-events-none select-none"
//     style={{
//       background: "rgba(0,150,199,0.12)",
//       border: "1px solid rgba(0,150,199,0.28)",
//       backdropFilter: "blur(10px)",
//       WebkitBackdropFilter: "blur(10px)",
//     }}
//     initial={{ opacity: 0, y: -10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
//   >
//     <Icon icon={icon} className="text-base shrink-0" style={{ color: "#48cae4" }} />
//     <div>
//       <div className="text-[11px] font-bold text-white leading-none">{value}</div>
//       <div className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,.4)" }}>
//         {label}
//       </div>
//     </div>
//   </motion.div>
// );

// // ------------------- Callout annotation -----------------------
// const Callout = ({ side = "right", label, sub, delay = 0, color = "#48cae4" }) => {
//   const isRight = side === "right";
//   return (
//     <motion.div
//       className={`flex items-center gap-0 pointer-events-none select-none ${isRight ? "flex-row" : "flex-row-reverse"}`}
//       initial={{ opacity: 0, x: isRight ? 16 : -16 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
//     >
//       <div
//         className="w-1.5 h-1.5 rounded-full shrink-0 z-10"
//         style={{ background: color, boxShadow: `0 0 6px ${color}` }}
//       />
//       <div
//         className="h-px shrink-0"
//         style={{
//           width: 32,
//           background: `linear-gradient(${isRight ? "90deg" : "270deg"}, ${color}99, ${color}11)`,
//         }}
//       />
//       <div className={`flex flex-col ${isRight ? "items-start pl-2" : "items-end pr-2"}`}>
//         <span className="text-[9px] sm:text-[11px] font-bold leading-none tracking-wide" style={{ color }}>
//           {label}
//         </span>
//         {sub && (
//           <span
//             className="text-[7px] sm:text-[9px] mt-0.5 font-medium tracking-wider uppercase"
//             style={{ color: "rgba(255,255,255,.35)" }}
//           >
//             {sub}
//           </span>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // --------------- Scan ring ------------------------
// const ScanRing = ({ delay = 0 }) => (
//   <motion.div
//     className="absolute inset-0 rounded-full pointer-events-none z-10"
//     style={{ border: "1px solid rgba(0,150,199,0.2)" }}
//     initial={{ opacity: 0, scale: 0.7 }}
//     animate={{ opacity: [0, 0.55, 0], scale: [0.7, 1.35, 1.6] }}
//     transition={{ duration: 2.8, delay, repeat: Infinity, ease: "easeOut" }}
//   />
// );

// //-------------------- HOME -----------------------
// const Home = () => {
//   const [stats, setStats] = useState([]);
//   const [statsData, setStatsData] = useState([]);
//   const [isVisible, setIsVisible] = useState(false);
//   const [scrollPhase, setScrollPhase] = useState("initial");
//   const navigate = useNavigate();

//   // -------------------- Refs ------------------------
//   const heroRef = useRef(null);
//   const isLockedRef = useRef(false);
//   const progressRef = useRef(0);
//   const touchStartRef = useRef(0);
//   const rafRef = useRef(null);

//   // -------------------- Mouse rotation -----------------
//   const mouseX = useMotionValue(0);
//   const mouseY = useMotionValue(0);

//   // -------------- Scroll progress --------------------
//   const progress = useMotionValue(0);
//   const springProg = useSpring(progress, { stiffness: 60, damping: 22, mass: 1 });

//   const overlayOpacity = useTransform(springProg, [0, 0.3], [1, 0]);

//   // Text panel rises from below
//   const textY = useTransform(springProg, [0, 1], ["100%", "0%"]);
//   const textOpacity = useTransform(springProg, [0, 0.2], [0, 1]);

//   // Heart reacts
//   const heartScale = useTransform(springProg, [0, 1], [1.3, 1]);
//   const heartDriftY = useTransform(springProg, [0, 1], ["0%", "-10%"]);
//   const heartOpacity = useTransform(springProg, [0.25, 0.72], [1, 0.22]);
//   const vignette = useTransform(springProg, [0, 0.5], [0, 0.95]);
//   const hintOpacity = useTransform(springProg, [0, 0.08], [1, 0]);

//   // ------------------------ Mouse handlers -----------------
//   const handleMouseMove = useCallback((e) => {
//     if (!heroRef.current) return;
//     const rect = heroRef.current.getBoundingClientRect();
//     mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
//     mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
//   }, [mouseX, mouseY]);

//   const handleMouseLeave = useCallback(() => {
//     mouseX.set(0);
//     mouseY.set(0);
//   }, [mouseX, mouseY]);

//   // --------- Check if hero is pinned at viewport top --------------
//   const isHeroAtTop = useCallback(() => {
//     if (!heroRef.current) return false;
//     const rect = heroRef.current.getBoundingClientRect();
//     return rect.top > -10 && rect.top < 10;
//   }, []);

//   const isHeroVisible = useCallback(() => {
//     if (!heroRef.current) return false;
//     const rect = heroRef.current.getBoundingClientRect();
//     return rect.top < window.innerHeight && rect.bottom > 0;
//   }, []);

//   // ------ Lock scroll: keep hero pinned at top ---------------
//   const lockScroll = useCallback(() => {
//     if (!heroRef.current) return;
//     const top = heroRef.current.offsetTop;
//     window.scrollTo(0, top);
//   }, []);

//   // -------------- delta handler -----------------------
//   const handleDelta = useCallback((rawDelta) => {
//     if (!heroRef.current) return;

//     const down = rawDelta > 0;
//     const up = rawDelta < 0;
//     const p = progressRef.current;
//     const atTop = isHeroAtTop();
//     const visible = isHeroVisible();


//     if (!isLockedRef.current) {
//       if (down && atTop && p < 0.99) {
//         isLockedRef.current = true;
//       } else if (up && visible && p >= 0.99 && atTop) {
//         isLockedRef.current = true;
//       } else {
//         return;
//       }
//     }

//     // While locked: prevent native scroll and drive progress
//     lockScroll();

//     const step = 0.1;
//     let next = p;

//     if (down) {
//       next = Math.min(p + step, 1);
//     } else if (up) {
//       next = Math.max(p - step, 0);
//     }

//     progress.set(next);
//     progressRef.current = next;

//     if (down && next >= 0.99) {
//       progressRef.current = 1;
//       progress.set(1);
//       isLockedRef.current = false;
//       setScrollPhase("done");
//     } else if (up && next <= 0.01) {
//       progressRef.current = 0;
//       progress.set(0);
//       isLockedRef.current = false;
//       setScrollPhase("initial");
//     } else {
//       setScrollPhase("animating");
//     }
//   }, [progress, lockScroll, isHeroAtTop, isHeroVisible]);

//   // ------------------ Wheel ------------------------
//   useEffect(() => {
//     const onWheel = (e) => {
//       if (!isHeroVisible()) return;
//       if (isLockedRef.current) {
//         e.preventDefault();
//         e.stopPropagation();
//       }
//       handleDelta(e.deltaY);
//     };
//     window.addEventListener("wheel", onWheel, { passive: false });
//     return () => window.removeEventListener("wheel", onWheel);
//   }, [handleDelta, isHeroVisible]);

//   // -------------------- Touch ---------------------
//   useEffect(() => {
//     const onStart = (e) => {
//       touchStartRef.current = e.touches[0].clientY;
//     };
//     const onMove = (e) => {
//       if (!isHeroVisible()) return;
//       const currentY = e.touches[0].clientY;
//       const dy = touchStartRef.current - currentY;
//       touchStartRef.current = currentY;
//       if (isLockedRef.current) {
//         e.preventDefault();
//         e.stopPropagation();
//       }
//       handleDelta(dy * 2.2);
//     };
//     window.addEventListener("touchstart", onStart, { passive: true });
//     window.addEventListener("touchmove", onMove, { passive: false });
//     return () => {
//       window.removeEventListener("touchstart", onStart);
//       window.removeEventListener("touchmove", onMove);
//     };
//   }, [handleDelta, isHeroVisible]);

//   // ------------------ Prevent scroll drift while locked ------------------
//   useEffect(() => {
//     const onScroll = () => {
//       if (isLockedRef.current) {
//         cancelAnimationFrame(rafRef.current);
//         rafRef.current = requestAnimationFrame(lockScroll);
//       }
//     };
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       cancelAnimationFrame(rafRef.current);
//     };
//   }, [lockScroll]);

//   // ------------ Stats load ------------------
//   useEffect(() => {
//     const t = setTimeout(() => setIsVisible(true), 500);
//     return () => clearTimeout(t);
//   }, []);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetchHomepageStats();
//         if (res.data?.success) {
//           const d = res.data.data;
//           const formatted = [
//             { label: "Happy Patients", value: d.patients, icon: "mdi:account-heart-outline" },
//             { label: "Expert Doctors", value: d.doctors, icon: "mdi:stethoscope" },
//             { label: "Appointments", value: d.appointments, icon: "mdi:calendar-check" },
//           ].slice(0, 3);
//           setStatsData(formatted);
//           setStats(formatted.map(() => 0));
//         }
//       } catch (err) { console.error(err); }
//     };
//     load();
//   }, []);

//   useEffect(() => {
//     if (!isVisible || statsData.length === 0) return;
//     let t0;
//     const tick = (t) => {
//       if (!t0) t0 = t;
//       const p = Math.min((t - t0) / 2000, 1);
//       setStats(statsData.map((s) => Math.floor(s.value * p)));
//       if (p < 1) requestAnimationFrame(tick);
//     };
//     requestAnimationFrame(tick);
//   }, [isVisible, statsData]);

//   const fmt = (val = 0, i) => {
//     const raw = statsData[i]?.value || 0;
//     const v = val >= raw ? raw : val;
//     if (raw >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M+";
//     if (raw >= 1_000) return Math.floor(v / 1000) + "K+";
//     return v + "+";
//   };

//   // ---------------- JSX ------------------
//   return (
//     <div className="min-h-screen bg-slate-50 font-[Georgia,serif] overflow-x-hidden">
//       <GlobalStyles />

//       {/* -----------------HERO -------------------*/}
//       <div
//         ref={heroRef}
//         className="relative w-full overflow-hidden"
//         style={{ height: "100vh" }}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//       >
//         {/* ------------- BG gradient --------------------- */}
//         <div
//           className="absolute inset-0"
//           style={{ background: "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)" }}
//         />
//         {/* --------------Grid texture --------------- */}
//         <div
//           className="absolute inset-0 opacity-[.032]"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
//             backgroundSize: "52px 52px",
//           }}
//         />

//         {/* ----------- Ambient blobs --------------- */}
//         <motion.div
//           className="absolute -top-48 -right-32 w-[340px] h-[340px] sm:w-[560px] sm:h-[560px] lg:w-[720px] lg:h-[720px] rounded-full pointer-events-none"
//           style={{ background: "radial-gradient(circle,rgba(0,150,199,.28) 0%,transparent 70%)", filter: "blur(72px)" }}
//           {...floatY(14, 7)}
//         />
//         <motion.div
//           className="absolute -bottom-28 -left-24 w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] lg:w-[520px] lg:h-[520px] rounded-full pointer-events-none"
//           style={{ background: "radial-gradient(circle,rgba(0,180,216,.16) 0%,transparent 70%)", filter: "blur(64px)" }}
//           {...floatYReverse(14, 9)}
//         />

//         <motion.div
//   className="absolute left-1/2 pointer-events-none"
//   style={{
//     x: "-50%",
//     top: "35%",
//     width: "min(115vw, 900px)", // reduced mobile size
//     aspectRatio: "1",
//     scale: heartScale,
//     y: heartDriftY,
//     opacity: heartOpacity,
//     transformOrigin: "center top",
//   }}
// >
//           <Heart mouseX={mouseX} mouseY={mouseY} />
//         </motion.div>

//         {/* ------------- Vignette grows with scroll --------------- */}
//         <motion.div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             background:
//               "linear-gradient(to top, rgba(0,10,20,1) 0%, rgba(0,10,20,0.75) 28%, rgba(0,10,20,0.18) 55%, transparent 78%)",
//             opacity: vignette,
//           }}
//         />

//         <div
//           className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
//           style={{ background: "linear-gradient(to top, rgba(0,10,20,0.6) 0%, transparent 100%)" }}
//         />

//         {/* Top edge fade */}
//         <div
//           className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
//           style={{ background: "linear-gradient(to bottom, rgba(0,19,30,0.5) 0%, transparent 100%)" }}
//         />

//         {/* ----------------- OVERLAY ANNOTATIONS --------------------*/}
//         <motion.div
//           className="absolute inset-0 pointer-events-none"
//           style={{ opacity: overlayOpacity }}
//         >
//           {/* ------------------ Row A ─ top bar ------------- */}

//           <motion.div
//             className="absolute flex items-center"
//             style={{ top: "clamp(12px, 3.5vh, 28px)", left: "clamp(12px, 4%, 48px)" }}
//             initial={{ opacity: 0, x: -12 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           >
//             <div
//               className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] sm:text-[10px] font-bold tracking-[.14em] uppercase"
//               style={{
//                 background: "rgba(0,150,199,.12)",
//                 borderColor: "rgba(0,150,199,.3)",
//                 color: "#48cae4",
//                 backdropFilter: "blur(8px)",
//                 WebkitBackdropFilter: "blur(8px)",
//               }}
//             >
//               <motion.span
//                 className="w-1.5 h-1.5 rounded-full"
//                 style={{ background: "#0096C7" }}
//                 {...pulseRing}
//               />
//               Pulse360
//             </div>
//           </motion.div>

//           <div
//             className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 sm:gap-3"
//             style={{ top: "clamp(12px, 3.5vh, 28px)" }}
//           >
//             <FeatureBadge icon="mdi:wifi-check" value="99.9%" label="Uptime" delay={0.3} />
//             <FeatureBadge icon="mdi:shield-lock-outline" value="256-bit" label="Encrypted" delay={0.45} />
//             <FeatureBadge icon="mdi:clock-fast" value="< 2 min" label="Book Time" delay={0.6} />
//           </div>

//           <motion.div
//             className="absolute flex items-center"
//             style={{ top: "clamp(12px, 3.5vh, 28px)", right: "clamp(12px, 4%, 48px)" }}
//             initial={{ opacity: 0, x: 12 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
//           >
//             <div
//               className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase"
//               style={{
//                 background: "rgba(0,150,199,.08)",
//                 border: "1px solid rgba(0,150,199,.2)",
//                 color: "rgba(255,255,255,.4)",
//                 backdropFilter: "blur(8px)",
//                 WebkitBackdropFilter: "blur(8px)",
//               }}
//             >
//               <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0096C7" }} />
//               <span className="hidden sm:inline">Platform</span> Live
//             </div>
//           </motion.div>

//           <div
//             className="absolute flex flex-col gap-3 sm:gap-5"
//             style={{
//               top: "38%",
//               left: "clamp(8px, 3%, 40px)",
//             }}
//           >
//             <Callout side="left" label="Easy Booking" sub="2-tap scheduling" delay={0.5} />
//             <Callout side="left" label="Secure Records" sub="End-to-end encrypted" delay={0.65} color="#90e0ef" />
//             <Callout side="left" label="24/7 Support" sub="Always available" delay={0.8} color="#caf0f8" />
//           </div>

//           <div
//             className="absolute flex flex-col gap-3 sm:gap-5 items-end"
//             style={{
//               top: "38%",
//               right: "clamp(8px, 3%, 40px)",
//             }}
//           >
//             <Callout side="right" label="Smart Matching" sub="AI doctor pairing" delay={0.55} />
//             <Callout side="right" label="Telemedicine" sub="Video consultations" delay={0.7} color="#90e0ef" />
//             <Callout side="right" label="Fast Results" sub="< 2 min response" delay={0.85} color="#caf0f8" />
//           </div>

//           {/* Scan rings — centered on heart (upper area) */}
//           <div
//             className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
//             style={{ top: "18%", width: "min(160vw, 900px)" }}
//           >
//             <div className="relative w-full" style={{ paddingTop: "50%" }}>
//               {/* rings centered at heart center */}
//               <div
//                 className="absolute"
//                 style={{
//                   top: "50%",
//                   left: "50%",
//                   transform: "translate(-50%, -50%)",
//                   width: "40%",
//                   aspectRatio: "1",
//                 }}
//               >
//                 <ScanRing delay={0.2} />
//                 <ScanRing delay={1.2} />
//                 <ScanRing delay={2.2} />
//               </div>
//             </div>
//           </div>

//           {/* ── Hero headline (initial state, fades out on scroll) */}
//           <div
//             className="absolute left-1/2 -translate-x-1/2 text-center w-full px-4"
//             style={{ bottom: "35%" }}
//           >
//             <motion.div
//               className="space-y-2"
//               initial={{ opacity: 0, y: 18 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
//             >
//               <h1
//                 className="font-[Georgia] text-2xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.08]"
//                 style={{ textShadow: "0 2px 40px rgba(0,0,0,0.75)" }}
//               >
//                 Your health.{" "}
//                 <em className="not-italic" style={{ color: "#48cae4" }}>Our priority.</em>
//               </h1>
//               <p
//                 className="text-[11px] sm:text-sm font-medium tracking-wide"
//                 style={{ color: "rgba(255,255,255,.42)", textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
//               >
//                 Modern healthcare, built around you
//               </p>
//             </motion.div>
//           </div>
//         </motion.div>
//         {/* end overlay annotations */}

//         {/* ── TEXT PANEL — springs up on scroll ─────────────── */}
//         <motion.div
//           className="absolute inset-x-0 bottom-0 z-20"
//           style={{ y: textY, opacity: textOpacity }}
//         >
//           <div>
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-8 sm:pb-14">
//               <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-16">

//                 {/* Left: headline + CTAs */}
//                 <div className="flex-1 max-w-2xl space-y-4 sm:space-y-6 text-center lg:text-left mx-auto lg:mx-0">
//                   {/* Badge */}
//                   <div
//                     className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[10px] sm:text-[11px] font-bold tracking-[.12em] uppercase"
//                     style={{
//                       background: "rgba(0,150,199,.13)",
//                       borderColor: "rgba(0,150,199,.32)",
//                       color: "#48cae4",
//                       backdropFilter: "blur(8px)",
//                       WebkitBackdropFilter: "blur(8px)",
//                     }}
//                   >
//                     <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#0096C7" }} />
//                     Modern Healthcare Platform
//                   </div>

//                   {/* Headline */}
//                   <h1
//                     className="font-[Georgia] text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-medium text-white leading-[1.1]"
//                     style={{ textShadow: "0 2px 32px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)" }}
//                   >
//                     Care that fits
//                     <br className="hidden sm:block" />
//                     your&nbsp;
//                     <em className="not-italic" style={{ color: "#48cae4" }}>lifestyle</em>
//                   </h1>

//                   {/* Subtext */}
//                   <p
//                     className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0"
//                     style={{ color: "rgba(255,255,255,.62)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
//                   >
//                     {welcomeText}
//                   </p>

//                   {/* CTAs */}
//                   <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
//                     <PrimaryBtn onClick={() => navigate("/signin")}>
//                       Find your doctor <ArrowRight />
//                     </PrimaryBtn>
//                     <motion.button
//                       className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border"
//                       style={{
//                         borderColor: "rgba(255,255,255,.2)",
//                         color: "rgba(255,255,255,.68)",
//                         backdropFilter: "blur(8px)",
//                         WebkitBackdropFilter: "blur(8px)",
//                         background: "rgba(255,255,255,0.04)",
//                       }}
//                       whileHover={{ backgroundColor: "rgba(255,255,255,0.10)", color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={() => navigate("/about-us")}
//                     >
//                       How it works
//                     </motion.button>
//                   </div>
//                 </div>

//                 {/* Right: stat pills — desktop only */}
//                 {statsData.length > 0 && (
//                   <div className="hidden lg:flex flex-col gap-3 shrink-0 mb-1">
//                     {statsData.map((stat, i) => (
//                       <div
//                         key={stat.label}
//                         className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
//                         style={{
//                           background: "rgba(0,150,199,0.09)",
//                           borderColor: "rgba(0,150,199,0.22)",
//                           backdropFilter: "blur(12px)",
//                           WebkitBackdropFilter: "blur(12px)",
//                           minWidth: "180px",
//                         }}
//                       >
//                         <div
//                           className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
//                           style={{ background: "rgba(0,150,199,0.18)" }}
//                         >
//                           <Icon icon={stat.icon} className="text-lg text-[#48cae4]" />
//                         </div>
//                         <div>
//                           <div className="text-lg font-bold text-white leading-none">{fmt(stats[i], i)}</div>
//                           <div
//                             className="text-[9px] uppercase tracking-widest mt-0.5 font-semibold"
//                             style={{ color: "rgba(255,255,255,.38)" }}
//                           >
//                             {stat.label}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Mobile stats */}
//               {statsData.length > 0 && (
//                 <div
//                   className="flex lg:hidden justify-center gap-6 sm:gap-10 mt-4 pt-4 border-t"
//                   style={{ borderColor: "rgba(255,255,255,.1)" }}
//                 >
//                   {statsData.map((stat, i) => (
//                     <div key={stat.label} className="text-center">
//                       <div className="text-base sm:text-xl font-bold text-white">{fmt(stats[i], i)}</div>
//                       <div
//                         className="text-[9px] uppercase tracking-widest mt-1"
//                         style={{ color: "rgba(255,255,255,.38)" }}
//                       >
//                         {stat.label}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Wave into light sections */}
//             <svg
//               viewBox="0 0 1440 56"
//               preserveAspectRatio="none"
//               className="w-full block"
//               style={{ height: "clamp(24px, 4vw, 56px)", marginBottom: "-2px" }}
//             >
//               <path d="M0,56 C480,0 960,0 1440,56 L1440,56 L0,56 Z" fill="#f8fafc" />
//             </svg>
//           </div>
//         </motion.div>

//         {/* ── Scroll hint ───────────────────────────────────────── */}
//         <motion.div
//           className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
//           style={{ opacity: hintOpacity }}
//         >
//           <span
//             className="text-[9px] font-bold tracking-[.2em] uppercase"
//             style={{ color: "rgba(255,255,255,.38)" }}
//           >
//             Scroll to explore
//           </span>
//           <motion.div
//             animate={{ y: [0, 7, 0] }}
//             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//           >
//             <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
//               <path
//                 d="M10 4v12M5 11l5 5 5-5"
//                 stroke="rgba(255,255,255,.35)"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* ------------ Healthier Tomorrow ----------------*/}
//       <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16 sm:py-24">
//         <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
//           <motion.div
//             className="space-y-6 sm:space-y-8 order-2 lg:order-1 text-center lg:text-left"
//             variants={staggerContainer}
//             initial="hidden"
//             whileInView="visible"
//             viewport={viewportOnce}
//           >
//             <div className="space-y-4 sm:space-y-6">
//               <motion.p
//                 variants={staggerChild}
//                 className="text-[11px] font-bold tracking-[.14em] uppercase"
//                 style={{ color: "#0096C7" }}
//               >
//                 Our promise
//               </motion.p>
//               <motion.h2
//                 variants={staggerChild}
//                 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
//               >
//                 A Healthier Tomorrow<br />
//                 <em className="not-italic" style={{ color: "#0096C7" }}>Starts Here</em>
//               </motion.h2>
//               <motion.p
//                 variants={staggerChild}
//                 className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
//               >
//                 {welcomeText}
//               </motion.p>
//             </div>
//             <motion.div variants={staggerChild}>
//               <PrimaryBtn onClick={() => navigate("/signup")}>
//                 Find your doctor <ArrowRight />
//               </PrimaryBtn>
//             </motion.div>
//           </motion.div>

//           <motion.div
//             className="relative order-1 lg:order-2"
//             variants={scaleIn}
//             initial="hidden"
//             whileInView="visible"
//             viewport={viewportOnce}
//             custom={0.15}
//           >
//             <div
//               className="absolute -top-4 -right-4 w-full h-full rounded-3xl border-2 border-dashed opacity-30 pointer-events-none hidden sm:block"
//               style={{ borderColor: "#0096C7" }}
//             />
//             <img
//               src="/banner.webp"
//               alt="Healthcare Banner"
//               className="w-full rounded-3xl object-cover shadow-2xl relative z-10"
//               style={{ boxShadow: "0 24px 60px rgba(0,150,199,.2)" }}
//             />
//           </motion.div>
//         </div>
//       </section>

//       {/* ------------- Stats ----------------- */}
//       <section className="py-16 sm:py-24" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
//         <div className="max-w-7xl mx-auto px-6 lg:px-16">
//           <motion.div
//             className="text-center mb-12 sm:mb-20 space-y-3"
//             variants={staggerContainer}
//             initial="hidden"
//             whileInView="visible"
//             viewport={viewportOnce}
//           >
//             <motion.p
//               variants={staggerChild}
//               className="text-[11px] font-bold tracking-[.14em] uppercase"
//               style={{ color: "#0096C7" }}
//             >
//               By the numbers
//             </motion.p>
//             <motion.h2 variants={staggerChild} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
//               Trusted By <em className="not-italic" style={{ color: "#0096C7" }}>Millions</em>
//             </motion.h2>
//             <motion.p variants={staggerChild} className="text-slate-500 text-sm sm:text-base">
//               Real results from real users
//             </motion.p>
//           </motion.div>

//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
//             variants={staggerContainer}
//             initial="hidden"
//             whileInView="visible"
//             viewport={viewportOnce}
//           >
//             {statsData.length > 0 &&
//               stats.length === statsData.length &&
//               statsData.map((stat, i) => (
//                 <motion.div
//                   key={stat.label}
//                   variants={staggerChild}
//                   className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-default"
//                 >
//                   <div
//                     className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
//                     style={{ background: "#ddf1f8" }}
//                   >
//                     <Icon icon={stat.icon} className="text-3xl text-[#0096C7]" />
//                   </div>
//                   <div className="text-3xl font-bold text-slate-900">{fmt(stats[i], i)}</div>
//                   <p className="text-sm text-slate-500 mt-2 font-medium tracking-wide">{stat.label}</p>
//                 </motion.div>
//               ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* ------------- Why Pulse360 ---------------- */}
//       <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16 sm:py-24">
//         <motion.div
//           className="text-center mb-12 sm:mb-16 space-y-3"
//           variants={staggerContainer}
//           initial="hidden"
//           whileInView="visible"
//           viewport={viewportOnce}
//         >
//           <motion.p
//             variants={staggerChild}
//             className="text-[11px] font-bold tracking-[.14em] uppercase"
//             style={{ color: "#0096C7" }}
//           >
//             Our advantages
//           </motion.p>
//           <motion.h2 variants={staggerChild} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
//             Why <em className="not-italic" style={{ color: "#0096C7" }}>Pulse360?</em>
//           </motion.h2>
//         </motion.div>

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10"
//           variants={staggerContainer}
//           initial="hidden"
//           whileInView="visible"
//           viewport={viewportOnce}
//         >
//           {[
//             { icon: "mdi:rocket-launch-outline", title: "Seamless Booking", text: whyChooseUs[0] },
//             { icon: "mdi:doctor", title: "Trusted Doctors", text: whyChooseUs[1] },
//             { icon: "mdi:shield-check-outline", title: "24/7 Support", text: whyChooseUs[2] },
//             { icon: "mdi:lock-outline", title: "Secure & Private", text: whyChooseUs[3] },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               variants={staggerChild}
//               {...hoverLift}
//               className="flex items-start gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm cursor-default"
//             >
//               <div
//                 className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
//                 style={{ background: "#ddf1f8" }}
//               >
//                 <Icon icon={item.icon} className="text-2xl text-[#0096C7]" />
//               </div>
//               <div className="space-y-2">
//                 <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
//                 <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </section>

//       {/*-------------- About ------------------*/}
//       <section className="py-16 sm:py-24" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
//         <div className="max-w-7xl mx-auto px-6 lg:px-16">
//           <div className="grid lg:grid-cols-2 gap-14 sm:gap-20 items-center">
//             <motion.div
//               className="relative order-2 lg:order-1"
//               variants={scaleIn}
//               initial="hidden"
//               whileInView="visible"
//               viewport={viewportOnce}
//               custom={0}
//             >
//               <div
//                 className="absolute -bottom-4 -left-4 w-full h-full rounded-3xl border-2 border-dashed opacity-30 pointer-events-none hidden sm:block"
//                 style={{ borderColor: "#0096C7" }}
//               />
//               <img
//                 src="/connection.webp"
//                 alt="Healthcare connection"
//                 className="w-full rounded-3xl object-cover shadow-2xl relative z-10"
//                 style={{ boxShadow: "0 24px 60px rgba(0,150,199,.18)" }}
//               />
//             </motion.div>

//             <motion.div
//               className="space-y-6 sm:space-y-8 order-1 lg:order-2 text-center lg:text-left"
//               variants={staggerContainer}
//               initial="hidden"
//               whileInView="visible"
//               viewport={viewportOnce}
//             >
//               <div className="space-y-4">
//                 <motion.p
//                   variants={staggerChild}
//                   className="text-[11px] font-bold tracking-[.14em] uppercase"
//                   style={{ color: "#0096C7" }}
//                 >
//                   Who we are
//                 </motion.p>
//                 <motion.h2
//                   variants={staggerChild}
//                   className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
//                 >
//                   About Our <em className="not-italic" style={{ color: "#0096C7" }}>Mission</em>
//                 </motion.h2>
//               </div>
//               <motion.div variants={staggerChild} className="space-y-4 text-left">
//                 {[aboutUs[0], aboutUs[1]].map((text, i) => (
//                   <motion.div
//                     key={i}
//                     {...hoverLiftSubtle}
//                     className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
//                   >
//                     <div className="flex items-start gap-4">
//                       <div
//                         className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1"
//                         style={{ background: "#ddf1f8" }}
//                       >
//                         <Icon icon="mdi:check-bold" className="text-[10px] text-[#0096C7]" />
//                       </div>
//                       <p className="text-sm text-slate-600 leading-relaxed font-medium">{text}</p>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//               <motion.div variants={staggerChild}>
//                 <PrimaryBtn onClick={() => navigate("/about-us")}>Learn more <ArrowRight /></PrimaryBtn>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ---------------- Footer CTA ----------------------*/}
//       <section className="px-6 lg:px-16 py-16 sm:py-20">
//         <motion.div
//           className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[3rem] px-8 sm:px-16 py-12 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-10"
//           style={{
//             background: "linear-gradient(135deg,#003554 0%,#006494 50%,#0096C7 100%)",
//             boxShadow: "0 20px 60px rgba(0,150,199,.28)",
//           }}
//           variants={scaleIn}
//           initial="hidden"
//           whileInView="visible"
//           viewport={viewportOnce}
//           custom={0}
//         >
//           <div className="text-center lg:text-left space-y-4">
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
//               Ready to take charge
//               <br className="hidden sm:block" />
//               of your{" "}
//               <em className="not-italic" style={{ color: "#90e0ef" }}>health?</em>
//             </h2>
//             <p className="text-base sm:text-lg font-medium" style={{ color: "rgba(255,255,255,.7)" }}>
//               Join millions who trust Pulse360 every day.
//             </p>
//           </div>
//           <motion.button
//             className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-full font-bold text-base"
//             style={{ background: "#fff", color: "#0096C7", boxShadow: "0 4px 20px rgba(0,0,0,.12)" }}
//             whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,.18)" }}
//             whileTap={{ scale: 0.97 }}
//             onClick={() => navigate("/signup")}
//           >
//             Get Started Now <ArrowRight />
//           </motion.button>
//         </motion.div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Home;

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
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
import Heart from "@/components/ui/3D/Heart";
import { fetchHomepageStats } from "@/api/user/userApis";

// -------------- Arrow ----------------------------------
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

// ---------------- Primary Button ----------------------
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

// --------------------- Feature badge (top bar) ---------------------
const FeatureBadge = ({ icon, value, label, delay = 0 }) => (
  <motion.div
    className="flex items-center gap-2 px-3 py-2 rounded-xl pointer-events-none select-none"
    style={{
      background: "rgba(0,150,199,0.12)",
      border: "1px solid rgba(0,150,199,0.28)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
    }}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <Icon icon={icon} className="text-base shrink-0" style={{ color: "#48cae4" }} />
    <div>
      <div className="text-[11px] font-bold text-white leading-none">{value}</div>
      <div className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,.4)" }}>
        {label}
      </div>
    </div>
  </motion.div>
);

// ------------------- Callout annotation -----------------------
const Callout = ({ side = "right", label, sub, delay = 0, color = "#48cae4" }) => {
  const isRight = side === "right";
  return (
    <motion.div
      className={`flex items-center gap-0 pointer-events-none select-none ${isRight ? "flex-row" : "flex-row-reverse"}`}
      initial={{ opacity: 0, x: isRight ? 16 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full shrink-0 z-10"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <div
        className="h-px shrink-0"
        style={{
          width: 32,
          background: `linear-gradient(${isRight ? "90deg" : "270deg"}, ${color}99, ${color}11)`,
        }}
      />
      <div className={`flex flex-col ${isRight ? "items-start pl-2" : "items-end pr-2"}`}>
        <span className="text-[9px] sm:text-[11px] font-bold leading-none tracking-wide" style={{ color }}>
          {label}
        </span>
        {sub && (
          <span
            className="text-[7px] sm:text-[9px] mt-0.5 font-medium tracking-wider uppercase"
            style={{ color: "rgba(255,255,255,.35)" }}
          >
            {sub}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// --------------- Scan ring ------------------------
const ScanRing = ({ delay = 0 }) => (
  <motion.div
    className="absolute inset-0 rounded-full pointer-events-none z-10"
    style={{ border: "1px solid rgba(0,150,199,0.2)" }}
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: [0, 0.55, 0], scale: [0.7, 1.35, 1.6] }}
    transition={{ duration: 2.8, delay, repeat: Infinity, ease: "easeOut" }}
  />
);

//-------------------- HOME -----------------------
const Home = () => {
  const [stats, setStats] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPhase, setScrollPhase] = useState("initial");
  const navigate = useNavigate();

  // -------------------- Refs ------------------------
  const heroRef = useRef(null);
  const isLockedRef = useRef(false);
  const progressRef = useRef(0);
  const touchStartRef = useRef(0);
  const rafRef = useRef(null);

  // -------------------- Mouse rotation -----------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // -------------- Scroll progress --------------------
  const progress = useMotionValue(0);
  const springProg = useSpring(progress, { stiffness: 60, damping: 22, mass: 1 });

  const overlayOpacity = useTransform(springProg, [0, 0.3], [1, 0]);

  // Text panel rises from below
  const textY = useTransform(springProg, [0, 1], ["100%", "0%"]);
  const textOpacity = useTransform(springProg, [0, 0.2], [0, 1]);

  // Heart reacts
  const heartScale = useTransform(springProg, [0, 1], [1.3, 1]);
  const heartDriftY = useTransform(springProg, [0, 1], ["0%", "-10%"]);
  const heartOpacity = useTransform(springProg, [0.25, 0.72], [1, 0.22]);
  const vignette = useTransform(springProg, [0, 0.5], [0, 0.95]);
  const hintOpacity = useTransform(springProg, [0, 0.08], [1, 0]);

  // ------------------------ Mouse handlers -----------------
  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // --------- Check if hero is pinned at viewport top --------------
  const isHeroAtTop = useCallback(() => {
    if (!heroRef.current) return false;
    const rect = heroRef.current.getBoundingClientRect();
    return rect.top > -10 && rect.top < 10;
  }, []);

  const isHeroVisible = useCallback(() => {
    if (!heroRef.current) return false;
    const rect = heroRef.current.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }, []);

  // ------ Lock scroll: keep hero pinned at top ---------------
  const lockScroll = useCallback(() => {
    if (!heroRef.current) return;
    const top = heroRef.current.offsetTop;
    window.scrollTo(0, top);
  }, []);

  // -------------- delta handler -----------------------
  const handleDelta = useCallback((rawDelta) => {
    if (!heroRef.current) return;

    const down = rawDelta > 0;
    const up = rawDelta < 0;
    const p = progressRef.current;
    const atTop = isHeroAtTop();
    const visible = isHeroVisible();

    if (!isLockedRef.current) {
      if (down && atTop && p < 0.99) {
        isLockedRef.current = true;
      } else if (up && visible && p >= 0.99 && atTop) {
        isLockedRef.current = true;
      } else {
        return;
      }
    }

    lockScroll();

    const step = 0.1;
    let next = p;

    if (down) {
      next = Math.min(p + step, 1);
    } else if (up) {
      next = Math.max(p - step, 0);
    }

    progress.set(next);
    progressRef.current = next;

    if (down && next >= 0.99) {
      progressRef.current = 1;
      progress.set(1);
      isLockedRef.current = false;
      setScrollPhase("done");
    } else if (up && next <= 0.01) {
      progressRef.current = 0;
      progress.set(0);
      isLockedRef.current = false;
      setScrollPhase("initial");
    } else {
      setScrollPhase("animating");
    }
  }, [progress, lockScroll, isHeroAtTop, isHeroVisible]);

  // ------------------ Wheel (desktop only) ------------------------
  useEffect(() => {
    // Only attach parallax scroll on non-touch / desktop
    if (window.matchMedia("(max-width: 639px)").matches) return;

    const onWheel = (e) => {
      if (!isHeroVisible()) return;
      if (isLockedRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
      handleDelta(e.deltaY);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [handleDelta, isHeroVisible]);

  // -------------------- Touch (desktop only) ---------------------
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) return;

    const onStart = (e) => {
      touchStartRef.current = e.touches[0].clientY;
    };
    const onMove = (e) => {
      if (!isHeroVisible()) return;
      const currentY = e.touches[0].clientY;
      const dy = touchStartRef.current - currentY;
      touchStartRef.current = currentY;
      if (isLockedRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
      handleDelta(dy * 2.2);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, [handleDelta, isHeroVisible]);

  // ------------------ Prevent scroll drift while locked ------------------
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) return;

    const onScroll = () => {
      if (isLockedRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(lockScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [lockScroll]);

  // ------------ Stats load ------------------
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
    let t0;
    const tick = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / 2000, 1);
      setStats(statsData.map((s) => Math.floor(s.value * p)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isVisible, statsData]);

  const fmt = (val = 0, i) => {
    const raw = statsData[i]?.value || 0;
    const v = val >= raw ? raw : val;
    if (raw >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M+";
    if (raw >= 1_000) return Math.floor(v / 1000) + "K+";
    return v + "+";
  };

  // ---------------- JSX ------------------
  return (
    <div className="min-h-screen bg-slate-50 font-[Georgia,serif] overflow-x-hidden">
      <GlobalStyles />

      {/* ==========================================================
          DESKTOP HERO (sm and above only — hidden on mobile)
      ========================================================== */}
      <div
        ref={heroRef}
        className="relative w-full overflow-hidden hidden sm:block"
        style={{ height: "100vh" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* ------------- BG gradient --------------------- */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)" }}
        />
        {/* --------------Grid texture --------------- */}
        <div
          className="absolute inset-0 opacity-[.032]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        {/* ----------- Ambient blobs --------------- */}
        <motion.div
          className="absolute -top-48 -right-32 w-[560px] h-[560px] lg:w-[720px] lg:h-[720px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,150,199,.28) 0%,transparent 70%)", filter: "blur(72px)" }}
          {...floatY(14, 7)}
        />
        <motion.div
          className="absolute -bottom-28 -left-24 w-[420px] h-[420px] lg:w-[520px] lg:h-[520px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,180,216,.16) 0%,transparent 70%)", filter: "blur(64px)" }}
          {...floatYReverse(14, 9)}
        />

        {/* Heart — desktop only */}
        <motion.div
          className="absolute left-1/2 pointer-events-none"
          style={{
            x: "-50%",
            top: "35%",
            width: "min(115vw, 900px)",
            aspectRatio: "1",
            scale: heartScale,
            y: heartDriftY,
            opacity: heartOpacity,
            transformOrigin: "center top",
          }}
        >
          <Heart mouseX={mouseX} mouseY={mouseY} />
        </motion.div>

        {/* ------------- Vignette grows with scroll --------------- */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,10,20,1) 0%, rgba(0,10,20,0.75) 28%, rgba(0,10,20,0.18) 55%, transparent 78%)",
            opacity: vignette,
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,10,20,0.6) 0%, transparent 100%)" }}
        />

        {/* Top edge fade */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(0,19,30,0.5) 0%, transparent 100%)" }}
        />

        {/* ----------------- OVERLAY ANNOTATIONS --------------------*/}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        >
          {/* ------------------ Row A ─ top bar ------------- */}
          <motion.div
            className="absolute flex items-center"
            style={{ top: "clamp(12px, 3.5vh, 28px)", left: "clamp(12px, 4%, 48px)" }}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] sm:text-[10px] font-bold tracking-[.14em] uppercase"
              style={{
                background: "rgba(0,150,199,.12)",
                borderColor: "rgba(0,150,199,.3)",
                color: "#48cae4",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#0096C7" }}
                {...pulseRing}
              />
              Pulse360
            </div>
          </motion.div>

          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3"
            style={{ top: "clamp(12px, 3.5vh, 28px)" }}
          >
            <FeatureBadge icon="mdi:wifi-check" value="99.9%" label="Uptime" delay={0.3} />
            <FeatureBadge icon="mdi:shield-lock-outline" value="256-bit" label="Encrypted" delay={0.45} />
            <FeatureBadge icon="mdi:clock-fast" value="< 2 min" label="Book Time" delay={0.6} />
          </div>

          <motion.div
            className="absolute flex items-center"
            style={{ top: "clamp(12px, 3.5vh, 28px)", right: "clamp(12px, 4%, 48px)" }}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase"
              style={{
                background: "rgba(0,150,199,.08)",
                border: "1px solid rgba(0,150,199,.2)",
                color: "rgba(255,255,255,.4)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0096C7" }} />
              <span className="hidden sm:inline">Platform</span> Live
            </div>
          </motion.div>

          <div
            className="absolute flex flex-col gap-3 sm:gap-5"
            style={{ top: "38%", left: "clamp(8px, 3%, 40px)" }}
          >
            <Callout side="left" label="Easy Booking" sub="2-tap scheduling" delay={0.5} />
            <Callout side="left" label="Secure Records" sub="End-to-end encrypted" delay={0.65} color="#90e0ef" />
            <Callout side="left" label="24/7 Support" sub="Always available" delay={0.8} color="#caf0f8" />
          </div>

          <div
            className="absolute flex flex-col gap-3 sm:gap-5 items-end"
            style={{ top: "38%", right: "clamp(8px, 3%, 40px)" }}
          >
            <Callout side="right" label="Smart Matching" sub="AI doctor pairing" delay={0.55} />
            <Callout side="right" label="Telemedicine" sub="Video consultations" delay={0.7} color="#90e0ef" />
            <Callout side="right" label="Fast Results" sub="< 2 min response" delay={0.85} color="#caf0f8" />
          </div>

          {/* Scan rings */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10"
            style={{ top: "18%", width: "min(160vw, 900px)" }}
          >
            <div className="relative w-full" style={{ paddingTop: "50%" }}>
              <div
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "40%",
                  aspectRatio: "1",
                }}
              >
                <ScanRing delay={0.2} />
                <ScanRing delay={1.2} />
                <ScanRing delay={2.2} />
              </div>
            </div>
          </div>

          {/* Hero headline (initial state) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 text-center w-full px-4"
            style={{ bottom: "35%" }}
          >
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                className="font-[Georgia] text-2xl sm:text-5xl md:text-6xl font-medium text-white leading-[1.08]"
                style={{ textShadow: "0 2px 40px rgba(0,0,0,0.75)" }}
              >
                Your health.{" "}
                <em className="not-italic" style={{ color: "#48cae4" }}>Our priority.</em>
              </h1>
              <p
                className="text-[11px] sm:text-sm font-medium tracking-wide"
                style={{ color: "rgba(255,255,255,.42)", textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
              >
                Modern healthcare, built around you
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* TEXT PANEL — springs up on scroll */}
        <motion.div
          className="absolute inset-x-0 bottom-0 z-20"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-8 sm:pb-14">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-16">

                {/* Left: headline + CTAs */}
                <div className="flex-1 max-w-2xl space-y-4 sm:space-y-6 text-center lg:text-left mx-auto lg:mx-0">
                  <div
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[10px] sm:text-[11px] font-bold tracking-[.12em] uppercase"
                    style={{
                      background: "rgba(0,150,199,.13)",
                      borderColor: "rgba(0,150,199,.32)",
                      color: "#48cae4",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#0096C7" }} />
                    Modern Healthcare Platform
                  </div>

                  <h1
                    className="font-[Georgia] text-2xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-medium text-white leading-[1.1]"
                    style={{ textShadow: "0 2px 32px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)" }}
                  >
                    Care that fits
                    <br className="hidden sm:block" />
                    your&nbsp;
                    <em className="not-italic" style={{ color: "#48cae4" }}>lifestyle</em>
                  </h1>

                  <p
                    className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0"
                    style={{ color: "rgba(255,255,255,.62)", textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}
                  >
                    {welcomeText}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
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
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.10)", color: "#fff", borderColor: "rgba(255,255,255,0.35)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/about-us")}
                    >
                      How it works
                    </motion.button>
                  </div>
                </div>

                {/* Right: stat pills */}
                {statsData.length > 0 && (
                  <div className="hidden lg:flex flex-col gap-3 shrink-0 mb-1">
                    {statsData.map((stat, i) => (
                      <div
                        key={stat.label}
                        className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
                        style={{
                          background: "rgba(0,150,199,0.09)",
                          borderColor: "rgba(0,150,199,0.22)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          minWidth: "180px",
                        }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "rgba(0,150,199,0.18)" }}
                        >
                          <Icon icon={stat.icon} className="text-lg text-[#48cae4]" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white leading-none">{fmt(stats[i], i)}</div>
                          <div
                            className="text-[9px] uppercase tracking-widest mt-0.5 font-semibold"
                            style={{ color: "rgba(255,255,255,.38)" }}
                          >
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Wave */}
            <svg
              viewBox="0 0 1440 56"
              preserveAspectRatio="none"
              className="w-full block"
              style={{ height: "clamp(24px, 4vw, 56px)", marginBottom: "-2px" }}
            >
              <path d="M0,56 C480,0 960,0 1440,56 L1440,56 L0,56 Z" fill="#f8fafc" />
            </svg>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 pointer-events-none"
          style={{ opacity: hintOpacity }}
        >
          <span
            className="text-[9px] font-bold tracking-[.2em] uppercase"
            style={{ color: "rgba(255,255,255,.38)" }}
          >
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4v12M5 11l5 5 5-5"
                stroke="rgba(255,255,255,.35)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
      {/* ========== END DESKTOP HERO ========== */}

      {/* ==========================================================
          MOBILE HERO BANNER (visible on mobile only, replaces full hero)
      ========================================================== */}
      <div
        className="block sm:hidden relative w-full overflow-hidden"
        style={{
          background: "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)",
          paddingTop: "80px",
          paddingBottom: "48px",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Ambient blob */}
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,150,199,.3) 0%,transparent 70%)", filter: "blur(48px)" }}
        />
        <div
          className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,180,216,.18) 0%,transparent 70%)", filter: "blur(40px)" }}
        />

        <div className="relative z-10 px-6 text-center">
          {/* Brand badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
            style={{
              background: "rgba(0,150,199,.12)",
              borderColor: "rgba(0,150,199,.3)",
              color: "#48cae4",
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#0096C7" }}
            />
            <span className="text-[10px] font-bold tracking-[.14em] uppercase">Pulse360</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-[Georgia] text-3xl font-medium text-white leading-[1.12] mb-4"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Care that fits your{" "}
            <em className="not-italic" style={{ color: "#48cae4" }}>lifestyle</em>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="text-sm leading-relaxed mb-8 mx-auto max-w-xs"
            style={{ color: "rgba(255,255,255,.58)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {welcomeText}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <PrimaryBtn onClick={() => navigate("/signin")}>
              Find your doctor <ArrowRight />
            </PrimaryBtn>
            <motion.button
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold border"
              style={{
                borderColor: "rgba(255,255,255,.2)",
                color: "rgba(255,255,255,.68)",
                background: "rgba(255,255,255,0.04)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/about-us")}
            >
              How it works
            </motion.button>
          </motion.div>

          {/* Mobile stats strip */}
          {statsData.length > 0 && stats.length === statsData.length && (
            <motion.div
              className="flex justify-center gap-8 mt-8 pt-6 border-t"
              style={{ borderColor: "rgba(255,255,255,.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {statsData.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-white">{fmt(stats[i], i)}</div>
                  <div
                    className="text-[9px] uppercase tracking-widest mt-0.5"
                    style={{ color: "rgba(255,255,255,.38)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Wave transition into light bg */}
        <svg
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 right-0 w-full block"
          style={{ height: "40px", marginBottom: "-1px" }}
        >
          <path d="M0,40 C480,0 960,0 1440,40 L1440,40 L0,40 Z" fill="#f8fafc" />
        </svg>
      </div>
      {/* ========== END MOBILE HERO BANNER ========== */}

      {/* ------------ Healthier Tomorrow ----------------*/}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16 sm:py-24">
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
      <section className="py-16 sm:py-24" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
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
      <section className="max-w-7xl mx-auto px-6 lg:px-16 py-16 sm:py-24">
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
      <section className="py-16 sm:py-24" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
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
      <section className="px-6 lg:px-16 py-16 sm:py-20">
        <motion.div
          className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[3rem] px-8 sm:px-16 py-12 sm:py-20 flex flex-col lg:flex-row items-center justify-between gap-10"
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