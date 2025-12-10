// src/DoctorLanding.jsx
import React from "react";

const doctors = Array.from({ length: 8 });

const DoctorLanding = () => {
  return (
    <div className="min-h-screen bg-[#f7fcfd] py-10">
      
      {/* Container (80% width) */}
      <div className="max-w-[80%] mx-auto space-y-16">

        {/* --- HERO SECTION (Modern Minimal) --- */}
        <section className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Healthcare at Your Fingertips
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            Consult online or book appointments with trusted doctors instantly.
          </p>
        </section>
<section className="space-y-6">
  <h2 className="text-xl font-bold text-slate-800">What We Offer</h2>

  <div className="space-y-10">

    {/* Feature 1 */}
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

    {/* Feature 2 */}
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
            <button className="text-sm px-4 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
              View All
            </button>
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

/* ------------------ OFFER CARD (New Lightweight Style) ------------------ */

const OfferCard = ({ title, img, desc }) => (
  <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition">
    <div
      className="w-24 h-24 rounded-xl bg-cover bg-center"
      style={{ backgroundImage: `url(${img})` }}
    />
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="text-xs mt-1 text-slate-600 leading-normal">{desc}</p>
    </div>
  </div>
);

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
