import mongoose from "mongoose";
import Doctor from "../../models/doctor.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Appointment from "../../models/appointments.model.js";
import Payment from "../../models/payments.model.js";
import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import Patient from "../../models/patient.model.js";
import { getIO } from "../../socket.js";
import {Notification} from '../../models/notification.model.js'
import { createConsultation } from "../../services/consultationService.js";

//-------------- Get booking info ----------------
export const getBookingInfo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const doctor = await Doctor.findById(id).lean();

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (doctor.isBlocked || doctor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Doctor not available for booking",
      });
    }

    // -------- Extract Services --------
    const services = doctor.services.map((service) => ({
      serviceType: service.serviceType,
      fees: service.fees,
    }));

    // -------- Get ALL availability documents --------
    const availabilityDocs = await DoctorAvailability.find({
      doctorId: doctor._id,
    }).lean();

    // -------- Format for frontend --------
    const availability = availabilityDocs
      .map((doc) => {
        const freeSlots = doc.slots
          .filter((slot) => !slot.isBooked)
          .map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
          }));

        return {
          date: doc.date,
          slots: freeSlots,
        };
      })
      .filter((doc) => doc.slots.length > 0);
    const bookingInfo = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      specialty: doctor.professionalInfo?.specializations?.[0] || "",
      services,
      availability,
      profileImage: doctor.profilePicture,
    };

    return res.status(200).json({
      success: true,
      bookingInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//------------------------ Book Appointment -----------------------
export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      time,
      reason,
      notes,
      serviceType,
      orderId,
      paymentMethod,
    } = req.body;
    const patientId = req.user.id;

    const doctor = await Doctor.findById(doctorId).select("email name");
    const patient = await Patient.findById(patientId).select("email name");

    // ---------------- Validation ----------------
    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const appointmentDate = new Date(date);
    let payment;

    //--------------- Check razorpay payment Verification --------------
    payment = await Payment.findOne({
      orderId: orderId.razorpay_order_id || orderId,
      patient: patientId,
      status: "verified",
    });

    if (!payment) {
      return res.status(403).json({
        success: false,
        message: "Payment not verified",
      });
    }

    // ---------------- Update availability ----------------
    const availabilityUpdate = await mongoose
      .model("DoctorAvailability")
      .findOneAndUpdate(
        {
          doctorId,
          date: appointmentDate,
          "slots.startTime": time,
          "slots.isBooked": false,
        },
        {
          $set: {
            "slots.$.isBooked": true,
          },
        },
        { new: true },
      );

    if (!availabilityUpdate) {
      return res.status(409).json({
        success: false,
        message: "Time slot already booked or unavailable",
      });
    }

    //------------------ update appointment status ------------
    const appointment = await Appointment.findByIdAndUpdate(
      payment?.appointment._id,
      { status: "confirmed" },
      { new: true },
    );

    //------------- Create Consultation ------------
    const consultation = await createConsultation({
      appointmentId:appointment._id
    })

    // ---------- Patient Email ----------
    const patientMailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: patient.email,
      subject: "Appointment Confirmation",
      html: emailTemplate({
        title: "Appointment Booked Successfully",
        subtitle: "Your appointment is confirmed",
        body: `
      <p>Hello <strong>${patient.name}</strong>,</p>
      <p>Your appointment has been successfully booked.</p>

      <p><strong>Doctor:</strong> ${doctor.name}</p>
      <p><strong>Date:</strong> ${appointment.appointmentDate.toDateString()}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>
      <p><strong>Service:</strong> ${appointment.serviceType}</p>
    `,
        highlightText: `Appointment #${appointment._id.toString().slice(-6)} confirmed`,
        highlightType: "success",
      }),
    };

    // ---------- Doctor Email ----------
    const doctorMailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: doctor.email,
      subject: "New Appointment Booked",
      html: emailTemplate({
        title: "New Appointment Scheduled",
        subtitle: "A patient has booked a consultation",
        body: `
      <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
      <p>A new appointment has been booked.</p>

      <p><strong>Patient:</strong> ${patient.name}</p>
      <p><strong>Date:</strong> ${appointment.appointmentDate.toDateString()}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>
      <p><strong>Service:</strong> ${appointment.serviceType}</p>
    `,
        highlightText: `Appointment #${appointment._id.toString().slice(-6)} scheduled`,
        highlightType: "info",
      }),
    };

    // ---------- Send Emails ----------
    try {
      await Promise.all([
        sendEmail(patientMailOptions),
        sendEmail(doctorMailOptions),
      ]);
    } catch (error) {
      console.log("Email sending error:", error);
    }

    //---------- notifications ------------------
  
    const io = getIO();
    
    const patientNotification = await Notification.create({
      title:'Appointment Confirmed',
      message:`Your appointment with Dr. ${doctor.name} has been confrimed`,
      recipient:patientId,
      role:'patient',
      read:false,
    })

    io.to(patientId).emit('notification:new',patientNotification)

    const doctorNotification = await Notification.create({
      title:'Appointment Booked',
      message:`You have a new appointment with ${patient.name}`,
      recipient:doctorId,
      role:'doctor',
      read:false
    })

    io.to(doctorId).emit('notification:new',doctorNotification)

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
};

//------------------ Get all appointments ------------------

