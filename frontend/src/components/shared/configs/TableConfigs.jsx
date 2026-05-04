
// -------- DateTime Helpers ----------
const formatDate = (date) => {
  const dt = new Date(date);
  return isNaN(dt) ? "-" : dt.toLocaleDateString("en-IN");
};

const formatTime = (date) => {
  const dt = new Date(date);
  return isNaN(dt)
    ? "-"
    : dt.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
};



//-------------- Doctors Table config ----------------
export const doctorColumns = [
  {
    header: "Joined",
    render: (doc) => formatDate(doc.createdAt),
  },
  {
    header: "Name",
    render: (doc) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={doc.profilePicture || "/profile.png"}
            alt={doc.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-gray-900">{doc.name}</span>
      </div>
    ),
  },
  {
    header: "Specialization",
    render: (doc) => doc.professionalInfo?.specializations?.[0] || "—",
  },
  {
    header: "Experience",
    render: (doc) => {
      const years =
        doc.professionalInfo?.experience?.reduce(
          (total, curr) => total + curr.years,
          0
        ) || 0;

      return (
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          {years} yrs
        </span>
      );
    },
    align: "center",
  },
  {
    header: "Qualification",
    render: (doc) => doc.professionalInfo?.qualifications?.[0] || "—",
  },
];

//-------------- Patients Table Config --------------------
export const patientColumns = [
  {
    header: "Joined",
    render: (patient) => formatDate(patient.createdAt),
  },
  {
    header: "Name",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={patient.profilePicture || "/profile.png"}
            alt={patient.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-gray-900">
          {patient.name || "-"}
        </span>
      </div>
    ),
  },
  {
    header: "Gender",
    render: (patient) => patient.gender || "-",
  },
  {
    header: "Work",
    render: (patient) => patient.work || "-",
  },
];

//-------------- Patient Appointment --------------------
export const patientAppointmentColumns = [
  {
    header: "Booked On",
    render: (appointment) => formatDate(appointment.createdAt),
  },
  {
    header: "Doctor",
    render: (appointment) => (
      <div className="flex items-center gap-4">
        <img
          src={appointment.doctor?.profilePicture || "/profile.png"}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold">
            {appointment.doctor?.name || "-"}
          </div>
          <div className="text-xs text-gray-500">
            {appointment.doctor?.professionalInfo?.specializations?.[0] || "-"}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Appointment Date",
    render: (appointment) => formatDate(appointment.appointmentDateTime),
  },
  {
    header: "Time",
    render: (appointment) => formatTime(appointment.appointmentDateTime),
  },
  {
    header: "Status",
    render: (appointment) => {
      const styles = {
        confirmed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
        completed: "bg-blue-100 text-blue-700",
      };

      return (
        <span className={`px-3 py-1 rounded-full text-xs ${styles[appointment.status]}`}>
          {appointment.status}
        </span>
      );
    },
  },
];

//-------------- Doctor Appointment --------------------
export const doctorAppointmentColumns = [
  {
    header: "Booked On",
    render: (appointment) => formatDate(appointment.createdAt),
  },
  {
    header: "Patient",
    render: (appointment) => (
      <div className="flex items-center gap-4">
        <img
          src={appointment.patient?.profilePicture || "/profile.png"}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold">{appointment.patient?.name}</div>
          <div className="text-xs text-gray-500">
            {appointment.patient?.gender}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Consultation",
    render: (a) => a.serviceType || "-",
  },
  {
    header: "Appointment Date",
    render: (a) => formatDate(a.appointmentDateTime),
  },
  {
    header: "Time",
    render: (a) => formatTime(a.appointmentDateTime),
  },
  {
    header: "Status",
    render: (a) => a.status,
  },
];

//-------------- Admin Appointment --------------------
export const adminAppointmentColumns = [
  {
    header: "Booked On",
    render: (a) => formatDate(a.createdAt),
  },
  {
    header: "Patient",
    render: (a) => a.patient?.name || "-",
  },
  {
    header: "Doctor",
    render: (a) => a.doctor?.name || "-",
  },
  {
    header: "Consultation",
    render: (a) => a.serviceType || "-",
  },
  {
    header: "Appointment Date",
    render: (a) => formatDate(a.appointmentDateTime),
  },
  {
    header: "Time",
    render: (a) => formatTime(a.appointmentDateTime),
  },
  {
    header: "Status",
    render: (a) => a.status,
  },
];

//-------------- Payments (NO CHANGE NEEDED) ----------------
export const patientPaymentColumns = [
  {
    header: "Paid On",
    render: (p) => formatDate(p.createdAt),
  },
  {
    header: "Amount",
    render: (p) =>
      `₹${((p.amount || 0) / 100).toLocaleString("en-IN")}`,
  },
];

export const doctorPaymentColumns = [
  {
    header: "Date",
    render: (i) => formatDate(i.processedAt || i.createdAt),
  },
];