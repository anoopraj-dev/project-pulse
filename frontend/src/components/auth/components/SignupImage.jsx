

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import {
  fadeUp,
  fadeIn,
  staggerContainer,
  viewportOnce,
  waveFadeIn,
  simpleHover,
} from "@/utilis/animations";
import { useModal } from "@/contexts/ModalContext";
import { EmailModal } from "@/components/ui/modals/ModalInputs";
import { useNavigate } from "react-router-dom";

const SignupImage = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [sent, setSent] = useState(false);

  const handleVerifyEmail = () => {
    openModal(`Didn't verify your email?`, EmailModal, {
      endPoint: "/api/auth/resend-otp",
      type: "emailVerification",
      onSubmit: () => navigate("/verify-email"),
    });
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden font-[Georgia,serif]">
      {/* Background gradient */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-0 bg-[linear-gradient(140deg,#00131e_0%,#002e45_60%,#003f5c_100%)]"
      />

      {/* Grid */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-[1] bg-[length:52px_52px] 
        bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]"
      />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        viewport={viewportOnce}
        className="relative z-10 w-[300px]"
      >
        {/* Tag */}
        <motion.div
          variants={fadeUp}
          {...simpleHover}
          custom={0.4}
          className="flex items-center gap-[7px] mb-9"
        >
          <Icon
            icon="solar:stethoscope-linear"
            width="14"
            className="text-white/25"
          />

          <span className="text-[12px] tracking-[0.18em] uppercase text-white/20 font-sans">
            Pulse360
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          {...simpleHover}
          custom={0.5}
          className="text-[44px] font-normal text-white/90 leading-[1.3] mb-[14px] tracking-[-0.02em]"
        >
        The health club <br />
          <em className="text-white/35 italic">trusted by millions.</em>
        </motion.h2>

        {/* Body */}
        <motion.p
          variants={fadeUp}
          {...simpleHover}
          custom={0.6}
          className="text-[13px] leading-[1.8] text-white/30 mb-8 font-sans font-light"
        >
          Complete the basic signup
          <br />
          and take control of your health.
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={waveFadeIn}
          custom={0.7}
          className="h-[1px] bg-white/5 mb-[26px]"
        />

        {/* Button */}
        <motion.div variants={fadeUp} {...simpleHover} custom={0.4}>
          <motion.button
            whileHover={{ opacity: 0.85 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-[6px] text-[13px] text-white/80 tracking-[0.03em] underline underline-offset-4 cursor-pointer"
            onClick={handleVerifyEmail}
          >
            <Icon
              icon={
                sent ? "solar:check-circle-linear" : "solar:shield-check-linear"
              }
              width="14"
              className={
                sent ? "text-[rgba(100,220,180,0.8)]" : "text-white/40"
              }
            />

            <span className={sent ? "text-[rgba(100,220,180,0.9)]" : ""}>
              {sent ? "Email verified" : "Verify my email →"}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupImage;
