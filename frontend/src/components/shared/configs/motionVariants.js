export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export const floatUpDown = () => ({
  animate: {
    y: ["0px", "-12px", "0px"],
    transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
  },
});

export const floatDownUp = () => ({
  animate: {
    y: ["0px", "12px", "0px"],
    transition: { duration: 9, repeat: Infinity, ease: "easeInOut" },
  },
});

export const pulseRing = {
  animate: {
    boxShadow: ["0 0 0 0 rgba(0,150,199,0.5)", "0 0 0 14px rgba(0,150,199,0)", "0 0 0 0 rgba(0,150,199,0)"],
    transition: { duration: 2.2, repeat: Infinity },
  },
};
