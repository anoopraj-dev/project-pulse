import React from "react";

const PatientPanel = React.memo(({ showPatientPanel, setShowPatientPanel, activeTab, setActiveTab, patientName, reason, appointmentInfo, form, setForm, handleSubmitPrescription, patientData, addMedicine, removeMedicine, updateMedicine }) => {
  return (
    <>
      {showPatientPanel && (
        <div
          className="fixed inset-0 bg-black/40 z-10 lg:hidden"
          onClick={() => setShowPatientPanel(false)}
        />
      )}

      {/* ------------ Patient Panel ------------ */}
      <div
        className={`
          h-full w-96 z-20 transition-all duration-300

          fixed top-0 right-0 transform
          ${showPatientPanel ? "translate-x-0" : "translate-x-full"}

          lg:static lg:translate-x-0
          ${showPatientPanel ? "lg:block" : "lg:hidden"}
        `}
      >
        <div className="h-full bg-black/80 backdrop-blur-xl border-l border-white/10 flex flex-col">

          {/* -------- header -------- */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">
              Patient Panel
            </h2>
            <button
              onClick={() => setShowPatientPanel(false)}
              className="text-white/60 hover:text-white text-sm"
            >
              Close
            </button>
          </div>

          {/* -------- tabs -------- */}
          <div className="flex border-b border-white/10 text-sm">
            {["records", "stats", "prescription"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 capitalize ${
                  activeTab === tab
                    ? "text-white border-b-2 border-indigo-500"
                    : "text-white/60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* -------- content -------- */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "records" && (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Patient Info</h3>
                  <p className="text-white/80 text-sm">Name: {patientData?.patient?.name || patientName}</p>
                  <p className="text-white/80 text-sm">Reason: {patientData?.appointment?.reason || reason}</p>
                  <p className="text-white/80 text-sm">Appointment: {patientData?.appointment?.date ? new Date(patientData.appointment.date).toLocaleDateString() : appointmentInfo} at {patientData?.appointment?.time}</p>
                  <p className="text-white/80 text-sm">Gender: {patientData?.patient?.gender}</p>
                  <p className="text-white/80 text-sm">DOB: {patientData?.patient?.dob ? new Date(patientData.patient.dob).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-6">
                {patientData?.patient?.medical_history && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Medical History
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Blood Group:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.bloodGroup || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Height:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.height || 'N/A'} cm</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Weight:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.weight || 'N/A'} kg</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Sugar Level:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.sugarLevel || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Blood Pressure:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.bloodPressure || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Cholesterol:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.cholesterol || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2 col-span-2">
                        <span className="text-white/60">Allergies:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.allergies?.join(', ') || 'None'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2 col-span-2">
                        <span className="text-white/60">Medical Conditions:</span>
                        <span className="text-white ml-1">{patientData.patient.medical_history.medicalConditions?.join(', ') || 'None'}</span>
                      </div>
                    </div>
                  </div>
                )}
                {patientData?.patient?.lifestyle_habits && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Lifestyle Habits
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Smoking:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.smoking || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Alcohol:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.alcohol || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Exercise:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.exerciseFrequency || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Sleep:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.sleepHours || 'N/A'} hrs</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Stress Level:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.stressLevel || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Water Intake:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.waterIntake || 'N/A'} L</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Caffeine:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.caffeineIntake || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <span className="text-white/60">Screen Time:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.screenTime || 'N/A'} hrs</span>
                      </div>
                      <div className="bg-white/5 rounded p-2 col-span-2">
                        <span className="text-white/60">Diet:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.diet?.join(', ') || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2 col-span-2">
                        <span className="text-white/60">Physical Activity:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.physicalActivityType?.join(', ') || 'N/A'}</span>
                      </div>
                      <div className="bg-white/5 rounded p-2 col-span-2">
                        <span className="text-white/60">Other Habits:</span>
                        <span className="text-white ml-1">{patientData.patient.lifestyle_habits.otherHabits?.join(', ') || 'None'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "prescription" && (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Prescription</h3>
                  <form onSubmit={handleSubmitPrescription} className="space-y-3">
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Diagnosis</label>
                      <textarea
                        value={form.diagnosis}
                        onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                        rows={3}
                        placeholder="Enter diagnosis..."
                      />
                    </div>

                    {/* Medicines */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-white/80 text-sm">Medicines</label>
                        <button
                          type="button"
                          onClick={addMedicine}
                          className="text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                          + Add Medicine
                        </button>
                      </div>
                      {form.medicines.map((med, index) => (
                        <div key={index} className="bg-white/5 rounded p-3 mb-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white/80 text-sm">Medicine {index + 1}</span>
                            {form.medicines.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeMedicine(index)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={med.medicine}
                            onChange={(e) => updateMedicine(index, 'medicine', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                            placeholder="Enter medicine name..."
                          />
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                            placeholder="e.g., 500mg, 2 tablets..."
                          />
                          <select
                            value={med.timing}
                            onChange={(e) => updateMedicine(index, 'timing', e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                          >
                            <option value="before">Before meals</option>
                            <option value="after">After meals</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium"
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
});

PatientPanel.displayName = "PatientPanel";

export default PatientPanel;
