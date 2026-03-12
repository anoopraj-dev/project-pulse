//-------------- Doctors Table config ----------------
export const doctorColumns = [
  {
    header: "Joined",
    render: (doc) => new Date(doc.createdAt).toLocaleDateString("en-IN"),
  },
  {
    header: "Name",
    render: (doc) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={doc.profilePicture || '/profile.png'}
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
          0,
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
            src={patient.profilePicture || '/profile.png'}
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
    header: "Age",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">
          {calculateAge(patient.dob) || "-"}
        </span>
      </div>
    ),
  },
  {
    header: "Gender",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">
          {patient.gender || "-"}
        </span>
      </div>
    ),
  },
  {
    header: "Work",
    render: (patient) => (
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-900">
          {patient.work || "-"}
        </span>
      </div>
    ),
  },
];

//-------------- Patient appointment colums --------------------

export const patientAppointmentColumns = [
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
            src={appointment.doctor?.profilePicture || '/profile.png'}
            alt={appointment.doctor?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {appointment.doctor?.name || "-"}
          </span>
          <span className="text-xs text-gray-500">
            {appointment.doctor?.professionalInfo?.specializations[0] || "-"}
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
        confirmed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
        completed: "bg-blue-100 text-blue-700",
      };

      return (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            statusStyles[appointment.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {appointment.status || "-"}
        </span>
      );
    },
  },
];

//----------------- Doctor Appointments Columns -------------

export const doctorAppointmentColumns = [
  {
    header: "Booked On",
    render: (appointment) =>
      new Date(appointment.createdAt).toLocaleDateString("en-IN"),
  },

  {
    header: "Patient",
    render: (appointment) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={appointment.patient?.profilePicture || '/profile.png'}
            alt={appointment.patient?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {appointment.patient?.name || "-"}
          </span>
          <span className="text-xs text-gray-500">
            {appointment.patient?.gender || "-"}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Consultation",
    render: (appointment) => appointment.serviceType || "-",
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
            statusStyles[appointment.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {appointment.status || "-"}
        </span>
      );
    },
  },
];


//-------------------------- Admin appointment columns ----------------
export const adminAppointmentColumns = [
  {
    header: "Booked On",
    render: (appointment) =>
      new Date(appointment.createdAt).toLocaleDateString("en-IN"),
  },

  {
    header: "Patient",
    render: (appointment) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={appointment.patient?.profilePicture || "/profile.png"}
            alt={appointment.patient?.name || "Patient"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {appointment.patient?.name || "-"}
          </span>
          <span className="text-xs text-gray-500">
            {appointment.patient?.gender || "-"}
          </span>
        </div>
      </div>
    ),
  },

 {
  header: "Doctor",
  render: (appointment) => (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
        <img
          src={appointment.doctor?.profilePicture || "/profile.png"}
          alt={appointment.doctor?.name || "Doctor"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">
          {appointment.doctor?.name || "-"}
        </span>
        <span className="text-xs text-gray-500">
          {appointment.doctor?.professionalInfo?.specializations?.[0] || "-"}
        </span>
      </div>
    </div>
  ),
},


  {
    header: "Consultation",
    render: (appointment) => appointment.serviceType || "-",
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
        expired: "bg-gray-100 text-gray-600",
      };

      // Show proper label mapping if needed
      const statusLabelMap = {
        pending: "Pending",
        confirmed: "Confirmed",
        cancelled: "Cancelled",
        completed: "Completed",
        expired: "Expired",
      };

      return (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            statusStyles[appointment.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {statusLabelMap[appointment.status] || "-"}
        </span>
      );
    },
  },
];


//-------------------------- Patient payment columns ----------------
export const patientPaymentColumns = [
  {
    header: "Paid On",
    render: (payment) =>
      new Date(payment.createdAt).toLocaleDateString("en-IN"),
  },

  {
    header: "Doctor",
    render: (payment) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={payment.doctor?.profilePicture || "/profile.png"}
            alt={payment.doctor?.name || "Doctor"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {payment.doctor?.name || "-"}
          </span>
          <span className="text-xs text-gray-500">
            {payment.doctor?.professionalInfo?.specializations?.[0] || "-"}
          </span>
        </div>
      </div>
    ),
  },

  {
  header: "Amount",
  render: (payment) => (
    <span className="font-semibold text-gray-900">
      ₹{((payment.amount || 0) / 100).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  ),
},


  {
    header: "Status",
    render: (payment) => {
      const statusStyles = {
        created: "bg-amber-100 text-amber-700",
        verified: "bg-emerald-100 text-emerald-700",
        failed: "bg-red-100 text-red-700",
        cancelled:'bg-yellow-100 text-yellow-700'
      };

      const statusLabelMap = {
        created: "Pending",
        verified: "Successful",
        failed: "Failed",
        cancelled:'Cancelled'
      };

      return (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            statusStyles[payment.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {statusLabelMap[payment.status] || "-"}
        </span>
      );
    },
  },

  {
    header: "Payment Method",
    render: (payment) => payment.method || "-",
  },

  {
    header: "Order ID",
    render: (payment) => payment.orderId || "-",
  },
  
];

//------------------------ Doctor Payment Columns -------------
export const doctorPaymentColumns = [
  {
    header: "Paid On",
    render: (payment) =>
      new Date(payment.createdAt).toLocaleDateString("en-IN"),
  },

  {
    header: "Patient",
    render: (payment) => (
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img
            src={payment.patient?.profilePicture || "/profile.png"}
            alt={payment.patient?.name || "Doctor"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900">
            {payment.patient?.name || "-"}
          </span>
        </div>
      </div>
    ),
  },

  {
  header: "Amount",
  render: (payment) => (
    <span className="font-semibold text-gray-900">
      ₹{((payment.amount || 0) / 100).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  ),
},


  {
    header: "Status",
    render: (payment) => {
      const statusStyles = {
        created: "bg-amber-100 text-amber-700",
        verified: "bg-emerald-100 text-emerald-700",
        failed: "bg-red-100 text-red-700",
      };

      const statusLabelMap = {
        created: "Pending",
        verified: "Successful",
        failed: "Failed",
      };

      return (
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            statusStyles[payment.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {statusLabelMap[payment.status] || "-"}
        </span>
      );
    },
  },

  {
    header: "Payment Method",
    render: (payment) => payment.method || "-",
  },

  {
    header: "Order ID",
    render: (payment) => payment.orderId || "-",
  },
];

