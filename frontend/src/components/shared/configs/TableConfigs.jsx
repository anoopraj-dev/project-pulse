
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
