const DoctorStatusBanner = ({
  approvalStatus,
  rejectionReason,
  blockedReason,
  variant = "doctor", // default
}) => {
  if (!approvalStatus || approvalStatus === "approved") return null;

  const copy = {
    doctor: {
      pending:
        "Your profile is currently under review by the admin. You will be listed once approved.",
      rejected:
        rejectionReason || "Your profile was rejected by the admin.",
      blocked:
        blockedReason ||
        "Your account has been blocked. Please contact support.",
    },
    admin: {
      pending:
        "This doctor's profile is currently under review and not visible publicly.",
      rejected:
        rejectionReason || "This profile was rejected by the admin.",
      blocked:
        blockedReason ||
        "This account is blocked and cannot access the platform.",
    },
  };

  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      title:
        variant === "admin"
          ? "Profile Pending Review"
          : "Profile Under Review",
      message: copy[variant].pending,
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      title: "Profile Rejected",
      message: copy[variant].rejected,
    },
    blocked: {
      bg: "bg-gray-900",
      text: "text-white",
      title: "Account Blocked",
      message: copy[variant].blocked,
    },
  };

  const current = statusConfig[approvalStatus];
  if (!current) return null;

  return (
    <div
      className={`w-full  mt-4 px-6 py-4 rounded-xl flex flex-col justify-center items-center ${current.bg} ${current.text}`}
    >
      <h2 className="font-semibold text-lg">{current.title}</h2>
      <p className="text-sm mt-1">{current.message}</p>
    </div>
  );
};

export default DoctorStatusBanner;
