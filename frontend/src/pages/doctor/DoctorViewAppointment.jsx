
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import { viewAppointmentDetails, cancelAppointment } from "@/api/doctor/doctorApis";
import { joinConsultation, getConsultationPDF } from "@/api/user/userApis";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";

const statusConfig = {
  confirmed: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
    dot: "bg-emerald-500",
  },
  cancelled: {
    color: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
    dot: "bg-red-500",
  },
  completed: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
    dot: "bg-amber-500",
  },
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </span>
    <span className="text-sm font-medium text-slate-800">{value || "—"}</span>
  </div>
);

const DoctorViewAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await viewAppointmentDetails(id);
        if (!res.data?.success) {
          toast.error("Failed to load appointment");
          return;
        }
        setAppointment(res.data.appointment);
      } catch {
        toast.error("Error loading appointment");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  // --------------- View Patient Profile ---------------
  const viewPatientProfile = (patientId) => {
    navigate(`/doctor/appointments/patient-profile/${patientId}`);
  };

  // --------------- Send Messages -------------------
  const handleMessages = (patientId) => {
    navigate(`/doctor/messages/${patientId}`);
  };

  // --------------- View Consultation PDF -------------------
  const handleViewPDF = async () => {
    try {
      const consultationId = appointment.consultation?._id || appointment.consultation;
      const res = await getConsultationPDF(consultationId, "doctor");
      const url = window.URL.createObjectURL(res.data);
      window.open(url); // Opens PDF in new tab, same as DoctorPayments
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error("Failed to load PDF");
    }
  };

  // --------------- Handle Cancellation ----------------
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    try {
      setCancelling(true);

      const res = await cancelAppointment(id, { reason: cancelReason });

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed to cancel appointment");
        return;
      }

      toast.success("Appointment cancelled and refund processed to patient's wallet");

      setAppointment((prev) => ({
        ...prev,
        status: "cancelled",
        cancellationReason: cancelReason,
      }));

      setShowConfirm(false);
      setCancelReason("");
    } catch (error) {
      console.error(error);
      toast.error("Error cancelling appointment");
    } finally {
      setCancelling(false);
    }
  };

  // --------------- Join Consultation ----------------
  const handleJoinConsultation = async () => {
    try {
      const consultationId = appointment?.consultation;
      if (!consultationId) {
        return toast.error("Consultation not available yet");
      }

      const res = await joinConsultation(consultationId, "doctor");

      if (!res.data?.success) {
        return toast.error("Unable to join the call");
      }

      const { sessionId } = res.data?.consultation;

      const participants = {
        patient: {
          name: res.data?.consultation?.participants?.patient?.name,
          profilePicture: res.data?.consultation?.participants?.patient?.profilePicture,
        },
        doctor: {
          name: res.data?.consultation?.participants?.doctor?.name,
          profilePicture: res.data?.consultation?.participants?.doctor?.profilePicture,
        },
        consultationId:res.data?.consultation?._id,
        startTime:res.data?.consultation?.startTime,
        endTime: res.data?.consultation?.endTime
      };

      navigate(`/doctor/appointments/consultation/${consultationId}`, {
        state: { sessionId, participants },
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to join consultation");
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <p className="text-sm text-slate-500">Loading appointment…</p>
        </div>
      </div>
    );

  if (!appointment)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-100">
        <p className="text-sm font-medium text-red-500">Appointment not found.</p>
      </div>
    );

  const status = appointment.status?.toLowerCase() ?? "confirmed";
  const sc = statusConfig[status] ?? statusConfig.confirmed;
  const patient = appointment.patient ?? {};
  const patientId = patient?._id;

  return (
    <div className="min-h-screen px-20">
      <PageBanner config={pageBannerConfig.doctorAppointments} activeTab={appointment.status?.toLowerCase() || "N/A"} count={1} />

      <div className="mx-auto px-2 pb-16">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
          {/* Patient Banner */}
          <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full ring-2 ring-sky-200 overflow-hidden bg-white shadow-sm">
              {patient?.profilePicture ? (
                <img
                  src={patient.profilePicture}
                  alt={patient.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-slate-500">
                  {patient?.name?.charAt(0)?.toUpperCase() || "D"}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Patient
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {patient.name || "Unknown"}
              </p>
              <p className="text-sm text-slate-500">{patient.email}</p>
            </div>

            <div
              className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${sc.bg} ${sc.color} ${sc.ring}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>

          {/* Appointment Info */}
          <div className="grid grid-cols-2 gap-6 border-b border-slate-100 px-6 py-6 sm:grid-cols-4">
            <InfoRow
              label="Date"
              value={new Date(appointment.appointmentDate).toLocaleDateString(
                "en-US",
                {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}
            />
            <InfoRow label="Time" value={appointment.timeSlot} />
            <InfoRow label="Service" value={appointment.serviceType} />
            <InfoRow label="Appointment ID" value={`#${id.slice(-6).toUpperCase()}`} />
          </div>

          {/* Consultation Details */}
          <div className="px-6 py-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Consultation Details
            </p>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Reason
              </span>
              <p className="mt-1 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-100">
                {appointment.reason || "—"}
              </p>
            </div>
          </div>

          {/* Consultation Link */}
          <div className="border-t border-slate-100 px-6 py-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Consultation Link
            </p>
            <div className="flex flex-col gap-3 rounded-xl bg-sky-50 px-5 py-4 ring-1 ring-sky-100">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:link-variant" className="h-4 w-4 shrink-0 text-sky-500" />
                <a
                  href={appointment.consultationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-sky-600 underline underline-offset-2 hover:text-sky-800"
                >
                  {appointment.consultationLink}
                </a>
              </div>
              <button
                onClick={handleJoinConsultation}
                disabled={appointment.status === "cancelled" || appointment.status === "completed"}
                className={`flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  appointment.status === "cancelled" || appointment.status === "completed"
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : "bg-sky-600 text-white hover:bg-sky-700"
                }`}
              >
                <Icon icon="mdi:video-outline" className="h-4 w-4" />
                {appointment.status === "completed" ? "Consultation Completed" : "Talk to Doctor"}
              </button>
            </div>
          </div>

          {/* Consultation PDF */}
          {appointment.status === "completed" && (
            <div className="border-t border-slate-100 px-6 py-6">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Consultation Report
              </p>
              <div className="flex flex-col gap-3 rounded-xl bg-green-50 px-5 py-4 ring-1 ring-green-100">
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:file-pdf-box" className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm font-medium text-green-700">
                    Consultation Report PDF
                  </span>
                </div>
                <button
                  onClick={handleViewPDF} // <-- Uses same logic as DoctorPayments
                  className="flex w-fit items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <Icon icon="mdi:eye-outline" className="h-4 w-4" />
                  View Report
                </button>
              </div>
            </div>
          )}

          {/* View Patient Profile */}
          <div className="border-t border-slate-100 px-6 py-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Need to know more about the patient?
                </p>
                <p className="text-xs text-slate-400">View their medical history and more.</p>
              </div>
              <button
                onClick={() => viewPatientProfile(patientId)}
                className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 hover:border-sky-300"
              >
                <Icon icon="mdi:account-outline" className="h-4 w-4" />
                Patient's Profile
              </button>
            </div>
          </div>

          {/* Message Patient */}
          <div className="border-t border-slate-100 px-6 py-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-700">Need to communicate with the patient?</p>
                <p className="text-xs text-slate-400">Send a message directly to the patient.</p>
              </div>
              <button
                onClick={() => handleMessages(patientId)}
                className="flex items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 hover:border-sky-300"
              >
                <Icon icon="mdi:chat-outline" className="h-4 w-4" />
                Message Patient
              </button>
            </div>
          </div>

          {/* Cancel button area */}
          <div className="border-t border-slate-100 px-6 py-5">
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={appointment.status === "cancelled"}
                className={`ml-auto flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition
                ${
                  appointment.status === "cancelled"
                    ? "bg-red-50 border-red-200 text-red-300 cursor-not-allowed"
                    : "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
                }`}
              >
                Cancel Appointment
              </button>
            ) : (
              <div className="flex flex-col gap-4 rounded-xl bg-red-50 px-5 py-4 ring-1 ring-red-100">
                <p className="text-sm font-medium text-slate-700">
                  Please specify the reason for cancellation.
                </p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter cancellation reason..."
                  rows={3}
                  className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-red-300"
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {cancelling && (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {cancelling ? "Cancelling…" : "Confirm Cancel"}
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                      setCancelReason("");
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Keep Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorViewAppointment;
