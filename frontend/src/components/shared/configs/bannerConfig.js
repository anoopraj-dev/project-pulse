export const pageBannerConfig = {

    //------------- patient appointments --------------
  patientAppointments: {
    icon: "mdi:calendar-heart",
    roleLabel: "Patient",
    pageLabel: "Appointments",

    title: "Manage Appointments",

    description:
      "Book new appointments or review your upcoming and past consultations.",

    activeTabLabel: "Active tab",
    loadingText: "Loading appointments...",
  },

  //--------- patient - doctor profile -----------
   patientDoctorProfile: {
    icon: "mdi:stethoscope",
    roleLabel: "Patient",
    pageLabel: "Doctor Profile",

    title: "Doctor Details",

    description:
      "View the doctor's qualifications, experience, and availability before booking an appointment.",

    loadingText: "Loading doctor profile...",
  },

  //------------- patient - doctors view ------
  patientDoctors: {
    icon: "mdi:account-heart-outline",

    roleLabel: "Find a doctor",

    title: "Available Doctors",

    description:
      "Browse verified doctors and compare consultation charges before booking.",

    stats: {
      label: "doctors available",
      indicatorColor: "bg-emerald-500",
    },

    loadingText: "Loading doctors…",
  },

  //--------- patient profile view -self ----------

  patientProfile: {
    icon: "mdi:account-circle-outline",

    roleLabel: "Patient",
    pageLabel: "Profile",

    title: "Your Profile",

    description:
      "View and manage your personal information, contact details, and profile picture.",

    activeTabLabel: "Section",

    loadingText: "Loading profile...",
  },

  //--------------- Patient messages ----------------

   patientMessages: {
    icon: "mdi:message-text-outline",

    roleLabel: "Patient",
    pageLabel: "Messages",

    title: "Messages",

    description:
      "Send messages & review previous conversations, stay connected.",

    activeTabLabel: "Inbox",

    loadingText: "Loading messages...",
  },

  //------------- Patient Dashboard -----------
   patientDashboard: {
    icon: "mdi:view-dashboard-outline",

    roleLabel: "Patient",
    pageLabel: "Dashboard",

    title: "Health Overview",

    description:
      "Quick overview of your activities and upcoming events.",

    activeTabLabel: "Section",

    loadingText: "Loading dashboard...",
  },

  //------------- Patient payments --------------
  patientPayments: {
    icon: "mdi:credit-card-outline",

    roleLabel: "Patient",
    pageLabel: "Payments",

    title: "Payment History",

    description:
      "Review your consultation payments, download receipts, and retry failed transactions.",

    activeTabLabel: "Active tab",

    loadingText: "Loading payments...",
  },

  //------------------ Patient Wallet ---------------
  patientWallet: {
    icon: "mdi:wallet-outline",

    roleLabel: "Patient",
    pageLabel: "Wallet",

    title: "My Wallet",

    description:
      "Manage your wallet balance, add funds securely, and track all your healthcare payment transactions.",

    loadingText: "Loading wallet details...",
  },

};