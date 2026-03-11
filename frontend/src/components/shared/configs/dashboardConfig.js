export const ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  ADMIN: "admin",
};

// Each section has: id, component (string key), props to forward, gridSpan
export const dashboardSections = {
  [ROLES.PATIENT]: [
    { id: "welcome",        component: "WelcomeBanner",      gridSpan: "full" },
    { id: "stats",          component: "StatsRow",           gridSpan: "full",  props: { variant: "patient" } },
    { id: "upcoming",       component: "UpcomingAppointments", gridSpan: "half" },
    { id: "prescriptions",  component: "RecentPrescriptions", gridSpan: "half" },
    { id: "doctors",        component: "RecommendedDoctors",  gridSpan: "full" },
    { id: "health",         component: "HealthSummary",       gridSpan: "third" },
    { id: "activity",       component: "ActivityFeed",        gridSpan: "two-third" },
  ],

  [ROLES.DOCTOR]: [
    { id: "welcome",        component: "WelcomeBanner",      gridSpan: "full" },
    { id: "stats",          component: "StatsRow",           gridSpan: "full",  props: { variant: "doctor" } },
    { id: "schedule",       component: "TodaySchedule",      gridSpan: "half" },
    { id: "patients",       component: "PatientQueue",       gridSpan: "half" },
    { id: "earnings",       component: "EarningsChart",      gridSpan: "two-third" },
    { id: "reviews",        component: "RecentReviews",      gridSpan: "third" },
  ],

  [ROLES.ADMIN]: [
    { id: "welcome",        component: "WelcomeBanner",      gridSpan: "full" },
    { id: "stats",          component: "StatsRow",           gridSpan: "full",  props: { variant: "admin" } },
    { id: "users",          component: "UserGrowthChart",    gridSpan: "half" },
    { id: "approvals",      component: "PendingApprovals",   gridSpan: "half" },
    { id: "revenue",        component: "RevenueOverview",    gridSpan: "two-third" },
    { id: "alerts",         component: "SystemAlerts",       gridSpan: "third" },
  ],
};

// Stat cards per role
export const statsConfig = {
  patient: [
    { label: "Total Appointments", value: "24",   delta: "+3 this month",  icon: "mdi:calendar-check",     accent: "#0096C7" },
    { label: "Doctors Consulted",  value: "8",    delta: "+1 this week",   icon: "mdi:doctor",              accent: "#00B4D8" },
    { label: "Prescriptions",      value: "12",   delta: "2 active",       icon: "mdi:pill",                accent: "#48cae4" },
    { label: "Health Score",       value: "87%",  delta: "+5% this month", icon: "mdi:heart-pulse",         accent: "#10b981" },
  ],
  doctor: [
    { label: "Today's Patients",   value: "14",   delta: "3 pending",      icon: "mdi:account-group",       accent: "#0096C7" },
    { label: "Total Consultations",value: "1,284",delta: "+28 this week",  icon: "mdi:stethoscope",         accent: "#00B4D8" },
    { label: "Avg. Rating",        value: "4.9",  delta: "from 320 reviews",icon: "mdi:star",               accent: "#f59e0b" },
    { label: "Monthly Earnings",   value: "₹48k", delta: "+12% vs last",   icon: "mdi:currency-inr",        accent: "#10b981" },
  ],
  admin: [
    { label: "Total Users",        value: "52,400",delta: "+840 this week", icon: "mdi:account-multiple",   accent: "#0096C7" },
    { label: "Active Doctors",     value: "1,248", delta: "14 pending",     icon: "mdi:doctor",             accent: "#00B4D8" },
    { label: "Appointments Today", value: "3,720", delta: "+6% vs yesterday",icon: "mdi:calendar-clock",   accent: "#48cae4" },
    { label: "Platform Revenue",   value: "₹2.4M", delta: "+18% this month",icon: "mdi:chart-line",        accent: "#10b981" },
  ],
};
