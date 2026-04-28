// //-------------- Doctors Table config ----------------
// export const doctorColumns = [
//   {
//     header: "Joined",
//     render: (doc) => new Date(doc.createdAt).toLocaleDateString("en-IN"),
//   },
//   {
//     header: "Name",
//     render: (doc) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={doc.profilePicture || "/profile.png"}
//             alt={doc.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <span className="font-semibold text-gray-900">{doc.name}</span>
//       </div>
//     ),
//   },
//   {
//     header: "Specialization",
//     render: (doc) => doc.professionalInfo?.specializations?.[0] || "—",
//   },
//   {
//     header: "Experience",
//     render: (doc) => {
//       const years =
//         doc.professionalInfo?.experience?.reduce(
//           (total, curr) => total + curr.years,
//           0,
//         ) || 0;

//       return (
//         <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
//           {years} yrs
//         </span>
//       );
//     },
//     align: "center",
//   },
//   {
//     header: "Qualification",
//     render: (doc) => doc.professionalInfo?.qualifications?.[0] || "—",
//   },
// ];

// //-------------- Patients Table Config --------------------
// //------- helper ------------
// const calculateAge = (dob) => {
//   if (!dob) return "—";

//   const birthDate = new Date(dob);
//   const today = new Date();

//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();

//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }

//   return age;
// };

// export const patientColumns = [
//   {
//     header: "Joined",
//     render: (patient) =>
//       new Date(patient.createdAt).toLocaleDateString("en-IN"),
//   },
//   {
//     header: "Name",
//     render: (patient) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={patient.profilePicture || "/profile.png"}
//             alt={patient.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <span className="font-semibold text-gray-900">
//           {patient.name || "-"}
//         </span>
//       </div>
//     ),
//   },

//   {
//     header: "Gender",
//     render: (patient) => (
//       <div className="flex items-center gap-4">
//         <span className="font-semibold text-gray-900">
//           {patient.gender || "-"}
//         </span>
//       </div>
//     ),
//   },
//   {
//     header: "Work",
//     render: (patient) => (
//       <div className="flex items-center gap-4">
//         <span className="font-semibold text-gray-900">
//           {patient.work || "-"}
//         </span>
//       </div>
//     ),
//   },
// ];

// //-------------- Patient appointment colums --------------------

// export const patientAppointmentColumns = [
//   {
//     header: "Booked On",
//     render: (appointment) =>
//       new Date(appointment.createdAt).toLocaleDateString("en-IN"),
//   },

//   {
//     header: "Doctor",
//     render: (appointment) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={appointment.doctor?.profilePicture || "/profile.png"}
//             alt={appointment.doctor?.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-900">
//             {appointment.doctor?.name || "-"}
//           </span>
//           <span className="text-xs text-gray-500">
//             {appointment.doctor?.professionalInfo?.specializations[0] || "-"}
//           </span>
//         </div>
//       </div>
//     ),
//   },

//  {
//   header: "Appointment Date",
//   render: (appointment) => {
//     const dt = new Date(appointment.appointmentDateTime);
//     return isNaN(dt) ? "-" : dt.toLocaleDateString("en-IN");
//   },
// },

// {
//   header: "Time",
//   render: (appointment) => {
//     const dt = new Date(appointment.appointmentDateTime);
//     return isNaN(dt)
//       ? "-"
//       : dt.toLocaleTimeString("en-IN", {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//   },
// },

//   {
//     header: "Status",
//     render: (appointment) => {
//       const statusStyles = {
//         confirmed: "bg-green-100 text-green-700",
//         cancelled: "bg-red-100 text-red-700",
//         completed: "bg-blue-100 text-blue-700",
//       };

//       return (
//         <span
//           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//             statusStyles[appointment.status] || "bg-gray-100 text-gray-600"
//           }`}
//         >
//           {appointment.status || "-"}
//         </span>
//       );
//     },
//   },
// ];

// //----------------- Doctor Appointments Columns -------------

// export const doctorAppointmentColumns = [
//   {
//     header: "Booked On",
//     render: (appointment) =>
//       new Date(appointment.createdAt).toLocaleDateString("en-IN"),
//   },

