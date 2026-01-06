const PatientStatusBanner = ({
  status, 
  variant = "patient", 
}) => {
  if (!status || status === "active") return null;

  const copy = {
    patient: {
      blocked:
        "Your account has been blocked. Please contact support for further assistance.",
    },
    admin: {
      blocked:
  
        "This patient account is blocked and cannot access the platform.",
    },
  };

  const statusConfig = {
    blocked: {
      bg: "bg-red-600",
      text: "text-white",
      title: "Account Blocked",
      message: copy[variant].blocked,
    },
  };

  const current = statusConfig[status];
  if (!current) return null;

  return (
    <div
      className={`w-full mt-4 px-6 py-4 rounded-xl flex flex-col items-center ${current.bg} ${current.text}`}
    >
      <h2 className="font-semibold text-lg">{current.title}</h2>
      <p className="text-sm mt-1 text-center">{current.message}</p>
    </div>
  );
};

export default PatientStatusBanner;