export const getAllAppointments = async (req, res) => {
  try {
    const { id } = req.user;
    const appointments = await Appointment.find({ patient: id })
    .sort({createdAt:-1})
    .populate(
      "doctor",
      "name profilePicture professionalInfo.specializations",
    );
    res.status(200).json({
      success: true,
      message: "Appointments loaded successfully",
      appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//------------------ Get single appointment ------------------
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: patientId,
    })
      .populate(
        "doctor",
        "name profilePicture professionalInfo.specializations",
      )
      .populate("patient", "name email")
      .populate('consultation',"_id status")


    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const cancelAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    const patientId = req?.user?.id;
    const doctorId = appointment?.doctor;

    const doctor = await Doctor.findById(doctorId).select("email name");
    const patient = await Patient.findById(patientId).select("email name");


    if (!id) {
      throw new Error("Appointment ID is required");
    }

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.patient.toString() !== patientId) {
      throw new Error("Unauthorized action");
    }

    if (appointment.status === "completed") {
      throw new Error("Completed appointment cannot be cancelled");
    }

    if (appointment.status === "cancelled") {
      throw new Error("Appointment already cancelled");
    }

    // -------------------  24 Hour Restriction -------------------
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const [hours, minutes] = appointment.timeSlot.split(":");
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeDifference = appointmentDateTime - now;

    let refundPercentage;

    const hoursLeft = timeDifference / (1000 * 60 * 60);

    if (hoursLeft > 24) {
      refundPercentage = 1; // 100%
    } else if (hoursLeft > 6) {
      refundPercentage = 0.8; // 80%
    } else if (hoursLeft > 2) {
      refundPercentage = 0.5; // 50%
    } else {
      throw new Error(
        "Appointment cannot be cancelled within 2 hours of consultation",
      );
    }

    // -------------------  Update Appointment -------------------
    appointment.status = "cancelled";
    appointment.cancelledBy = "patient";
    appointment.cancellationReason = "Patient cancelled";

    await appointment.save({ session });

    // -------------------  Free the Slot -------------------
    await DoctorAvailability.updateOne(
      {
        doctorId: appointment.doctor,
        date: appointment.appointmentDate,
        "slots.startTime": appointment.timeSlot,
        "slots.isBooked": true,
      },
      {
        $set: { "slots.$.isBooked": false },
      },
      { session },
    );

    //-------------- Initiate refund --------------------
    const payment = await Payment.findOne({ appointment: appointment._id });

    if (payment && payment.status !== "refunded") {
      //--------------- 5% platform fee deduction ----------------
      const platformFee = payment.amount * 0.05;
      const refundAmount = (payment.amount - platformFee)*refundPercentage;

      let wallet = await Wallet.findOne({
        userId: appointment.patient,
        role: "patient",
      });

      if (!wallet) {
        wallet = new Wallet({
          userId: appointment.patient,
          role: "patient",
          balance: 0,
        });
      }

      wallet.balance += refundAmount;
      await wallet.save({ session });

      await Transaction.create(
        [
          {
            wallet: wallet._id,
            type: "credit",
            amount: refundAmount,
            referenceType: "refund",
            referenceId: payment._id,
            notes: `Refund (${refundPercentage * 100}%), platformFee deduction 5% for cancelled appointment #${appointment._id.toString().slice(-6)}`,
          },
        ],
        { session },
      );

      payment.status = "refunded";
      await payment.save({ session });
    }

    await session.commitTransaction();
    session.endSession();


    //---------------- Email and notificaitons ---------------

     // ---------- Patient Email ----------
    const patientMailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: patient.email,
      subject: "Appointment Cancellation",
      html: emailTemplate({
        title: "Appointment Cancelled",
        subtitle: `Your appointment with ${doctor.name} has been cancelled`,
        body: `
      <p>Hello <strong>${patient.name}</strong>,</p>
      <p>You've cancelled your appointment with ${doctor.name}.</p>

      <p><strong>Doctor:</strong> ${doctor.name}</p>
      <p><strong>Date:</strong> ${appointment.appointmentDate.toDateString()}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>
      <p><strong>Service:</strong> ${appointment.serviceType}</p>
    `,
        highlightText: `Appointment #${appointment._id.toString().slice(-6)} cancelled`,
        highlightType: "info",
      }),
    };

    // ---------- Doctor Email ----------
    const doctorMailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: doctor.email,
      subject: "Appointment Cancellation",
      html: emailTemplate({
        title: "Appointment cancelled",
        subtitle: "A patient cancelled appointment",
        body: `
      <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
      <p>Your appointment with ${patient.name} has been cancelled by patient.</p>

      <p><strong>Patient:</strong> ${patient.name}</p>
      <p><strong>Date:</strong> ${appointment.appointmentDate.toDateString()}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>
      <p><strong>Service:</strong> ${appointment.serviceType}</p>
    `,
        highlightText: `Appointment #${appointment._id.toString().slice(-6)} cancelled`,
        highlightType: "info",
      }),
    };

    // ---------- Send Emails ----------
    try {
      await Promise.all([
        sendEmail(patientMailOptions),
        sendEmail(doctorMailOptions),
      ]);
    } catch (error) {
      console.log("Email sending error:", error);
    }

    //---------- notifications ------------------
  
    const io = getIO();
    
    const patientNotification = await Notification.create({
      title:'Appointment Cancelled',
      message:`You've cancelled your appointment with Dr. ${doctor.name}`,
      recipient:patientId,
      role:'patient',
      read:false,
    })

    io.to(patientId).emit('notification:new',patientNotification)

    console.log(typeof doctorId)

    const doctorNotification = await Notification.create({
      title:'Appointment Cancelled',
      message:`Your appointment with  ${patient.name} has been cancelled by the patient.` ,
      recipient:doctorId,
      role:'doctor',
      read:false
    })

    io.to(doctorId.toString()).emit('notification:new',doctorNotification)



    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully (5% platform fee deducted)",
      appointment,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Cancel Appointment (Patient) Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel appointment",
    });
  }
};