//   {
//     header: "Patient",
//     render: (appointment) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={appointment.patient?.profilePicture || "/profile.png"}
//             alt={appointment.patient?.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-900">
//             {appointment.patient?.name || "-"}
//           </span>
//           <span className="text-xs text-gray-500">
//             {appointment.patient?.gender || "-"}
//           </span>
//         </div>
//       </div>
//     ),
//   },
//   {
//     header: "Consultation",
//     render: (appointment) => appointment.serviceType || "-",
//   },

//   {
//     header: "Appointment Date",
//     render: (appointment) =>
//       new Date(appointment.appointmentDate).toLocaleDateString("en-IN"),
//   },

//   {
//     header: "Time",
//     render: (appointment) => (
//       <span className="font-semibold text-gray-900">
//         {appointment.timeSlot || "-"}
//       </span>
//     ),
//   },

//   {
//     header: "Status",
//     render: (appointment) => {
//       const statusStyles = {
//         pending: "bg-amber-100 text-amber-700",
//         confirmed: "bg-emerald-100 text-emerald-700",
//         cancelled: "bg-red-100 text-red-700",
//         completed: "bg-blue-100 text-blue-700",
//       };

//       return (
//         <span
//           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//             statusStyles[appointment.status] || "bg-gray-100 text-gray-600"
//           }`}
//         >
//           {appointment.status || "-"}
//         </span>
//       );
//     },
//   },
// ];

// //-------------------------- Admin appointment columns ----------------
// export const adminAppointmentColumns = [
//   {
//     header: "Booked On",
//     render: (appointment) =>
//       new Date(appointment.createdAt).toLocaleDateString("en-IN"),
//   },

//   {
//     header: "Patient",
//     render: (appointment) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={appointment.patient?.profilePicture || "/profile.png"}
//             alt={appointment.patient?.name || "Patient"}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-900">
//             {appointment.patient?.name || "-"}
//           </span>
//           <span className="text-xs text-gray-500">
//             {appointment.patient?.work || "-"}
//           </span>
//         </div>
//       </div>
//     ),
//   },

//   {
//     header: "Doctor",
//     render: (appointment) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={appointment.doctor?.profilePicture || "/profile.png"}
//             alt={appointment.doctor?.name || "Doctor"}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-900">
//             {appointment.doctor?.name || "-"}
//           </span>
//           <span className="text-xs text-gray-500">
//             {appointment.doctor?.professionalInfo?.specializations?.[0] || "-"}
//           </span>
//         </div>
//       </div>
//     ),
//   },

//   {
//     header: "Consultation",
//     render: (appointment) => appointment.serviceType || "-",
//   },

//   {
//     header: "Appointment Date",
//     render: (appointment) =>
//       new Date(appointment.appointmentDate).toLocaleDateString("en-IN"),
//   },

//   {
//     header: "Appointment Time",
//     render: (appointment) => (
//       <span className="font-semibold text-gray-900">
//         {appointment.timeSlot || "-"}
//       </span>
//     ),
//   },

//   {
//     header: "Status",
//     render: (appointment) => {
//       const statusStyles = {
//         pending: "bg-amber-100 text-amber-700",
//         confirmed: "bg-emerald-100 text-emerald-700",
//         cancelled: "bg-red-100 text-red-700",
//         completed: "bg-blue-100 text-blue-700",
//         expired: "bg-gray-100 text-gray-600",
//       };

//       // Show proper label mapping if needed
//       const statusLabelMap = {
//         pending: "Pending",
//         confirmed: "Confirmed",
//         cancelled: "Cancelled",
//         completed: "Completed",
//         expired: "Expired",
//       };

//       return (
//         <span
//           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//             statusStyles[appointment.status] || "bg-gray-100 text-gray-600"
//           }`}
//         >
//           {statusLabelMap[appointment.status] || "-"}
//         </span>
//       );
//     },
//   },
// ];

// //-------------------------- Patient payment columns ----------------
// export const patientPaymentColumns = [
//   {
//     header: "Paid On",
//     render: (payment) =>
//       new Date(payment.createdAt).toLocaleDateString("en-IN"),
//   },

