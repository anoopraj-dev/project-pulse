import crypto from "crypto";
import Consultation from "../../models/consultation.model.js";
import Appointment from "../../models/appointments.model.js";
import { getIO } from "../../socket.js";


//----------------- Join consultation --------------------

export const joinConsultation = async (req, res) => {
  try {
    console.log(req.params);
    const { id: consultationId } = req.params;
    const userId = req.user.id;

    console.log("consultationId", consultationId);

    //------------ find consultation & appointment ------------
    const consultation = await Consultation.findById(consultationId).populate(
      "appointment",
      "appointmentDate",
    )
    .populate('patient', 'name profilePicture')
    .populate('doctor','name profilePicture');

    if (!consultation) {
      return res.status(400).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (consultation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Consultation cancelled",
      });
    }

    if (consultation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Consultation already completed",
      });
    }
    console.log('consultation.patient',consultation.patient)
    //------------ Authorization Check ------------
    if (
      ![
        consultation.patient._id.toString(),
        consultation.doctor._id.toString(),
      ].includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //------------- Time Validation -------------
    const now = new Date();

    // const appointmentTime = consultation.appointment.appointmentDate;

    // //----------- Allow to join 5 min early (buffer) ----------
    // const earlyJoinTime = new Date(appointmentTime);
    // earlyJoinTime.setMinutes(earlyJoinTime.getMinutes() - 5);

    // if (now < earlyJoinTime || now > consultation.tokenExpiresAt) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Consultation not active or expired",
    //   });
    // }

    //------------ Identify & update participants -------
    const isPatient = consultation.patient.toString() === userId;
    const isDoctor = consultation.doctor.toString() === userId;

    if (!consultation.participants) {
      consultation.participants = {
        patientJoined: false,
        doctorJoined: false,
      };
    }

    if (isPatient) consultation.participants.patientJoined = true;
    if (isDoctor) consultation.participants.doctorJoined = true;

    //------ Start session if both participant joined ----------
    if (
      consultation.participants.patientJoined &&
      consultation.participants.doctorJoined &&
      consultation.status === "scheduled"
    ) {
      consultation.status = "in-progress";
      consultation.startTime = now;
    }

    await consultation.save();

    const io = getIO();

    io.to(consultationId).emit("consultation:status-update", {
      status: "in-progress",
    });

    const participants = {
      patient:{
        name:consultation.patient.name,
        profilePicture:consultation.patient.profilePicture,
      },
      doctor:{
        name:consultation.doctor.name,
        profilePicture:consultation.doctor.profilePicture 
      }
    }

    //------------- Response ------------
    res.status(200).json({
      success: true,
      message: "Joined consultation successfully",
      consultation: {
        consultationId: consultation._id,
        sessionId: consultation.sessionId,
        status: consultation.status,
        participants
      },
    });
  } catch (error) {
    console.log("Join Consultation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//----------------- End Consultation -----------------

export const endConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const userId = req.user.id;

    const consultation = await Consultation.findById(consulationId);

    if (!consultation) {
      return res.status(400).json({
        success: false,
        message: "Consultation not found",
      });
    }

    //------------- Prevent invalid status --------
    if (consultation.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Consultation cancelled",
      });
    }

    if (consultation.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Consultation already completed",
      });
    }

    //-------------- Authorization check ---------------
    if (
      ![
        consultation.patient.toString(),
        consultation.doctor.toString(),
      ].includes(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //----------- Set end time ---------------
    const now = new Date();
    consultation.endTime = now;
    consultation.status = "completed";

    await consultation.save();

    //--------------- Calculate duration -------------
    let duration = 0;

    if (consultation.startTime) {
      duration = (consultation.endTime - consultation.startTime) / (1000 * 60);
    }

    //--------------- bussiness logic here ------

    //--------- response -------------
    res.status(200).json({
      success: true,
      message: "Consultation ended",
      data: {
        consultationId: consultation._id,
        duration: Math.round(duration),
      },
    });
  } catch (error) {
    console.log("End consultation Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
