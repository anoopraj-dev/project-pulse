import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import { Notification } from "../../models/notification.model.js";

import Appointment from "../../models/appointments.model.js";
import Payment from '../../models/payments.model.js'
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
  const [doctorCount, patientCount, appointmentCount, revenueAgg] =
    await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),

      Payment.aggregate([
        {
          $match: {
            status: {$in:["verified"]},
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]); 

  return {
    doctorCount,
    patientCount,
    appointmentCount,
    revenue: revenueAgg[0]?.total/100 || 0,
  };
};


//----------------- REVENUE CHART SERVICE --------------
export const revenueOverviewService = async () =>{
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate()-6);

  const revenueData = await Payment.aggregate([
  {
    $match: {
      status: { $in: ["verified"] }, 
    },
  },
  {
    $addFields: {
      createdAtDate: { $toDate: "$createdAt" }, 
    },
  },
  {
    $match: {
      createdAtDate: { $gte: last7Days },
    },
  },
  {
    $group: {
      _id: { $dayOfWeek: "$createdAtDate" },
      total: { $sum: "$amount" },
    },
  },
]);

  const daysMap = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const formatted = daysMap.map((day,index)=>{
    const found = revenueData.find(
      (item) => item._id === index +1
    )

    return {
      label:day,
      revenue:found? found.total/100:0,
    }
  })

  return formatted
}

//-------------- USER GROWTH CHART ----------------
const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
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
        .filter(p => p._id.month === monthIndex)
        .reduce((sum, p) => sum + p.count, 0);

      const doctorTotal = doctorAgg
        .filter(d => d._id.month === monthIndex)
        .reduce((sum, d) => sum + d.count, 0);

      return {
        label: month,
        patients: patientTotal,
        doctors: doctorTotal,
      };
    });

    return result;
  } catch (error) {
    console.log("User growth service error:", error);
    throw new Error(error.message);
  }
};