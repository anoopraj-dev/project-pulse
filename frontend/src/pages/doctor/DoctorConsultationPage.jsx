// import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
// import { useUser } from "@/contexts/UserContext";
// import { useVideoSession } from "@/hooks/useVideoSession";
// import { useLocation, useParams } from "react-router-dom";
// import { useCamera } from "@/hooks/useCamera";
// import { useVideoProcessor } from "@/hooks/useVideoProcessor";
// import { useState } from "react";

// const DoctorConsultationPage = () => {
//   const { id: sessionId } = useParams();
//   const { state } = useLocation();
//   const { participants } = state;
//   const { user } = useUser();
//   const [showPanel,setShowPanel] = useState(false);

//   const rawStream = useCamera();
//   const [mode,setMode] = useState('none');
//   const [bgImage,setBgImage] = useState('/healthcare1.jpg')

//   const processedStream = useVideoProcessor(
//     rawStream,
//     mode,
//     bgImage
//   )
//   const {
//     status,
//     setStatus,
//     endCall,
//     localVideoRef,
//     remoteVideoRef,
//     onToggleMute,
//     onToggleCamera,
//     isMuted,
//     isCameraOff,
//     remoteVideoOff,
//     callDuration
//   } = useVideoSession(sessionId, "doctor",processedStream || rawStream, user);

//   //------------ End Call -------------
//   const handleEndCall = () => {
//     endCall();
//     setStatus("ended");
//   };
//   return (
//     <div className="border border-blue-500">
//       //--------- Video layer -----------
//       <ConsultationVideo
//         status={status}
//         localVideoRef={localVideoRef}
//         remoteVideoRef={remoteVideoRef}
//         onEndCall={handleEndCall}
//         onToggleCamera={onToggleCamera}
//         onToggleMute={onToggleMute}
//         isCameraOff={isCameraOff}
//         isMuted={isMuted}
//         remoteVideoOff={remoteVideoOff}
//         participants={participants}
//         callDuration={callDuration}

//         mode={mode}
//         setMode={setMode}
//         setBgImage={setBgImage}
//       />

//     {/* ------------- Patient Panel--------- */}
    

//     </div>
//   );
// };

// export default DoctorConsultationPage;


import React from "react";
import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";
import { useVideoProcessor } from "@/hooks/useVideoProcessor";
import { useState,useEffect,useRef } from "react";
import { fetchPatientStats, endConsultation } from "@/api/doctor/doctorApis";

const PatientPanel = React.memo(({ showPatientPanel, setShowPatientPanel, activeTab, setActiveTab, patientName, reason, appointmentInfo, form, setForm, handleSubmitPrescription, patientData }) => {
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
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 text-sm mb-1">Prescription</label>
                      <textarea
                        value={form.prescription}
                        onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                        rows={4}
                      />
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

const DoctorConsultationPage = () => {
  const { id: sessionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { participants } = state;
  const { user } = useUser();
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log("DoctorConsultationPage render count:", renderCount.current);

  const [patientData,setPatientData] = useState(null)
  const [loading,setLoading] = useState(true);

  const rawStream = useCamera();

  const [mode, setMode] = useState("none");
  const [bgImage, setBgImage] = useState("/healthcare1.jpg");

  const [showPatientPanel, setShowPatientPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("records");

  // -------- patient info (prefilled) --------

 console.log(Array.isArray(participants))
  const patient = participants?.patient;

  const patientName = patient?.name || "Unknown";
  const reason = patient?.reason || "General Consultation";
  const appointmentInfo = patient?.time || "Today";

  // -------- prescription form --------
  const [form, setForm] = useState({
    diagnosis: "",
    prescription: "",
  });

  // -------- processed stream --------
  const processedStream = useVideoProcessor(
    rawStream,
    mode,
    bgImage
  );

  const {
    status,
    setStatus,
    endCall,
    localVideoRef,
    remoteVideoRef,
    onToggleMute,
    onToggleCamera,
    isMuted,
    isCameraOff,
    remoteVideoOff,
    remoteMuted,
  } = useVideoSession(
    sessionId,
    "doctor",
    processedStream || rawStream,
    user
  );

  // Navigate when consultation ends
  useEffect(() => {
    if (status === "ended") {
      navigate("/doctor/appointments");
    }
  }, [status, navigate]);

  // Cleanup camera when component unmounts or consultation ends
  useEffect(() => {
    return () => {
      if (rawStream) {
        rawStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [rawStream]);

  //fetch patient stats 

  useEffect(() => {
  const getData = async () => {
    try {
      const res = await fetchPatientStats(sessionId); 
      console.log('response from fetchPatientStats:', res);
      setPatientData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (sessionId) {
    getData();
  }
}, []);

  // -------- end call --------
  const handleEndCall = async () => {
    try {
      console.log("Final Prescription:", {
        patientName,
        reason,
        appointmentInfo,
        ...form,
      });

      // Call API to end consultation
      await endConsultation(sessionId);

      // End the video call
      endCall();
      setStatus("ended");

      // Navigate back to appointments or dashboard
      navigate("/doctor/appointments");
    } catch (error) {
      console.error("Error ending consultation:", error);
      // Still end the call even if API fails
      endCall();
      setStatus("ended");
      navigate("/doctor/appointments");
    }
  };

  const handleSubmitPrescription = () => {}

  return (
    <div className="h-screen w-full overflow-hidden flex">

      {/* ------------ Video Section ------------ */}
      <div
        className={`relative h-full transition-all duration-300 ${
          showPatientPanel
            ? "lg:w-[calc(100%-24rem)] w-full"
            : "w-full"
        }`}
      >
        <ConsultationVideo
          status={status}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onEndCall={handleEndCall}
          onToggleCamera={onToggleCamera}
          onToggleMute={onToggleMute}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          remoteVideoOff={remoteVideoOff}
          remoteMuted={remoteMuted}
          participants={participants}
          mode={mode}
          setMode={setMode}
          setBgImage={setBgImage}
          onTogglePatientPanel={() =>
            setShowPatientPanel((prev) => !prev)
          }
        />
      </div>

      <PatientPanel
        showPatientPanel={showPatientPanel}
        setShowPatientPanel={setShowPatientPanel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientName={patientName}
        reason={reason}
        appointmentInfo={appointmentInfo}
        form={form}
        setForm={setForm}
        handleSubmitPrescription={handleSubmitPrescription}
        patientData={patientData}
      />
    </div>
  );
};

export default DoctorConsultationPage;