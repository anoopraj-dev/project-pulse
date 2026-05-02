import {
  getBookingInfoService,
  bookAppointmentService,
  getAllAppointmentsService,
  getAppointmentByIdService,
  cancelAppointmentService,
} from "../../services/patient/appointment.service.js";

//-------------- Get booking info ----------------
export const getBookingInfo = async (req, res) => {
  try {
    const bookingInfo = await getBookingInfoService(req.params.id);

    res.status(200).json({ success: true, bookingInfo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

//---------------- Book Appointment ----------------
export const bookAppointment = async (req, res) => {
  try {
    console.log("BOOK APPOINTMENT PAYLOAD:", req.body); 
    const { appointment } = await bookAppointmentService(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message });
  }
};

//---------------- Get all appointments ----------------
export const getAllAppointments = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 5));

    const appointments = await getAllAppointmentsService(
      req.user.id,
      {
        page: pageNum,
        limit: limitNum,
        status,
      }
    );

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    logger.error("Get appointments failed", {
      userId: req.user?.id,
      error: err.message,
    });

    next(err); 
  }
};

//---------------- Get appointment by ID ----------------
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await getAppointmentByIdService(
      req.params.id,
      req.user.id,
    );

    res.status(200).json({ success: true, appointment });
  } catch (err) {
    res
      .status(err.message.includes("Invalid") ? 400 : 404)
      .json({ success: false, message: err.message });
  }
};

//---------------- Cancel appointment ----------------
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await cancelAppointmentService(
      req.params.id,
      req.user.id,
    );
    
    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
