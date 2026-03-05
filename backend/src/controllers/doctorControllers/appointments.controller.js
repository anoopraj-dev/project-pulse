import Appointment from "../../models/appointments.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Wallet from "../../models/wallet.model.js";
import Payment from "../../models/payments.model.js";
import Transaction from "../../models/transaction.model.js";
import mongoose from "mongoose";

//---------------- Get all appointments --------------
export const getAllAppointments = async (req, res) => {
  try {
    const { id } = req.user;

    //----------------- Fetch all appointments for this doctor ----------------
    const appointments = await Appointment.find({ doctor: id });

    const now = new Date();

    //--------------- Find IDs of appointments that should be expired ----------
    const expiredIds = appointments
      .filter((appt) => {
        if (!appt.time) return false;

        // Only expire pending appointments
        if (appt.status !== "pending") return false;

        const [hours, minutes] = appt.time.split(":");
        const apptDateTime = new Date(appt.appointmentDate);
        apptDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        return apptDateTime < now;
      })
      .map((appt) => appt._id);

    //----------------- Mark them as expired -------------
    if (expiredIds.length > 0) {
      await Appointment.updateMany(
        { _id: { $in: expiredIds } },
        { $set: { status: "expired" } },
      );
    }

    //------------- Fetch updated appointments --------------
    const updatedAppointments = await Appointment.find({ doctor: id })
      .populate("patient", "name profilePicture gender")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      message: "Appointments loaded successfully",
      appointments: updatedAppointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDoctorAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id; // logged-in doctor

    // -------- Validate ID --------
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID",
      });
    }

    // -------- Find appointment belonging to doctor --------
    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctorId,
    }).populate("patient", "name email profilePicture");

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
    const { reason } = req.body;
    const doctorId = req.user?.id;

    if (!id) {
      throw new Error("Appointment ID is required");
    }

    if (!reason || !reason.trim()) {
      throw new Error("Cancellation reason is required");
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctor.toString() !== doctorId) {
      throw new Error("Unauthorized action");
    }

    //  Prevent invalid state changes
    if (appointment.status === "completed") {
      throw new Error("Completed appointment cannot be cancelled");
    }

    if (appointment.status === "cancelled") {
      throw new Error("Appointment already cancelled");
    }

    // -------------------  Update Appointment -------------------
    appointment.status = "cancelled";
    appointment.cancelledBy = "doctor";
    appointment.cancellationReason = reason.trim();

    await appointment.save({ session });

    // -------------------  Free the Slot -------------------
    await DoctorAvailability.updateOne(
      {
        doctor: appointment.doctor,
        date: appointment.appointmentDate,
        "slots.time": appointment.timeSlot,
      },
      {
        $set: { "slots.$.isBooked": false },
      },
      { session },
    );

    //-------------- Initiate refund --------------------
    const payment = await Payment.findOne({ appointment: appointment._id });

    if (payment && payment.status !== "refunded") {
      let wallet = await Wallet.findOne({userId: appointment.patient,role:'patient'});

      if (!wallet) {
        wallet = new Wallet({
          userId: appointment.patient,
          role: "patient",
          balance: 0,
        });
      }

      //---------- add refund amount -----------
      wallet.balance += payment.amount;
      await wallet.save({ session });

      //------------- create transaction record --------
      await Transaction.create(
        [
          {
            wallet: wallet._id,
            type: "credit",
            amount: payment.amount,
            referenceType: "refund",
            referenceId: payment._id,
            notes: `Refund for cancelled appointment #${appointment.id.toString()}`,
          },
        ],
        { session },
      );
      

      //--------- update payment status -----------
      payment.status = "refunded";
      await payment.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
    });
  }
};
