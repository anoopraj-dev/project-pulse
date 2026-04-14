import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { viewAppointmentDetails } from "@/api/patient/patientApis";
import { cancelAppointment } from "@/api/patient/patientApis";
import { Icon } from "@iconify/react";
import PageBanner from "@/components/shared/components/PageBanner";
import { pageBannerConfig } from "@/components/shared/configs/bannerConfig";
import BlockedProfile from "@/components/shared/components/BlockedProfile";
import { useUser } from "@/contexts/UserContext";
import PatientStatusBanner from "@/components/user/patient/profile/PatientStatusBanner";
import { joinConsultation, getConsultationPDF } from "@/api/user/userApis";

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

const PatientViewAppointment = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await viewAppointmentDetails(id);
        if (!res.data?.success)
          return toast.error("Failed to load appointment");

        setAppointment(res.data?.appointment);
      } catch {
        toast.error("Error loading appointment");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  //------------------ Handle messages --------------
  const handleMessages = (id) => {
    navigate(`/patient/messages/${id}`);
  };

  //-------------- Handle Cancel Appointments ---------------
  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await cancelAppointment(id);
      toast.success("Appointment cancelled successfully");
      setAppointment((prev) => ({
        ...prev,
        status: "cancelled",
      }));
    } catch {
      toast.error("Error cancelling appointment");
    } finally {
      setCancelling(false);
      setShowConfirm(false);
    }
  };

  const handleJoinConsultation = async () => {
    try {
      console.log("appointment", appointment);
      const consultationId = appointment?.consultation?._id;

      if (!consultationId) {
        return toast.error("Consultation not available yet");
      }

      console.log("consultationId", consultationId);

      const res = await joinConsultation(consultationId, "patient");

      if (!res.data?.success) {
        return toast.error("Unable to join the call");
      }

      const { sessionId } = res.data.consultation;

      console.log("sessionId", sessionId);

      const participants = {
        patient: {
          name: res.data?.consultation?.participants?.patient?.name,
          profilePicture:
            res.data?.consultation?.participants?.patient?.profilePicture,
        },
        doctor: {
          name: res.data?.consultation?.participants?.doctor?.name,
          profilePicture:
            res.data?.consultation?.participants?.doctor?.profilePicture,
        },
        consultationId:res.data?.consultation?._id,
        startTime:res.data?.consultation?.startTime,
        endTime :res.data?.consultation?.endTime
      };

      navigate(`/patient/appointments/consultation/${consultationId}`, {
        state: { sessionId, participants },
      });
    } catch (error) {
      toast.error(
        error?.response?.data.message || "Failed to join consultation",
      );
    }
  };

  //------------- View PDF -------------------
  const handleViewPDF = async () => {
    try {
      const consultationId = appointment.consultation?._id || appointment.consultation;
      const res = await getConsultationPDF(consultationId, "patient");
      const url = window.URL.createObjectURL(res.data);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error("Failed to load PDF");
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
        <p className="text-sm font-medium text-red-500">
          Appointment not found.
        </p>
      </div>
    );

  const status = appointment.status?.toLowerCase() ?? "confirmed";
  const sc = statusConfig[status] ?? statusConfig.confirmed;
  const doctor = appointment.doctor ?? {};
  const doctorId = doctor?._id;
  const specialty = doctor.professionalInfo?.specializations?.[0];

  const appointmentDateTime = new Date(appointment.appointmentDate);

  if (appointment.timeSlot) {
    const [hours, minutes] = appointment.timeSlot.split(":");
    appointmentDateTime.setHours(Number(hours));
    appointmentDateTime.setMinutes(Number(minutes));
    appointmentDateTime.setSeconds(0);
  }

  //---------- Current time ---------------
  const now = new Date();

  //--------Difference in milliseconds-----
  const diffInMs = appointmentDateTime - now;

  // Convert to hours
  const diffInHours = diffInMs / (1000 * 60 * 60);

  // -------- Allow cancellation only if---------:
  // 1. Not already cancelled
  // 2. More than 2 hours remaining
  const isCancellable = status !== "cancelled" && diffInHours > 2;

  return (
    <div className="min-h-screen px-4 ">
      <PatientStatusBanner
        status={user?.status}
        blockedReason={user?.blockedReason}
      />
      {user?.status === "blocked" ? (
        <>
          <BlockedProfile reason={user?.blockedReason} />
        </>
      ) : (
        <>
          <PageBanner config={pageBannerConfig.patientAppointmentView} />

          <div className="mx-auto px-2 pb-16">
            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
              {/* Doctor banner */}
              <div className="flex items-center gap-4 border-b border-slate-100 text-sky-600 font-bold px-6 py-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full ring-2 ring-sky-200 overflow-hidden bg-white shadow-sm">
                  {doctor?.profilePicture ? (
                    <img
                      src={doctor?.profilePicture}
                      alt={doctor?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">
                      {doctor?.name?.charAt(0)?.toUpperCase() || "D"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Consulting Doctor
                  </p>
                  <p className="text-lg font-semibold">
                    {doctor.name ?? "Unknown"}
                  </p>
                  {specialty && <p className="mt-0.5 text-sm">{specialty}</p>}
                </div>
                <div
                  className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${sc.bg} ${sc.color} ${sc.ring}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              </div>

              {/* Appointment info grid */}
              <div className="grid grid-cols-2 gap-6 border-b border-slate-100 px-6 py-6 sm:grid-cols-4">
                <InfoRow
                  label="Date"
                  value={new Date(
                    appointment.appointmentDate,
                  ).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                />
                <InfoRow label="Time" value={appointment.timeSlot} />
                <InfoRow label="Service" value={appointment.serviceType} />
                <InfoRow
                  label="Appointment ID"
                  value={`#${id?.slice(-6).toUpperCase()}`}
                />
              </div>

              {/* Consultation details */}
              <div className="px-6 py-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Consultation Details
                </p>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Reason
                    </span>
                    <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-100">
                      {appointment.reason || "No reason provided."}
                    </p>
                  </div>
                  {appointment.notes && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Notes
                      </span>
                      <p className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-sky-100">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation Link */}
              <div className="border-t border-slate-100 px-6 py-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Consultation Link
                </p>
                {
                  <div className="flex flex-col gap-3 rounded-xl bg-sky-50 px-5 py-4 ring-1 ring-sky-100">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:link-variant"
                        className="h-4 w-4 shrink-0 text-sky-500"
                      />
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
                  // ) : (
                  //   <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
                  //     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200">
                  //       <Icon
                  //         icon="mdi:video-off-outline"
                  //         className="h-4 w-4 text-slate-400"
                  //       />
                  //     </div>
                  //     <div>
                  //       <p className="text-sm font-medium text-slate-700">
                  //         Consultation link not available yet
                  //       </p>
                  //       <p className="text-xs text-slate-400">
                  //         The doctor will share a link closer to your appointment
                  //         time.
                  //       </p>
                  //     </div>
                  //   </div>
                  // )
                }

                {/* Consultation PDF */}
                {appointment.status === "completed" && (
                  <div className="mt-4 rounded-xl bg-green-50 px-5 py-4 ring-1 ring-green-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon
                        icon="mdi:file-pdf-box"
                        className="h-4 w-4 shrink-0 text-green-500"
                      />
                      <span className="text-sm font-medium text-green-700">
                        Consultation Report PDF
                      </span>
                    </div>
                    <button
                      onClick={handleViewPDF}
                      className="flex w-fit items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <Icon icon="mdi:eye-outline" className="h-4 w-4" />
                      View Report
                    </button>
                  </div>
                )}

                {/* Message Doctor */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Have a question before your visit?
                    </p>
                    <p className="text-xs text-slate-400">
                      Send a message directly to {doctor.name ?? "your doctor"}.
                    </p>
                  </div>
                  <button
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 hover:border-sky-300"
                    onClick={() => handleMessages(doctorId)}
                  >
                    <Icon icon="mdi:chat-outline" className="h-4 w-4" />
                    Message Doctor
                  </button>
                </div>

                {/* Cancel button area */}
                {isCancellable ? (
                  <div className="border-t border-slate-100 px-6 py-5">
                    {!showConfirm ? (
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="ml-auto flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 hover:border-red-300"
                      >
                        Cancel Appointment
                      </button>
                    ) : (
                      <div className="flex flex-col gap-3 rounded-xl bg-red-50 px-5 py-4 ring-1 ring-red-100">
                        <p className="text-sm font-medium text-slate-700">
                          Are you sure you want to cancel this appointment? This
                          action cannot be undone.
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                          >
                            {cancelling && (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            )}
                            {cancelling ? "Cancelling…" : "Yes, Cancel"}
                          </button>
                          <button
                            onClick={() => setShowConfirm(false)}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                          >
                            Keep Appointment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 rounded-xl bg-red-50 px-5 py-4 ring-1 ring-red-100">
                    <p className="text-sm text-red-500 font-medium">
                      {status === "cancelled"
                        ? `Appointment cancelled by ${appointment?.cancelledBy}`
                        : "Appointment cannot be cancelled within 2 hours to consultation"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default PatientViewAppointment;
