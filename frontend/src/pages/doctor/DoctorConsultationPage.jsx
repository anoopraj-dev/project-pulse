
import React from "react";
import ConsultationVideo from "@/components/shared/components/ConsultationVideo";
import PatientPanel from "@/components/user/doctor/consultation/PatientPanel";
import { useUser } from "@/contexts/UserContext";
import { useVideoSession } from "@/hooks/useVideoSession";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useCamera } from "@/hooks/useCamera";
import { useVideoProcessor } from "@/hooks/useVideoProcessor";
import { useState, useEffect } from "react";
import { fetchPatientStats, endConsultation, submitPrescription } from "@/api/doctor/doctorApis";
import toast from "react-hot-toast";
import { socket } from "@/socket";

const DoctorConsultationPage = () => {
  const { id: sessionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { participants } = state;
  const { user } = useUser();

  const [patientData,setPatientData] = useState(null)
  const [loading,setLoading] = useState(true);

  const rawStream = useCamera();

  const [mode, setMode] = useState("none");
  const [bgImage, setBgImage] = useState("/healthcare1.jpg");

  const [showPatientPanel, setShowPatientPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("records");

  // -------- patient info (prefilled) --------
  const patient = participants?.patient;

  const patientName = patient?.name || "Unknown";
  const reason = patient?.reason || "General Consultation";
  const appointmentInfo = patient?.time || "Today";

  // -------- prescription form --------
  const [form, setForm] = useState({
    diagnosis: "",
    medicines: [{ medicine: "", dosage: "", timing: "before" }],
  });
  const [prescriptionSubmitted, setPrescriptionSubmitted] = useState(false);

  // -------- processed stream --------
  const processedStream = useVideoProcessor(
    rawStream,
    mode,
    bgImage
  );

  const finalStream = processedStream ?? rawStream;
  

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
    finalStream,
    user
  );

  // Navigate when consultation ends
  useEffect(() => {
    if (status === "ended") {
      navigate("/doctor/appointments");
    }
  }, [status, navigate]);

  useEffect(() => {
  const getData = async () => {
    try {
      const res = await fetchPatientStats(sessionId); 
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
    if (!prescriptionSubmitted) {
      toast.error("Please submit a prescription before ending the consultation");
      return;
    }

    try {
      const res = await endConsultation(sessionId);

      if(res.data.status === 'pending-confirmation'){
        toast('Waiting for patients confirmation');
        return ;
      }
    } catch (error) {
      console.log(error);
    }
     
  };


  useEffect(() => {
  const handler = () => {
    endCall();
    setStatus("ended");
    navigate("/doctor/appointments");
  };

  socket.on("consultation:ended", handler);

  return () => {
    socket.off("consultation:ended", handler);
  };
}, []);

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    try {
      await submitPrescription(sessionId, form);
      toast.success("Prescription submitted successfully!");
      setPrescriptionSubmitted(true);

      console.log('sessionId',sessionId)

      socket.emit('prescription:submitted',{
        sessionId
      })
      // Reset form
      setForm({
        diagnosis: "",
        medicines: [{ medicine: "", dosage: "", timing: "before" }],
      });
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast.error("Failed to submit prescription. Please try again.");
    }
  };

  // -------- medicine management --------
  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [...form.medicines, { medicine: "", dosage: "", timing: "before" }],
    });
  };

  const removeMedicine = (index) => {
    if (form.medicines.length > 1) {
      setForm({
        ...form,
        medicines: form.medicines.filter((_, i) => i !== index),
      });
    }
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = form.medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setForm({
      ...form,
      medicines: updatedMedicines,
    });
  };

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
          endCallDisabled={!prescriptionSubmitted}
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
        addMedicine={addMedicine}
        removeMedicine={removeMedicine}
        updateMedicine={updateMedicine}
      />
    </div>
  );
};

export default DoctorConsultationPage;