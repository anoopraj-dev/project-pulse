import Alert from "../../models/alert.model.js";
import SupportTicket from "../../models/supportTicket.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import Transaction from "../../models/transaction.model.js";
import Settlement from "../../models/settlement.model.js";
import { Notification } from "../../models/notification.model.js";

import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
//------------- Get admin dashboard stats -------------
export const getAdminDashboardService = async () => {
  const [doctorCount, patientCount] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
  ]);

  const pendingDoctorsApproval = await Doctor.find({ status: "pending" })
    .select("name professionalInfo.specializations createdAt profilePicture")
    .sort({ createdAt: -1 });

  return {
    doctorCount,
    patientCount,
    pendingDoctorsApproval,
  };
};

//-------------- Get pending doctor profile -------------
export const getPendingDoctorProfileService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).select("-password");
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
};

//--------------- Get doctor documents -------------
export const getDoctorDocumentsService = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");
  return doctor;
};

//---------------- Get admin notifications -------------
export const getAdminNotificationsService = async () => {
  const notifications = await Notification.find({ role: "admin" }).sort({
    createdAt: -1,
  });
  return notifications;
};

export const dashboardCountsService = async () => {
  const [
    doctorCount,
    patientCount,
    appointmentCount,
    settlementAgg,
    refundAgg,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Appointment.countDocuments(),

    // ---------------- SETTLEMENTS (platform fee + payouts not needed for profit) ----------------
    Settlement.aggregate([
      {
        $match: {
          status: "processed",
        },
      },
      {
        $group: {
          _id: null,
          platformFee: { $sum: "$platformFee" },
        },
      },
    ]),

    // ---------------- REFUNDS (for penalty calculation) ----------------
    Transaction.aggregate([
      {
        $match: {
          referenceType: "refund",
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "referenceId",
          foreignField: "_id",
          as: "payment",
        },
      },
      { $unwind: "$payment" },
      {
        $group: {
          _id: null,
          refunded: { $sum: "$amount" },
          original: { $sum: "$payment.amount" },
        },
      },
    ]),
  ]);

  const platformFee = settlementAgg[0]?.platformFee || 0;
  const refunded = refundAgg[0]?.refunded || 0;
  const original = refundAgg[0]?.original || 0;

  const penalty = Math.max(original - refunded, 0);
  const profit = platformFee + penalty;

  return {
    doctorCount,
    patientCount,
    appointmentCount,
    revenue: profit / 100,
  };
};

//----------------- REVENUE CHART SERVICE -----------------
export const revenueOverviewService = async (range = "week") => {
  const now = new Date();
  let startDate = new Date();

  // ---------------- TIME RANGE ----------------
  if (range === "day") {
    startDate.setDate(now.getDate() - 1);
  } else if (range === "week") {
    startDate.setDate(now.getDate() - 6);
  } else if (range === "month") {
    startDate.setMonth(now.getMonth() - 1);
  } else if (range === "year") {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  // ---------------- GROUP KEY ----------------
  const groupFormat =
    range === "year"
      ? { $month: "$createdAt" }
      : range === "month"
        ? { $dayOfMonth: "$createdAt" }
        : { $dayOfWeek: "$createdAt" };

  const labelMap =
    range === "year"
      ? [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      : range === "month"
        ? Array.from({ length: 31 }, (_, i) => (i + 1).toString())
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ---------------- PAYMENTS ----------------
  const payments = await Payment.aggregate([
    {
      $match: {
        status: "verified",
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupFormat,
        gross: { $sum: "$amount" },
      },
    },
  ]);

  // ---------------- SETTLEMENTS ----------------
  const settlements = await Settlement.aggregate([
    {
      $match: {
        status: "processed",
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupFormat,
        platformFee: { $sum: "$platformFee" },
        payouts: { $sum: "$doctorPayout" },
      },
    },
  ]);

  // ---------------- REFUNDS ----------------
  const refunds = await Transaction.aggregate([
    {
      $match: {
        referenceType: "refund",
        createdAt: { $gte: startDate },
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "referenceId",
        foreignField: "_id",
        as: "payment",
      },
    },
    { $unwind: "$payment" },
    {
      $group: {
        _id: groupFormat,
        refunded: { $sum: "$amount" },
        original: { $sum: "$payment.amount" },
      },
    },
  ]);

  // ---------------- FORMAT ----------------
  const formatted = labelMap.map((label, index) => {
    const key =
      range === "year" ? index + 1 : range === "month" ? index + 1 : index + 1;

    const pay = payments.find((p) => p._id === key);
    const set = settlements.find((s) => s._id === key);
    const ref = refunds.find((r) => r._id === key);

    const gross = pay?.gross || 0;
    const platformFee = set?.platformFee || 0;
    const payouts = set?.payouts || 0;

    const refunded = ref?.refunded || 0;
    const original = ref?.original || 0;

    // ---------------- ORIGINAL LOGIC RESTORED ----------------
    const penalty = Math.max(original - refunded, 0);
    const profit = platformFee + penalty;

    const systemBalance = gross - payouts - refunded;

    return {
      label,

      gross: gross / 100,
      platformFee: platformFee / 100,
      payouts: payouts / 100,
      refunds: refunded / 100,

      profit: profit / 100,
      systemBalance: systemBalance / 100,
    };
  });

  return formatted;
};

//-------------- USER GROWTH CHART ----------------
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const userGrowthService = async () => {
  try {
    const patientAgg = await Patient.aggregate([
      {
        $addFields: {
          createdAt: {
            $cond: [
              { $eq: [{ $type: "$createdAt" }, "string"] },
              { $toDate: "$createdAt" },
              "$createdAt",
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const doctorAgg = await Doctor.aggregate([
      {
        $addFields: {
          createdAt: {
            $cond: [
              { $eq: [{ $type: "$createdAt" }, "string"] },
              { $toDate: "$createdAt" },
              "$createdAt",
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = monthNames.map((month, index) => {
      const monthIndex = index + 1;

      const patientTotal = patientAgg
        .filter((p) => p._id.month === monthIndex)
        .reduce((sum, p) => sum + p.count, 0);

      const doctorTotal = doctorAgg
        .filter((d) => d._id.month === monthIndex)
        .reduce((sum, d) => sum + d.count, 0);

      return {
        label: month,
        patients: patientTotal,
        doctors: doctorTotal,
      };
    });

    return result;
  } catch (error) {
    console.error("User growth service error:", error);
    throw new Error(error.message);
  }
};

export const getDashboardSupportDataService = async () => {
  // ---------------- ALERTS ----------------
  const alerts = await Alert.find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(2)
    .lean();

  const formattedAlerts = alerts.map((a) => ({
    _id: a._id,
    title: a.title,
    message: a.description,
    type: "system",
    priority: a.severity || "low",
    createdAt: a.createdAt,
  }));

  // ---------------- SUPPORT TICKETS ----------------
  const tickets = await SupportTicket.find()
    .sort({ createdAt: -1 })
    .limit(2)
    .populate("doctorId", "name")
    .populate("patientId", "name email")
    .lean();

  const formattedTickets = tickets.map((t) => ({
    _id: t._id,
    title: t.title,
    message: t.message,
    type: t.type,
    priority: t.priority,
    status: t.status,
    createdAt: t.createdAt,
    user: t.patientId?.name || t.doctorId?.name || "Unknown",
  }));

  return {
    alerts: formattedAlerts,
    tickets: formattedTickets,
  };
};
