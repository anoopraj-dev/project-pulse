import React, { useEffect, useState } from "react";
import PrimaryButton from "../components/shared/components/PrimaryButton";
import { getApprovedDoctors } from "@/api/user/userApis";

/* ── Inject Google Font + custom keyframes ── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    .dl-root { font-family: 'DM Sans', sans-serif; }
    .dl-serif { font-family: 'Lora', Georgia, serif; }

    @keyframes dl-fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    @keyframes dl-scaleIn {
      from { opacity: 0; transform: scale(0.93); }
      to   { opacity: 1; transform: scale(1);    }
    }
    @keyframes dl-float {
      0%, 100% { transform: translateY(0px);   }
      50%       { transform: translateY(-12px); }
    }
    @keyframes dl-pulse-ring {
      0%   { box-shadow: 0 0 0 0    rgba(0,150,199,.5); }
      70%  { box-shadow: 0 0 0 14px rgba(0,150,199,0);  }
      100% { box-shadow: 0 0 0 0    rgba(0,150,199,0);  }
    }
    @keyframes dl-shimmer {
      from { background-position: -200% center; }
      to   { background-position:  200% center; }
    }

    .dl-anim-1 { animation: dl-fadeUp .7s cubic-bezier(.22,1,.36,1) .10s both; }
    .dl-anim-2 { animation: dl-fadeUp .7s cubic-bezier(.22,1,.36,1) .25s both; }
    .dl-anim-3 { animation: dl-fadeUp .7s cubic-bezier(.22,1,.36,1) .40s both; }
    .dl-anim-4 { animation: dl-fadeUp .7s cubic-bezier(.22,1,.36,1) .55s both; }
    .dl-anim-5 { animation: dl-fadeUp .7s cubic-bezier(.22,1,.36,1) .70s both; }
    .dl-card-in { animation: dl-scaleIn .7s cubic-bezier(.22,1,.36,1) .55s both; }

    .dl-float   { animation: dl-float 7s ease-in-out infinite; }
    .dl-float-r { animation: dl-float 9s ease-in-out infinite reverse; }
    .dl-pulse   { animation: dl-pulse-ring 2.2s infinite; }

    .dl-shimmer {
      background: linear-gradient(90deg,#ddf1f8 25%,#b8e4f3 50%,#ddf1f8 75%);
      background-size: 200% auto;
      animation: dl-shimmer 1.5s linear infinite;
    }

    .dl-lift { transition: transform .3s ease, box-shadow .3s ease; }
    .dl-lift:hover { transform: translateY(-6px); box-shadow: 0 18px 48px rgba(0,150,199,.14); }

    .dl-doc-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg,#0096C7,#00B4D8);
      transform: scaleX(0); transform-origin: left;
      transition: transform .35s ease;
      border-radius: 2px;
    }
    .dl-doc-card:hover::before { transform: scaleX(1); }

    .dl-offer-arrow { transition: transform .25s ease, background .25s, color .25s; }
    .dl-offer-card:hover .dl-offer-arrow { transform: translate(3px,-3px); }
  `}</style>
);

/* ── Icon helpers ── */
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

