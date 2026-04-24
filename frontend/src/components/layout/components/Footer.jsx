
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const ArrowRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Footer = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }),
  };

  const links = {
    Company: ["About Us", "Careers", "Press", "Blog"],
    Services: ["Voice Consultation", "Offline Visits", "Digital Prescription", "Health Records"],
    Support: ["FAQ", "Contact", "Privacy Policy", "Terms of Service"],
  };

  const socials = [
    { icon: "mdi:facebook", label: "Facebook" },
    { icon: "mdi:twitter", label: "Twitter" },
    { icon: "mdi:instagram", label: "Instagram" },
    { icon: "mdi:linkedin", label: "LinkedIn" },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(140deg,#00131e 0%,#002e45 60%,#003f5c 100%)" }}>

      {/* Glow blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,150,199,.18) 0%,transparent 70%)", filter: "blur(72px)" }} />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,180,216,.1) 0%,transparent 70%)", filter: "blur(64px)" }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }} />

      {/* Wave top */}
      <div className="relative overflow-hidden leading-[0]">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ width: "100%", height: 48, display: "block" }}>
          <path d="M0,0 C480,48 960,48 1440,0 L1440,0 L0,0 Z" fill="#f8fafc" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 pt-12 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12"
          style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>

          {/* Brand column — spans 2 cols */}
          <motion.div
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible"
            viewport={{ once: true }} className="lg:col-span-2 space-y-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#0096C7,#00B4D8)" }}>
                <Icon icon="mdi:pulse" className="text-white text-lg" />
              </div>
              <span className="font-[Georgia,serif] text-xl font-bold text-white tracking-tight">Pulse360</span>
            </div>

            <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: "rgba(255,255,255,.45)" }}>
              A smarter way to manage your healthcare. Book appointments, access records, and connect with doctors — anytime, anywhere.
            </p>

            {/* Stats mini-strip */}
            <div className="flex gap-6">
              {[["50k+", "Patients"], ["1.2k+", "Doctors"], ["4.9★", "Rating"]].map(([v, l]) => (
                <div key={l}>
                  <div className="font-[Georgia,serif] text-base font-bold text-white">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.3)" }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-2 pt-1">
              {socials.map(({ icon, label }) => (
                <motion.a
                  key={label} href="#" aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.55)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,150,199,.25)"; e.currentTarget.style.color = "#48cae4"; e.currentTarget.style.borderColor = "rgba(0,150,199,.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.55)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; }}
                >
                  <Icon icon={icon} className="text-base" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items], gi) => (
            <motion.div
              key={heading}
              variants={fadeUp} custom={0.1 * (gi + 1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="text-[11px] font-bold tracking-[.14em] uppercase" style={{ color: "#48cae4" }}>{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <motion.a
                      href="#"
                      className="flex items-center gap-1.5 text-sm transition-all duration-200 group"
                      style={{ color: "rgba(255,255,255,.45)" }}
                      whileHover={{ x: 4 }}
                      onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.45)"}
                    >
                      <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-200 opacity-0 group-hover:opacity-100" style={{ color: "#0096C7" }}>
                        <ArrowRight size={10} />
                      </span>
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter strip */}
        <motion.div
          variants={fadeUp} custom={0.3} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="py-8 flex flex-wrap items-center justify-between gap-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}
        >
          <div>
            <p className="text-white font-semibold text-sm">Stay in the loop</p>
            <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,.38)" }}>Health tips and updates, no spam.</p>
          </div>
          <div className="flex items-center gap-0 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)" }}>
            <input
              type="email" placeholder="your@email.com"
              className="bg-transparent px-5 py-2.5 text-sm outline-none w-52 placeholder:text-white/30 text-white"
            />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white transition-all duration-200"
              style={{ background: "#0096C7" }}
              onMouseEnter={e => e.currentTarget.style.background = "#007aa3"}
              onMouseLeave={e => e.currentTarget.style.background = "#0096C7"}
            >
              Subscribe <ArrowRight size={12} />
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeUp} custom={0.4} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="pt-6 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,.28)" }}>
            © {new Date().getFullYear()} Pulse360. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#10b981" }} />
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,.3)" }}>All systems operational</span>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map(t => (
              <a key={t} href="#" className="text-[11px] transition-colors duration-150"
                style={{ color: "rgba(255,255,255,.28)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#48cae4"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.28)"}
              >{t}</a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;