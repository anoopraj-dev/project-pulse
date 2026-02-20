import { motion, animate, useMotionValue } from "framer-motion";
import { useEffect } from "react";

const doctors = [
  {
    name: "Reena Nair",
    spec: "Cardiologist",
    rating: "4.9",
    patients: "3.2K+",
    initials: "RN",
    color: "linear-gradient(135deg,#0096C7,#00B4D8)",
    badge: "#0096C7",
  },
  {
    name: "Arjun Menon",
    spec: "Neurologist",
    rating: "4.8",
    patients: "2.8K+",
    initials: "AM",
    color: "linear-gradient(135deg,#0077a8,#0096C7)",
    badge: "#0077a8",
  },
  {
    name: "Priya Suresh",
    spec: "Pediatrician",
    rating: "4.9",
    patients: "4.1K+",
    initials: "PS",
    color: "linear-gradient(135deg,#005f87,#0077a8)",
    badge: "#005f87",
  },
];

const CARD_W = 220;

// Start: each card falls from high up with its own steep chaotic tilt
const startPos = [
  { x: -30, y: -680, rotate: -30 }, // bottom card — hard left lean
  { x:  18, y: -680, rotate:  24 }, // middle — hard right lean
  { x:  -8, y: -680, rotate: -20 }, // top card — moderate left
];

// Stack: base ~45°, individual micro-offsets give physical imperfection
const BASE = 45; // overall stack landing angle
const stackPos = [
  { x: 18,  y: 28, rotate: BASE + 4,  zIndex: 1 }, // bottom — slightly more angled
  { x:  7,  y: 11, rotate: BASE + 1,  zIndex: 2 }, // middle
  { x:  0,  y:  0, rotate: BASE - 2,  zIndex: 3 }, // top — reference, least offset
];

const FALL_DUR  = 0.65;
const BOUNCE    = [0.22, 1.18, 0.36, 1];
const GAP_MS    = 290;
const HOLD_MS   = 2600;
const RESET_DUR = 0.3;
const RESET_GAP = 65;
const SNAP      = [0.55, 0, 1, 1];

/* ═══════════════════════════════════════════════════════ */
const DoctorFanCards = () => {
  const vals = doctors.map((_, i) => ({
    x:       useMotionValue(startPos[i].x),
    y:       useMotionValue(startPos[i].y),
    rotate:  useMotionValue(startPos[i].rotate),
    opacity: useMotionValue(0),
  }));

  useEffect(() => {
    let cancelled = false;

    const fallCard = (i) => {
      vals[i].x.set(startPos[i].x);
      vals[i].y.set(startPos[i].y);
      vals[i].rotate.set(startPos[i].rotate);
      vals[i].opacity.set(0);

      animate(vals[i].opacity, 1,                 { duration: 0.14 });
      animate(vals[i].x,      stackPos[i].x,      { duration: FALL_DUR, ease: BOUNCE });
      animate(vals[i].y,      stackPos[i].y,      { duration: FALL_DUR, ease: BOUNCE });
      animate(vals[i].rotate, stackPos[i].rotate, { duration: FALL_DUR, ease: BOUNCE });
    };

    const resetCard = (i) => {
      animate(vals[i].opacity, 0,                  { duration: 0.15, ease: "easeIn" });
      animate(vals[i].y,       startPos[i].y,      { duration: RESET_DUR, ease: SNAP });
      animate(vals[i].x,       startPos[i].x,      { duration: RESET_DUR, ease: SNAP });
      animate(vals[i].rotate,  startPos[i].rotate, { duration: RESET_DUR, ease: SNAP });
    };

    const loop = async () => {
      while (!cancelled) {
        for (let i = 0; i < doctors.length; i++) {
          if (cancelled) return;
          fallCard(i);
          await new Promise(r => setTimeout(r, GAP_MS));
        }
        await new Promise(r => setTimeout(r, FALL_DUR * 1000 + HOLD_MS));
        if (cancelled) break;
        for (let i = doctors.length - 1; i >= 0; i--) {
          if (cancelled) return;
          resetCard(i);
          await new Promise(r => setTimeout(r, RESET_GAP));
        }
        await new Promise(r => setTimeout(r, RESET_DUR * 1000 + 130));
        if (cancelled) break;
      }
    };

    loop();
    return () => { cancelled = true; };
  }, []);

  return (
    /*
      Container is wide + tall enough to hold the 45° rotated stack.
      A 220×260 card rotated 45° needs ~(220+260)/√2 ≈ 340px in each axis.
      We keep the container generous so nothing clips.
    */
    <div
      className="relative overflow-hidden"
      style={{ width: 440, height: 440 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={doctors[i].name}
          style={{
            position: "absolute",
            top: 33,
            left: 2,
            bottom:0,
            width: CARD_W,
            x: vals[i].x,
            y: vals[i].y,
            rotate: vals[i].rotate,
            opacity: vals[i].opacity,
            zIndex: stackPos[i].zIndex,
          }}
        >
          <DoctorCard doc={doctors[i]} />
        </motion.div>
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────────
   Frosted glass card with readable dark text
────────────────────────────────────────────── */
const DoctorCard = ({ doc }) => (
  <div
    className="rounded-2xl overflow-hidden select-none"
    style={{
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(32px)",
      WebkitBackdropFilter: "blur(32px) saturate(160%)",
      border: "1px solid rgba(255,255,255,0.75)",
      boxShadow:
        "0 8px 32px rgba(0,100,160,0.3), 0 1.5px 6px rgba(0,150,199,0.25), inset 0 1px 0 rgba(255,255,255,0.9)",
    }}
  >
    {/* colour accent strip */}
    <div className="h-1.5 w-full" style={{ background: doc.color }} />

    <div className="p-4 space-y-3">

      {/* Avatar + info */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
          style={{ background: doc.color }}
        >
          {doc.initials}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm text-slate-900 leading-tight truncate">
            Dr. {doc.name}
          </div>
          <div className="text-[11px] mt-0.5 font-medium text-slate-600">
            {doc.spec}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full inline-block bg-emerald-500" />
          <span className="text-[10px] font-bold text-emerald-600">Online</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {[["⭐ " + doc.rating, "Rating"], [doc.patients, "Patients"]].map(([v, l]) => (
          <div
            key={l}
            className="rounded-xl p-2.5 text-center"
            style={{
              background: "rgba(0,150,199,0.08)",
              border: "1px solid rgba(0,150,199,0.12)",
            }}
          >
            <div className="font-bold text-sm text-slate-800">{v}</div>
            <div className="text-[10px] mt-0.5 font-medium text-slate-500">{l}</div>
          </div>
        ))}
      </div>

      {/* Specialization badge */}
      <div className="flex justify-center">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{
            background: "rgba(0,150,199,0.12)",
            color: doc.badge,
            border: `1px solid rgba(0,150,199,0.2)`,
          }}
        >
          {doc.spec}
        </span>
      </div>

      {/* Book button */}
      <button
        className="w-full py-2 rounded-xl text-xs font-bold text-white shadow-md"
        style={{
          background: doc.color,
          boxShadow: "0 4px 12px rgba(0,150,199,0.35)",
        }}
      >
        Book Now
      </button>
    </div>
  </div>
);

export default DoctorFanCards;