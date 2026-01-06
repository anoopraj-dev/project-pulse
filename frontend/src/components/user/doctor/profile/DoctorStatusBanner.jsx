const DoctorStatusBanner = ({
  approvalStatus,
  rejectionReason,
  blockedReason,
  submissionCount,
  variant = "doctor",
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
      resubmit:
        'You can now edit your profile and request for a profile review',
      resubmission:
        "Your profile has been re-submitted with suggested changes. Please wait for admins review",
      requestedResubmission:
        "You have requested profile resubmission. Please wait for admin review.",
    },
    admin: {
      pending:
        "This doctor's profile is currently under review and not visible publicly.",
      rejected:
        rejectionReason || "This profile was rejected by the admin.",
      blocked:
        blockedReason ||
        "This account is blocked and cannot access the platform.",
      resubmit: 
        'This account has been sent for re-submission',
      resubmission:
        `This profile has been resubmiited with suggested changes. Resubmissions = ${submissionCount}`,
      requestedResubmission:
        'This profile has been sent for resubmission'
    },
  };



  const statusConfig = {
    pending: {
      bg: "bg-yellow-500",
      text: "text-white",
      title:
        variant === "admin"
          ? "Profile Pending Review"
          : "Profile Under Review",
      message: copy[variant].pending,
    },
    rejected: {
      bg: "bg-orange-500",
      text: "text-white",
      title: "Profile Rejected",
      message: copy[variant].rejected,
    },
    blocked: {
      bg: "bg-red-600",
      text: "text-white",
      title: "Account Blocked",
      message: copy[variant].blocked,
    },
    resubmit:{
      bg: 'bg-cyan-700',
      text:'text-white',
      title:'Account Re-Submission Required',
      message: copy[variant].resubmit
    },
    resubmission: {
      bg:'bg-gray-700',
      text:'text-white',
      title:'Profile Resubmission',
      message:copy[variant].resubmission
    },
    requestedResubmission: {
      bg: "bg-blue-500",
      text: "text-white",
      title: "Profile Resubmission Requested",
      message: copy[variant].requestedResubmission,
    },
  };

  const current = statusConfig[approvalStatus];
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

export default DoctorStatusBanner;