/* ═══════════════════════════════════════════════════════ */
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
    <div className="dl-root min-h-screen bg-slate-50">
      <GlobalStyles />

      {/* ══════════════════════
           HERO
      ══════════════════════ */}
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
        <div className="dl-float absolute -top-48 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,150,199,.3) 0%,transparent 70%)", filter: "blur(72px)" }} />
        <div className="dl-float-r absolute -bottom-28 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(0,180,216,.18) 0%,transparent 70%)", filter: "blur(64px)" }} />

        {/* inner */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-16 py-20 flex items-center justify-between gap-12">

          {/* ── Left copy ── */}
          <div className="flex-1 min-w-0 space-y-7">

            <div className="dl-anim-1 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-[11px] font-bold tracking-[.12em] uppercase"
              style={{ background: "rgba(0,150,199,.12)", borderColor: "rgba(0,150,199,.3)", color: "#48cae4" }}>
              <span className="dl-pulse w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#0096C7" }} />
              Trusted by 50,000+ patients
            </div>

            <h1 className="dl-serif dl-anim-2 text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-white leading-[1.07]">
              Healthcare<br />
              at your&nbsp;
              <em className="not-italic" style={{ color: "#48cae4" }}>fingertips</em>
            </h1>

            <p className="dl-anim-3 text-[1.05rem] leading-relaxed max-w-[480px]" style={{ color: "rgba(255,255,255,.55)" }}>
              Consult online or book appointments with trusted, verified doctors — instantly, from anywhere.
            </p>

            <div className="dl-anim-4 flex flex-wrap gap-3">
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-200"
                style={{ background: "#0096C7", boxShadow: "0 6px 28px rgba(0,150,199,.45)" }}
                onMouseEnter={e => e.currentTarget.style.background = "#007aa3"}
                onMouseLeave={e => e.currentTarget.style.background = "#0096C7"}
              >
                Find your doctor <ArrowRight />
              </button>
              <button
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{ border: "1.5px solid rgba(255,255,255,.18)", color: "rgba(255,255,255,.65)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.65)"; }}
              >
                How it works
              </button>
            </div>

            {/* stats */}
            <div className="dl-anim-5 flex gap-10 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,.1)" }}>
              {[["1,200+", "Verified Doctors"], ["4.9 ★", "Avg. Rating"], ["15 min", "Avg. Wait"]].map(([v, l]) => (
                <div key={l}>
                  <div className="dl-serif text-2xl font-bold text-white">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,.38)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right floating card ── */}
          <div className="hidden lg:block shrink-0 dl-card-in">
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

              <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
                style={{ background: "#0096C7" }}
                onMouseEnter={e => e.currentTarget.style.background="#007aa3"}
                onMouseLeave={e => e.currentTarget.style.background="#0096C7"}>
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width:"100%", height:60 }}>
            <path d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>


      {/* ══════════════════════
           WHAT WE OFFER
      ══════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="mb-10 space-y-2">
          <p className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>What we offer</p>
          <h2 className="dl-serif text-3xl md:text-4xl font-bold text-slate-900">
            Care that fits your <em className="not-italic" style={{ color: "#0096C7" }}>lifestyle</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon:"📞", title:"Instant Voice Consultation",  desc:"Talk to verified doctors in real-time through secure, high-quality voice calls.", featured:true },
            { icon:"🏥", title:"Offline Visit Bookings",      desc:"Find specialists nearby and book in-person consultations with ease." },
            { icon:"💊", title:"Digital Prescriptions",       desc:"Receive e-prescriptions instantly after your consultation." },
            { icon:"📋", title:"Health Records",              desc:"Store and share your medical history securely with any doctor." },
          ].map(c => <OfferCard key={c.title} {...c} />)}
        </div>
      </section>


      {/* ══════════════════════
           FIND A DOCTOR
      ══════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>Our specialists</p>
            <h2 className="dl-serif text-3xl md:text-4xl font-bold text-slate-900">
              Find a <em className="not-italic" style={{ color: "#0096C7" }}>Doctor</em>
            </h2>
          </div>

          <button
            className="px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all duration-200"
            style={{ borderColor: "#0096C7", color: "#0096C7" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#0096C7"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0096C7"; }}
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="dl-shimmer rounded-2xl h-60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {doctors.slice(0, 8).map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
          </div>
        )}
      </section>


      {/* ══════════════════════
           TESTIMONIALS
      ══════════════════════ */}
      <section className="py-20" style={{ background: "linear-gradient(180deg,#f0f9ff,#e0f2fe)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="mb-10 space-y-2">
            <p className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#0096C7" }}>Patient stories</p>
            <h2 className="dl-serif text-3xl md:text-4xl font-bold text-slate-900">
              What people <em className="not-italic" style={{ color: "#0096C7" }}>say</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Testimonial name="Hari Narayanan"   rating={4.8} text="The consultation was smooth and reassuring. Got answers in minutes and felt genuinely heard. Great experience." />
            <Testimonial name="Ajith Sudharsnan" rating={4.8} text="Quick diagnosis and friendly doctor. Took time to explain everything clearly. Highly recommended to all." />
            <Testimonial name="Anoop Raj"         rating={4.8} text="Very professional and helpful. Clear, actionable guidance without the usual long wait times. Will use again." />
          </div>
        </div>
      </section>


      {/* ══════════════════════
           FOOTER CTA
      ══════════════════════ */}
      <section className="px-6 lg:px-10 py-14">
        <div
          className="max-w-6xl mx-auto rounded-3xl px-10 py-12 flex flex-wrap items-center justify-between gap-8"
          style={{
            background: "linear-gradient(135deg,#003554 0%,#006494 50%,#0096C7 100%)",
            boxShadow: "0 20px 60px rgba(0,150,199,.28)",
          }}
        >
          <div>
            <h2 className="dl-serif text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to take charge<br />
              of your <em className="not-italic" style={{ color: "#90e0ef" }}>health?</em>
            </h2>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,.5)" }}>Join thousands who trust us every day.</p>
          </div>
          <button
            className="flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm transition-all duration-200"
            style={{ background: "#fff", color: "#0096C7", boxShadow: "0 4px 20px rgba(0,0,0,.12)" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Get Started Now <ArrowRight />
          </button>
        </div>
      </section>

    </div>
  );
};


/* ─────────────────────────────
   SUB-COMPONENTS
───────────────────────────── */
const OfferCard = ({ icon, title, desc, featured }) => (
  <div
    className={`dl-offer-card dl-lift relative rounded-2xl p-6 flex flex-col gap-4 cursor-pointer border overflow-hidden`}
    style={featured
      ? { background: "linear-gradient(150deg,#003554,#0077a8)", borderColor: "transparent" }
      : { background: "#fff", borderColor: "#e2f4f9" }}
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
      style={{ background: featured ? "rgba(255,255,255,.15)" : "#ddf1f8" }}>
      {icon}
    </div>
    <div className="flex-1 space-y-1.5">
      <h3 className={`font-bold text-[1rem] ${featured ? "text-white" : "text-slate-900"}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${featured ? "text-white/55" : "text-slate-500"}`}>{desc}</p>
    </div>
    <div
      className="dl-offer-arrow self-end w-8 h-8 rounded-full flex items-center justify-center"
      style={featured
        ? { background: "rgba(255,255,255,.15)", color: "#fff" }
        : { background: "#ddf1f8", color: "#0096C7" }}
    >
      <ArrowRight size={14} />
    </div>
  </div>
);

const DoctorCard = ({ doctor }) => (
  <div className="dl-doc-card dl-lift relative bg-white rounded-2xl p-5 text-center border border-slate-100 cursor-pointer overflow-hidden">
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

    <button
      className="w-full py-2 rounded-xl text-xs font-bold transition-all duration-200"
      style={{ background: "#ddf1f8", color: "#0096C7" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#0096C7"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#ddf1f8"; e.currentTarget.style.color = "#0096C7"; }}
    >
      Book Now
    </button>
  </div>
);

const Testimonial = ({ name, rating, text }) => (
  <div className="dl-lift bg-white rounded-2xl p-6 border border-slate-100 space-y-4">
    <div className="dl-serif text-5xl leading-none font-bold" style={{ color: "#0096C7" }}>"</div>
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
  </div>
);

export default DoctorLanding;