import mongoose from 'mongoose';
import Payment from '../../models/payments.model.js'
import Appointment from '../../models/appointments.model.js';
import Consultation from '../../models/consultation.model.js'
import Review from '../../models/review.model.js'

export const doctorRevenueService = async (doctorId, range = '7d') => {
    const now = new Date();

    let startDate;

    switch (range) {
        case '30d':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;

        case '7d':
        default:
            startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const payments = await Payment.aggregate([
        {
            $match: {
                doctor: new mongoose.Types.ObjectId(doctorId),
                status: 'verified',
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dayOfWeek: '$createdAt' },
                amount: { $sum: '$amount' }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const dayMap = {
        1: 'Sun',
        2: 'Mon',
        3: 'Tue',
        4: 'Wed',
        5: 'Thu',
        6: 'Fri',
        7: 'Sat',
    };

    let runningTotal = 0;

    const chart = payments.map((p) => {
        runningTotal += p.amount;

        return {
            label: dayMap[p._id],
            daily: p.amount/100,
            cumulative: runningTotal,
        };
    });

    const totalRevenue = runningTotal/100;

    return {
        chart,
        totalRevenue,
    };
};

export const upcomingAppointmentService = async (doctorId, limit = 10) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointments = await Appointment.aggregate([
    {
      $match: {
        doctor: new mongoose.Types.ObjectId(doctorId),
        status: { $in: ['confirmed', 'pending', 'ongoing'] },
        appointmentDate: { $gte: today },
    
      },
    },
    {
      $lookup: {
        from: 'patients',
        localField: 'patient',
        foreignField: '_id',
        as: 'patient',
      },
    },
    {
      $unwind: {
        path: '$patient',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { appointmentDate: 1, timeSlot: 1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 1,
        name: '$patient.name',
        profilePicture: '$patient.profilePicture',
        serviceType: 1,
        reason: 1,
        timeSlot: 1,
        duration: 1,
        appointmentDate: 1,
        status: 1,
        type: {
          $concat: ['$serviceType', ' · ', '$reason'],
        },
        time: '$timeSlot',
      },
    },
  ]);

  console.log(doctorId)

  return appointments;
};


export const dashboardStatsService = async (doctorId) => {
  const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

  // ---------- Date Helpers ----------
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const endOfYesterday = new Date(startOfToday);
  endOfYesterday.setMilliseconds(-1);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  // ---------- Consultations ----------
  const todayConsultations = await Consultation.countDocuments({
    doctor: doctorObjectId,
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });

  const yesterdayConsultations = await Consultation.countDocuments({
    doctor: doctorObjectId,
    createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
  });

  const totalCompleted = await Consultation.countDocuments({
    doctor: doctorObjectId,
    status: "completed",
  });

  const completedThisWeek = await Consultation.countDocuments({
    doctor: doctorObjectId,
    status: "completed",
    createdAt: { $gte: startOfWeek },
  });

  // ---------- Appointments ----------
  const upcomingAppointments = await Appointment.countDocuments({
    doctor: doctorObjectId,
    status: { $in: ["confirmed", "ongoing"] },
    appointmentDate: { $gte: startOfToday },
  });

  const nextAppointment = await Appointment.findOne({
    doctor: doctorObjectId,
    status: { $in: ["confirmed", "ongoing"] },
    appointmentDate: { $gte: new Date() },
  })
    .sort({ appointmentDate: 1 })
    .lean();

  let nextAppointmentInMinutes = null;

  if (nextAppointment?.appointmentDate) {
    const diffMs =
      new Date(nextAppointment.appointmentDate) - new Date();
    nextAppointmentInMinutes = Math.max(
      0,
      Math.floor(diffMs / 60000)
    );
  }

  // ---------- Payments ----------
  const weeklyPayments = await Payment.aggregate([
    {
      $match: {
        doctor: doctorObjectId,
        status: "verified",
        createdAt: { $gte: startOfWeek },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const lastWeekPayments = await Payment.aggregate([
    {
      $match: {
        doctor: doctorObjectId,
        status: "verified",
        createdAt: {
          $gte: new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000),
          $lt: startOfWeek,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const weeklyEarnings = weeklyPayments[0]?.total/100|| 0;
  const lastWeekEarnings = lastWeekPayments[0]?.total/100 || 0;

  return {
    todayConsultations,
    yesterdayConsultations,

    upcomingAppointments,
    nextAppointmentInMinutes,

    totalCompleted,
    completedThisWeek,

    weeklyEarnings,
    lastWeekEarnings,
  };
};

export const recentPatientsService = async (doctorId) => {
  const patients = await Consultation.find({
    doctorId,
    status: "completed",
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .populate("patient", "name profilePicture work");

  return patients.map((a) => ({
    _id: a._id,
    name: a.patient?.name || "Unknown",
    profilePicture: a.patient?.profilePicture || null,
    detail: a.patient?.work,
    time:a.startTime
  }));
};


export const feedbackService = async (doctorId) => {
  const reviews = await Review.find({
    doctor: doctorId,
    rating: { $exists: true, $ne: null },
  })
    .sort({ createdAt: -1 })
    .populate("patient", "name profilePicture");

  const formattedReviews = reviews.map((r) => ({
    _id: r._id,
    name: r.patient?.name || "Unknown",
    profilePicture: r.patient?.profilePicture || null,
    rating: r.rating,
    text: r.review || "",
    date: r.createdAt,
  }));

  //  compute summary
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
      : 0;

  const breakdown = reviews.reduce(
    (acc, r) => {
      const rate = r.rating || 0;
      if (rate >= 1 && rate <= 5) acc[rate] += 1;
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  );

  return {
    data: formattedReviews,
    summary: {
      totalReviews,
      averageRating,
      breakdown,
    },
  };
};