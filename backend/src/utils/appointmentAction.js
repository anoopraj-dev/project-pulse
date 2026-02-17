export const isAppointmentActionAllowed = (appointment) => {
  if (!appointment?.appointmentDate || !appointment?.timeSlot) {
    return false;
  }

  const datePart = new Date(appointment.appointmentDate)
    .toISOString()
    .split("T")[0];

  // Construct full datetime
  const appointmentDateTime = new Date(
    `${datePart}T${appointment.timeSlot}:00`,
  );

  const now = new Date();

  const diffInMs = appointmentDateTime.getTime() - now.getTime();

  const diffInHours = diffInMs / (1000 * 60 * 60);

  return diffInHours >= 24;
};
