

// ---------------- SHARED FRAMER MOTION VARIANTS & HELPERS ----------------



// ---------------- FADE UP ----------------
export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

// ---------------- SCALE IN ----------------
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

// ---------------- FADE IN ----------------
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

// ---------------- SLIDE IN LEFT ----------------
export const slideInLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

// ---------------- SLIDE IN FROM RIGHT ----------------
export const slideInRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

// ---------------- STAGGER CONTAINER ----------------
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// ---------------- STAGGER CHILD ----------------
export const staggerChild = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// ---------------- FLOATING ----------------
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

// ---------------- PULSE RING ANIMATION ----------------
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

// ---------------- HOVER LIFT ----------------
export const hoverLift = {
  whileHover: {
    y: -6,
    boxShadow: "0 18px 48px rgba(0,150,199,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ---------------- HOVER LIFT ----------------
export const simpleHover = {
  whileHover: {
    y: -6,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// ---------------- HOVER LIFT LIGHTER VERSION ----------------
export const hoverLiftSubtle = {
  whileHover: {
    y: -3,
    boxShadow: "0 10px 32px rgba(0,150,199,0.1)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// ---------------- BUTTON CLICK ----------------
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

// ---------------- SECTION DIVIDER ----------------
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