//   {
//     header: "Doctor",
//     render: (payment) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={payment.doctor?.profilePicture || "/profile.png"}
//             alt={payment.doctor?.name || "Doctor"}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-900">
//             {payment.doctor?.name || "-"}
//           </span>
//           <span className="text-xs text-gray-500">
//             {payment.doctor?.professionalInfo?.specializations?.[0] || "-"}
//           </span>
//         </div>
//       </div>
//     ),
//   },

//   {
//     header: "Amount",
//     render: (payment) => (
//       <span className="font-semibold text-gray-900">
//         ₹
//         {((payment.amount || 0) / 100).toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}
//       </span>
//     ),
//   },

//   {
//     header: "Status",
//     render: (payment) => {
//       const statusStyles = {
//         created: "bg-amber-100 text-amber-700",
//         verified: "bg-emerald-100 text-emerald-700",
//         failed: "bg-red-100 text-red-700",
//         cancelled: "bg-yellow-100 text-yellow-700",
//       };

//       const statusLabelMap = {
//         created: "Pending",
//         verified: "Successful",
//         failed: "Failed",
//         cancelled: "Cancelled",
//         refunded: "Refunded",
//       };

//       return (
//         <span
//           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//             statusStyles[payment.status] || "bg-gray-100 text-gray-600"
//           }`}
//         >
//           {statusLabelMap[payment.status] || "-"}
//         </span>
//       );
//     },
//   },

//   {
//     header: "Payment Method",
//     render: (payment) => payment.method || "-",
//   },

//   {
//     header: "Order ID",
//     render: (payment) => payment.orderId || "-",
//   },
// ];


// export const doctorPaymentColumns = [
//   {
//     header: "Date",
//     render: (item) =>
//       new Date(item.processedAt || item.createdAt).toLocaleDateString("en-IN"),
//   },

//   {
//     header: "Patient",
//     render: (item) => (
//       <div className="flex items-center gap-4">
//         <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100">
//           <img
//             src={item.patient?.profilePicture || "/profile.png"}
//             alt={item.patient?.name || "Patient"}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="flex flex-col">
//           <span className="font-semibold text-gray-900">
//             {item.patient?.name || "-"}
//           </span>
//         </div>
//       </div>
//     ),
//   },

//   {
//     header: "Earnings",
//     render: (item) => (
//       <span className="font-semibold text-gray-900">
//         ₹
//         {((item.amount || 0) / 100).toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}
//       </span>
//     ),
//   },

//   {
//   header: "Outcome",
//   render: (item) => {
//     const typeMap = {
//       completed: "Completed",
//       cancelled: "Cancelled",
//       expired: "Expired",
//       doctor_only_present: "Patient Absent",
//       patient_only_present: "Doctor Absent",
//       no_show: "Both Absent",
//     };

//     return (
//       <span className="text-xs font-medium text-gray-600">
//         {typeMap[item.outcome] || "-"}
//       </span>
//     );
//   },
// },

//   {
//     header: "Settlement Status",
//     render: (item) => {
//       const statusStyles = {
//         pending: "bg-amber-100 text-amber-700",
//         processed: "bg-emerald-100 text-emerald-700",
//         failed: "bg-red-100 text-red-700",
//       };

//       const statusLabelMap = {
//         pending: "Pending",
//         processed: "Settled",
//         failed: "Failed",
//       };

//       return (
//         <span
//           className={`px-3 py-1 text-xs font-semibold rounded-full ${
//             statusStyles[item.settlementStatus] ||
//             "bg-gray-100 text-gray-600"
//           }`}
//         >
//           {statusLabelMap[item.settlementStatus] || "-"}
//         </span>
//       );
//     },
//   },

//   {
//     header: "Platform Fee",
//     render: (item) => (
//       <span className="text-gray-600 text-sm">
//         ₹
//         {((item.platformFee || 0) / 100).toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//         })}
//       </span>
//     ),
//   },

//   {
//     header: "Refund",
//     render: (item) => (
//       <span className="text-red-500 text-sm font-medium">
//         ₹
//         {((item.patientRefund || 0) / 100).toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//         })}
//       </span>
//     ),
//   },
// ];



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