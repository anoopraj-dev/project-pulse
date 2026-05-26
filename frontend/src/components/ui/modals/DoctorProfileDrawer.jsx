import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

const DoctorProfileDrawer = ({ isOpen, onClose, doctor }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Sliding Panel Container */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="pointer-events-auto w-screen max-w-md md:max-w-lg bg-slate-50 shadow-2xl flex flex-col h-full border-l border-slate-100 overflow-hidden"
          >
            {/* Header: Visual Profile Cover */}
            <div className="relative overflow-hidden bg-[#0096C7] px-6 pt-10 pb-8 text-white">
              {/* Decorative light blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute top-1/2 -left-12 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/85 hover:text-white hover:scale-105 transition-all p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15"
              >
                <Icon icon="mingcute:close-line" className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                {/* Profile Image with status ring */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-md">
                    {doctor.profileImage ? (
                      <img
                        src={doctor.profileImage}
                        alt={doctor.doctorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-50 flex items-center justify-center text-[#0096C7] font-bold text-2xl">
                        {doctor.doctorName?.split(" ").map((n) => n[0]).join("") || "DR"}
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#0096C7]">
                    <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                {/* Info block */}
                <div className="text-center sm:text-left space-y-1.5 flex-1">
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                      Verified Practitioner
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-[Georgia,serif] text-white tracking-tight">
                    {doctor.doctorName}
                  </h2>
                  <p className="text-sm text-sky-100 font-medium">
                    {doctor.specialty || "General Practitioner"}
                  </p>
                  
                  {/* Rating Block */}
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-300 text-sm font-semibold pt-0.5">
                    <Icon icon="mdi:star" className="text-base text-amber-400" />
                    <span>{doctor.rating || "4.8"}</span>
                    <span className="text-white/70 text-xs font-normal">/ 5.0 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Fee Cards Container */}
              {doctor.services && doctor.services.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {doctor.services.map((srv, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-col items-center justify-center text-center transition-all hover:shadow-sm"
                    >
                      <div className="p-2 rounded-xl bg-sky-50 text-[#0096C7] mb-2">
                        <Icon 
                          icon={srv.serviceType?.toLowerCase().includes("online") ? "fluent:video-24-regular" : "fluent:building-shop-24-regular"} 
                          className="w-5 h-5" 
                        />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {srv.serviceType} Consult
                      </span>
                      <p className="text-lg font-bold text-[#0096C7] mt-1">
                        ₹{srv.fees}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Biography / About Section */}
              {doctor.about && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Icon icon="lucide:user" className="text-[#0096C7] text-base" />
                    About Doctor
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {doctor.about}
                  </p>
                </div>
              )}

              {/* Specializations & Skills */}
              {doctor.specializations && doctor.specializations.length > 0 && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Icon icon="lucide:award" className="text-[#0096C7] text-base" />
                    Areas of Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.specializations.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl text-xs font-medium bg-sky-50 text-[#0096C7] border border-sky-100/30 hover:scale-[1.02] transition-transform"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {doctor.experience && doctor.experience.length > 0 && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Icon icon="lucide:briefcase" className="text-[#0096C7] text-base" />
                    Experience Timeline
                  </h3>
                  <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-5">
                    {doctor.experience.map((exp, i) => (
                      <div key={i} className="relative">
                        {/* Bullet tracker */}
                        <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#0096C7] ring-4 ring-white" />
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {exp.hospitalName}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {exp.location} • <span className="font-semibold text-[#0096C7]">{exp.years} Years</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {doctor.education && doctor.education.length > 0 && (
                <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Icon icon="lucide:graduation-cap" className="text-[#0096C7] text-base" />
                    Education & Training
                  </h3>
                  <div className="relative border-l border-slate-100 pl-4 ml-2 space-y-5">
                    {doctor.education.map((edu, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[21px] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white" />
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {edu.degree}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            {edu.college} • Class of {edu.completionYear}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Registry Details */}
              <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Icon icon="lucide:info" className="text-[#0096C7] text-base" />
                  Credentials & Details
                </h3>
                <div className="space-y-2.5 text-xs text-slate-500">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="font-medium text-slate-400">Medical Council Registry</span>
                    <span className="font-semibold text-slate-700">Verified Active</span>
                  </div>
                  {doctor.location && (
                    <div className="flex justify-between items-center py-1 border-b border-slate-50">
                      <span className="font-medium text-slate-400">Practice Location</span>
                      <span className="font-semibold text-slate-700">{doctor.location}</span>
                    </div>
                  )}
                  {doctor.gender && (
                    <div className="flex justify-between items-center py-1">
                      <span className="font-medium text-slate-400">Gender</span>
                      <span className="font-semibold text-slate-700 capitalize">{doctor.gender}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer: Floating action bar */}
            <div className="border-t border-slate-100 p-4 bg-white shadow-lg flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#0096C7] text-white hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Icon icon="lucide:check-circle" />
                Done Viewing Profile
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileDrawer;
