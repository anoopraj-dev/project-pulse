
//-------------- Doctors Table config ----------------
export const doctorColumns = [
  {
    header: "Joined",
    render: (doc) =>
      new Date(doc.createdAt).toLocaleDateString("en-IN"),
  },
  {
    header: "Name",
    render: (doc) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={doc.profilePicture}
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
    render: (doc) =>
      doc.professionalInfo?.specializations?.[0] || "—",
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
    render: (doc) =>
      doc.professionalInfo?.qualifications?.[0] || "—",
  },
];

//-------------- Patients Table Config --------------------
//------- helper ------------
const calculateAge = (dob) => {
  if (!dob) return "—";

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};


export const patientColumns = [
  {
    header: "Joined",
    render: (patient) =>
      new Date(patient.createdAt).toLocaleDateString("en-IN"),
  },
  {
    header: "Name",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={patient.profilePicture}
            alt={patient.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-gray-900">{patient.name || '-'}</span>
      </div>
    )
  },
  {
    header: "Age",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">{calculateAge(patient.dob) || '-'}</span>
      </div>
    )
  },
  {
    header: "Gender",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">{patient.gender || '-'}</span>
      </div>
    )
  },
  {
    header: "Work",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">{patient.work ||'-'}</span>
      </div>
    )
  },
];


//-------------- Patient appointment colums --------------------

export const appointmentColumns = [
  {
    header: "Booked On",
    render: (appointment) =>
      new Date(appointment.createdAt).toLocaleDateString("en-IN"),
  },

  {
    header: "Doctor",
    render: (appointment) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={appointment.doctor?.profilePicture}
            alt={appointment.doctor?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {appointment.doctor?.name || "-"}
          </span>
          <span className="text-xs text-gray-500">
            {appointment.doctor?.specialization || "-"}
          </span>
        </div>
      </div>
    ),
  },


  {
    header: "Appointment Date",
    render: (appointment) =>
      new Date(appointment.appointmentDate).toLocaleDateString("en-IN"),
  },

  {
    header: "Time",
    render: (appointment) => (
      <span className="font-semibold text-gray-900">
        {appointment.timeSlot || "-"}
      </span>
    ),
  },

  {
    header: "Status",
    render: (appointment) => {
      const statusStyles = {
        pending: "bg-amber-100 text-amber-700",
        confirmed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
        completed: "bg-blue-100 text-blue-700",
      };

      return (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            statusStyles[appointment.status] ||
            "bg-gray-100 text-gray-600"
          }`}
        >
          {appointment.status || "-"}
        </span>
      );
    },
  },
];
