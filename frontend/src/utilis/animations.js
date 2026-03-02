// animations.js
// ─────────────────────────────────────────────────────────
// Shared Framer Motion variants & helpers for Pulse360.
// Import what you need in any page/component.
// ─────────────────────────────────────────────────────────

/* ── Fade up (general purpose staggered entrance) ── */
export const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ── Scale in (cards, modals, floating panels) ── */
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.93 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ── Fade in (no translation) ── */
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

/* ── Slide in from left ── */
export const slideInLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ── Slide in from right ── */
export const slideInRight = {
  hidden:  { opacity: 0, x: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

/* ── Stagger container (wraps a list of children) ──
   Usage:
     <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
       <motion.div variants={fadeUp} custom={0}>...</motion.div>
     </motion.div>
*/
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

/* ── Stagger child (use inside staggerContainer) ── */
export const staggerChild = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Floating / bobbing (infinite, for blobs or cards) ── */
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

/* ── Pulse ring (for live indicator dots) ── */
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

/* ── Hover lift (for cards) ── */
export const hoverLift = {
  whileHover: {
    y: -6,
    boxShadow: "0 18px 48px rgba(0,150,199,0.15)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

/* ── Hover lift subtle (lighter version) ── */
export const hoverLiftSubtle = {
  whileHover: {
    y: -3,
    boxShadow: "0 10px 32px rgba(0,150,199,0.1)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/* ── Button tap (press effect) ── */
export const tapScale = {
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

/* ── Top border reveal (for doc cards) ── */
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

/* ── Wave/section divider ── */
export const waveFadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, delay: 0.3 } },
};

/* ──────────────────────────────────────────────────────────
   VIEWPORT DEFAULTS
   Use these as the default `viewport` prop on whileInView
   so elements only animate once they enter the screen.
────────────────────────────────────────────────────────── */
export const viewportOnce     = { once: true, margin: "-60px" };
export const viewportOnceEarly = { once: true, margin: "0px" };