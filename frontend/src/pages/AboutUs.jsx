import React from "react";
import PrimaryButton from "../components/shared/components/PrimaryButton";

const doctors = Array.from({ length: 8 });

const DoctorLanding = () => {
  return (
    <div className="min-h-screen bg-[#f7fcfd]">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[70vh] md:h-[80vh] w-full mt-20">
        <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl mx-4 md:mx-10 lg:mx-20">
          <img
            src="/medical-banner.jpg"
            alt="Healthcare hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-2xl space-y-6 px-6 lg:px-12 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Healthcare at Your Fingertips
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                Consult online or book appointments with trusted doctors instantly.
              </p>
              <PrimaryButton
                  text="Find your doctor now"
                  className="w-full sm:w-auto"
                />
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-[80%] mx-auto space-y-16 py-10">

        {/* --- What We Offer --- */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">What We Offer</h2>

          <div className="space-y-10">

            <div className="flex items-start gap-5">
              <div
                className="w-20 h-20 rounded-2xl bg-cover bg-center shrink-0"
                style={{ backgroundImage: "url('/images/doctor-call.jpg')" }}
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  Instant Voice Consultation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Talk to verified doctors instantly through secure, high-quality voice calls.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div
                className="w-20 h-20 rounded-2xl bg-cover bg-center shrink-0"
                style={{ backgroundImage: "url('/images/doctor-hand.jpg')" }}
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  Offline Visit Bookings
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Find specialists nearby and book in-person consultations with ease.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --- FIND A DOCTOR --- */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Find a Doctor</h2>
            <PrimaryButton
                              text="View all"
                              className="w-full sm:w-auto"
                            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {doctors.map((_, i) => (
              <DoctorCard key={i} />
            ))}
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Testimonials</h2>

          <div className="space-y-4">
            <Testimonial
              name="Hari Narayanan"
              rating="4.8"
              text="The consultation was smooth and reassuring. Great experience."
            />
            <Testimonial
              name="Ajith Sudharsnan"
              rating="4.8"
              text="Quick diagnosis and friendly behaviour. Highly recommended."
            />
            <Testimonial
              name="Anoop Raj"
              rating="4.8"
              text="Very professional and helpful. Gave clear guidance."
            />
          </div>
        </section>

      </div>
    </div>
  );
};

/* ------------------ DOCTOR CARD ------------------ */
const DoctorCard = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition text-center">
    <div
      className="w-20 h-24 rounded-lg mx-auto bg-cover bg-center mb-3"
      style={{ backgroundImage: "url('/images/doctor-avatar.jpg')" }}
    />
    <span className="text-[11px] text-emerald-600 font-medium">Ayurveda</span>
    <h4 className="text-sm font-semibold">Dr. Richard James</h4>
    <p className="text-[11px] text-slate-500">General Physician</p>
  </div>
);

/* ------------------ TESTIMONIAL ------------------ */
const Testimonial = ({ name, rating, text }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3">
    <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold">
      {name.charAt(0)}
    </div>
    <div className="flex-1">
      <div className="flex justify-between text-sm">
        <span className="font-semibold">{name}</span>
        <span className="text-amber-500">{rating} ★</span>
      </div>
      <p className="text-xs text-slate-600 mt-1">{text}</p>
    </div>
  </div>
);

export default DoctorLanding;
