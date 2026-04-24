

//------------ Shared Framer Motion variants & helpers ----------------



//------------- Fade up --------------
export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

//-------------- Scale in -----------------
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

//-------------- Fade in ------------------
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

//---------------- Slide in left -----------------
export const slideInLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

//-------- Slide in from right ------------
export const slideInRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

//------------- Stagger Container ------------------
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

//------------------- Stagger Child ------------
export const staggerChild = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

//------------- Floating -----------------
export const floatY = (yRange = 12, duration = 7) => ({
  animate: {
    y: [0, -yRange, 0],
    transition: { duration, ease: "easeInOut", repeat: Infinity },
  },
});

export const floatYReverse = (yRange = 12, duration = 9) => ({
  animate: {
    y: [0, yRange, 0],
    transition: { duration, ease: "easeInOut", repeat: Infinity },
  },
});

//--------------- Pulse ring animation -------------
export const pulseRing = {
  animate: {
    boxShadow: [
      "0 0 0 0px rgba(0,150,199,0.5)",
      "0 0 0 10px rgba(0,150,199,0)",
      "0 0 0 0px rgba(0,150,199,0)",
    ],
    transition: { duration: 2.2, repeat: Infinity, ease: "easeOut" },
  },
};

//-------------- Hover Lift -------------------
export const hoverLift = {
  whileHover: {
    y: -6,
    boxShadow: "0 18px 48px rgba(0,150,199,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

//-------------- Hover Lift -------------------
export const simpleHover = {
  whileHover: {
    y: -6,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

//--------------- Hover lift lighter version -----------------
export const hoverLiftSubtle = {
  whileHover: {
    y: -3,
    boxShadow: "0 10px 32px rgba(0,150,199,0.1)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

//-------------------- Button Click -----------------
export const tapScale = {
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

//---------------- Border reveal top ----------- (selection)
export const borderReveal = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, originX: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* ── Counter number (for stat animation) ── */
export const counterVariant = {
  hidden:  { opacity: 0, y: 10 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay },
  }),
};

//------------- Section divider --------------
export const waveFadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } },
};

export const slideLeft = {
  hidden: { x: "-100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" }
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.4 }
  }
};

export const slideRight = {
  hidden: { x: "100%", opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut" }
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.4 }
  }
};


export const viewportOnce     = { once: true, margin: "-60px" };
export const viewportOnceEarly = { once: true, margin: "0px" };