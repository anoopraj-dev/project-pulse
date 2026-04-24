

import React from "react";

const PatientPanel = React.memo(
  ({
    showPatientPanel,
    setShowPatientPanel,
    activeTab,
    setActiveTab,
    patientName,
    reason,
    appointmentInfo,
    form,
    setForm,
    handleSubmitPrescription,
    patientData,
    addMedicine,
    removeMedicine,
    updateMedicine,
  }) => {
    
    const consultation = patientData?.consultation?.consultation;
    const patient = consultation?.patient;
    const appointment = consultation?.appointment;

    const prescriptions = patientData?.consultation?.prescriptions || [];
    const pastConsultations = patientData?.consultation?.pastConsultations || [];

    return (
      <>
        {/* ---- Backdrop overlay (mobile only) ---- */}
        {showPatientPanel && (
          <div
            className="fixed inset-0 bg-black/60 z-10 lg:hidden backdrop-blur-sm"
            onClick={() => setShowPatientPanel(false)}
          />
        )}

        {/* ---- Panel container ---- */}
        <div
          className={`
            h-full w-96 z-20 transition-all duration-300 ease-in-out
            fixed top-0 right-0 transform
            ${showPatientPanel ? "translate-x-0" : "translate-x-full"}
            lg:static lg:translate-x-0
            ${showPatientPanel ? "lg:block" : "lg:hidden"}
          `}
        >
          <div className="h-full flex flex-col bg-[#0a0a0f]/90 backdrop-blur-2xl border-l border-white/[0.07]">

            {/* -------- HEADER -------- */}
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <h2 className="text-white text-sm font-semibold tracking-wide">
                  Patient Panel
                </h2>
              </div>
              <button
                onClick={() => setShowPatientPanel(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150 text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* -------- TABS -------- */}
            <div className="flex px-3 pt-3 pb-0 gap-1 shrink-0">
              {["records", "stats", "prescription"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all duration-150 ${
                    activeTab === tab
                      ? "bg-indigo-500/20 text-indigo-300 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.3)]"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* -------- CONTENT -------- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

              {/* ---------------- RECORDS -------------------*/}
              {activeTab === "records" && (
                <div className="space-y-3">

                  {/* -------- Patient Info -------- */}
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
                    <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-3">
                      Patient Info
                    </p>
                    <div className="space-y-2">
                      {[
                        ["Name", patient?.name || patientName],
                        ["Reason", appointment?.reason || reason],
                        [
                          "Appointment",
                          `${appointment?.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : appointmentInfo} at ${appointment?.timeSlot ?? "—"}`,
                        ],
                        ["Gender", patient?.gender || "N/A"],
                        ["DOB", patient?.dob ? new Date(patient.dob).toLocaleDateString() : "N/A"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-3">
                          <span className="text-white/40 text-xs shrink-0">{label}</span>
                          <span className="text-white/80 text-xs text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* -------- Previous Prescriptions -------- */}
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
                    <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-3">
                      Previous Prescriptions
                    </p>
                    {prescriptions.length === 0 ? (
                      <p className="text-white/30 text-xs text-center py-4">No prescriptions found</p>
                    ) : (
                      <div className="space-y-2">
                        {prescriptions.map((p, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white/80 text-xs font-medium">{p.doctor?.name}</span>
                              <span className="text-white/30 text-[10px]">
                                {new Date(p.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-white/50 text-[11px]">
                              <span className="text-white/30">Dx: </span>{p.diagnosis || "N/A"}
                            </p>
                            <p className="text-white/50 text-[11px]">
                              <span className="text-white/30">Rx: </span>
                              {p.medicines?.map((m) => m.medicine).join(", ") || "N/A"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* -------- Consultation History -------- */}
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
                    <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-3">
                      Consultation History
                    </p>
                    {pastConsultations.length === 0 ? (
                      <p className="text-white/30 text-xs text-center py-4">No past consultations</p>
                    ) : (
                      <div className="space-y-2">
                        {pastConsultations.map((c, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-white/[0.04] border border-white/[0.06] p-3 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white/80 text-xs font-medium">{c.doctor?.name}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                  c.status === "completed"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : c.status === "pending"
                                    ? "bg-amber-500/15 text-amber-400"
                                    : "bg-white/10 text-white/40"
                                }`}
                              >
                                {c.status}
                              </span>
                            </div>
                            <p className="text-white/50 text-[11px]">
                              <span className="text-white/30">Reason: </span>
                              {c.appointment?.reason || "N/A"}
                            </p>
                            <p className="text-white/30 text-[10px]">
                              {c.appointment?.appointmentDate
                                ? new Date(c.appointment.appointmentDate).toLocaleDateString()
                                : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------ STATS ---------------*/}
              {activeTab === "stats" && (
                <div className="space-y-3">

                  {/* -------- Medical History -------- */}
                  {patient?.medical_history && (
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">
                          Medical History
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          ["Blood Group", patient.medical_history.bloodGroup],
                          ["Height", `${patient.medical_history.height} cm`],
                          ["Weight", `${patient.medical_history.weight} kg`],
                          ["Sugar Level", patient.medical_history.sugarLevel],
                          ["Blood Pressure", patient.medical_history.bloodPressure],
                          ["Cholesterol", patient.medical_history.cholesterol],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5">
                            <p className="text-white/30 text-[10px] mb-0.5">{label}</p>
                            <p className="text-white/80 text-xs font-medium">{value}</p>
                          </div>
                        ))}
                        <div className="col-span-2 rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5">
                          <p className="text-white/30 text-[10px] mb-0.5">Allergies</p>
                          <p className="text-white/80 text-xs">
                            {patient.medical_history.allergies?.join(", ") || "None"}
                          </p>
                        </div>
                        <div className="col-span-2 rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5">
                          <p className="text-white/30 text-[10px] mb-0.5">Conditions</p>
                          <p className="text-white/80 text-xs">
                            {patient.medical_history.medicalConditions?.join(", ") || "None"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* -------- Lifestyle Habits -------- */}
                  {patient?.lifestyle_habits && (
                    <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">
                          Lifestyle Habits
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          ["Smoking", patient.lifestyle_habits.smoking],
                          ["Alcohol", patient.lifestyle_habits.alcohol],
                          ["Exercise", patient.lifestyle_habits.exerciseFrequency],
                          ["Sleep", `${patient.lifestyle_habits.sleepHours} hrs`],
                          ["Stress", patient.lifestyle_habits.stressLevel],
                          ["Water", `${patient.lifestyle_habits.waterIntake} L`],
                          ["Caffeine", patient.lifestyle_habits.caffeineIntake],
                          ["Screen Time", `${patient.lifestyle_habits.screenTime} hrs`],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5">
                            <p className="text-white/30 text-[10px] mb-0.5">{label}</p>
                            <p className="text-white/80 text-xs font-medium">{value}</p>
                          </div>
                        ))}
                        <div className="col-span-2 rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5">
                          <p className="text-white/30 text-[10px] mb-0.5">Diet</p>
                          <p className="text-white/80 text-xs">
                            {patient.lifestyle_habits.diet?.join(", ")}
                          </p>
                        </div>
                        <div className="col-span-2 rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5">
                          <p className="text-white/30 text-[10px] mb-0.5">Physical Activity</p>
                          <p className="text-white/80 text-xs">
                            {patient.lifestyle_habits.physicalActivityType?.join(", ")}
                          </p>
                        </div>
                        <div className="col-span-2 rounded-lg bg-white/[0.04] border border-white/[0.05] p-2.5">
                          <p className="text-white/30 text-[10px] mb-0.5">Other Habits</p>
                          <p className="text-white/80 text-xs">
                            {patient.lifestyle_habits.otherHabits?.join(", ") || "None"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/*------------------- PRESCRIPTION ------------------- */}
              {activeTab === "prescription" && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
                    <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-4">
                      New Prescription
                    </p>

                    <form onSubmit={handleSubmitPrescription} className="space-y-4">

                      {/* ---- Diagnosis ---- */}
                      <div>
                        <label className="block text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-1.5">
                          Diagnosis
                        </label>
                        <textarea
                          value={form.diagnosis}
                          onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                          className="w-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 focus:border-indigo-500/60 focus:outline-none rounded-lg px-3 py-2.5 text-white text-xs placeholder-white/20 resize-none transition-colors duration-150"
                          rows={3}
                          placeholder="Enter diagnosis..."
                        />
                      </div>

                      {/* ---- Medicines ---- */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-white/40 text-[10px] font-semibold uppercase tracking-widest">
                            Medicines
                          </label>
                          <button
                            type="button"
                            onClick={addMedicine}
                            className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors duration-150 flex items-center gap-1"
                          >
                            <span className="text-base leading-none">+</span> Add
                          </button>
                        </div>

                        <div className="space-y-2">
                          {form.medicines.map((med, index) => (
                            <div
                              key={index}
                              className="rounded-lg bg-white/[0.04] border border-white/[0.07] p-3 space-y-2"
                            >
                              <input
                                value={med.medicine}
                                onChange={(e) => updateMedicine(index, "medicine", e.target.value)}
                                placeholder="Medicine name"
                                className="w-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 focus:border-indigo-500/60 focus:outline-none rounded-lg px-3 py-2 text-white text-xs placeholder-white/20 transition-colors duration-150"
                              />
                              <input
                                value={med.dosage}
                                onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                                placeholder="Dosage (e.g. 500mg twice daily)"
                                className="w-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 focus:border-indigo-500/60 focus:outline-none rounded-lg px-3 py-2 text-white text-xs placeholder-white/20 transition-colors duration-150"
                              />
                              <select
                                value={med.timing}
                                onChange={(e) => updateMedicine(index, "timing", e.target.value)}
                                className="w-full bg-white/[0.05] border border-white/[0.08] hover:border-white/20 focus:border-indigo-500/60 focus:outline-none rounded-lg px-3 py-2 text-white text-xs transition-colors duration-150 appearance-none cursor-pointer"
                              >
                                <option value="before" className="bg-[#1a1a2e]">Before meals</option>
                                <option value="after" className="bg-[#1a1a2e]">After meals</option>
                              </select>

                              {form.medicines.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMedicine(index)}
                                  className="text-rose-400/70 hover:text-rose-400 text-[11px] transition-colors duration-150"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ---- Submit ---- */}
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] py-2.5 rounded-lg text-white text-xs font-semibold tracking-wide transition-all duration-150 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      >
                        Submit Prescription
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  },
);

PatientPanel.displayName = "PatientPanel";

export default PatientPanel;