import Payment from "../../models/payments.model.js";
import paginate from "../../utils/paginate.js";

export const getPatientPaymentHistoryService = async (
  patientId,
  { page = 1, limit = 5, status }
) => {
  const query = { patient: patientId };

  if (status && status !== "all") {
    query.status = status;
  }

  return await paginate({
    model: Payment,
    query,
    page,
    limit,
    sort: { createdAt: -1 },
    populate: [
      {
        path: "doctor",
        select: "name profilePicture professionalInfo.specializations",
      },
      {
        path: "appointment",
        select: "appointmentDate timeSlot serviceType status",
      },
    ],
  });
};