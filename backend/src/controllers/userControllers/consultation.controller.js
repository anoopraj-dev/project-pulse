import crypto from "crypto";
import Consultation from "../../models/consultation.model.js";
import Appointment from "../../models/appointments.model.js";

//--------------- Generate Consultaion Session -------------
export const generateConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id;

    //-------------- Find the appointment ----------
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    //------ check authorization -------
    if (
      ![appointment.patient.toString(), appointment.doctor.toString()].includes(
        userId,
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Unathorized",
      });
    }

    //------------ Prevent duplicate consultation -------------
    const existing = await Consultation.findOne({
      appointment: appointmentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Consultation already exists",
        consultationId: existing._id,
      });
    }

    //--------------- Generate sessionId + token ------------
    const sessionId = crypto.randomUUID();

    //-------- Token expiration ----------------------
    const tokenExpiresAt = new Date(appointment.appointmentDate);
    tokenExpiresAt.setMinutes(
      tokenExpiresAt.getMinutes() + (appointment.duration || 30) + 10,
    );

    //-------- Create consultation -------------------
    const consultation = new Consultation({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: appointment.doctor,
      sessionId,
      token: crypto.randomBytes(16).toString("hex"),
      tokenExpiresAt,
      status: "scheduled",
    });

    await consultation.save();

    //------------- Resoponse -----------------------
    res.status(201).json({
      success: true,
      message: "Consultation created successfully",
      consultation: {
        consultationId: consultation._id,
        sessionId: consultation.sessionId,
      },
    });
  } catch (error) {
    console.log("Generate consultation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//----------------- Join consultation --------------------

export const joinConsultation = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const userId = req.user.id;

    //------------ find consultation & appointment ------------
    const consultation = await Consultation.findById(consultationId).populate(
      "appointment",
      "appointmentDate",
    );

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

    //------------ Authorization Check ------------
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

    //------------- Time Validation -------------
    const now = new Date();

    const appointmentTime = consultation.appointment.appointmentDate;

    //----------- Allow to join 5 min early (buffer) ----------
    const earlyJoinTime = new Date(appointmentTime);
    earlyJoinTime.setMinutes(earlyJoinTime.getMinutes() - 5);

    if (now < earlyJoinTime || now > consultation.tokenExpiresAt) {
      return res.status(403).json({
        success: false,
        message: "Consultation not active or expired",
      });
    }

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

    //------------- Response ------------
    res.status(200).json({
      success: true,
      message: "Joined consultation successfully",
      consultation: {
        consultationId: consultation._id,
        sessionId: consultation.sessionId,
        status: consultation.status,
        participants: consultation.participants,
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

export const endConsultation = async (req,res) => {
    try {
        const {consultationId} = req.params;
        const userId = req.user.id;

        const consultation = await Consultation.findById(consulationId);

        if(!consultation) {
            return res.status(400).json({
                success:false,
                message:'Consultation not found'
            })
        }

        //------------- Prevent invalid status --------
        if(consultation.status === 'cancelled'){
            return res.status(400).json({
                success:false,
                message:'Consultation cancelled'
            })
        }

        if(consultation.status === 'completed'){
            return res.status(400).json({
                success:false,
                message:'Consultation already completed'
            })
        }

        //-------------- Authorization check ---------------
        if(![
            consultation.patient.toString(),
            consultation.doctor.toString()
        ].includes(userId)){
            return res.status(403).json({
                success:false,
                message:'Unauthorized'
            })
        }

        //----------- Set end time ---------------
        const now = new Date();
        consultation.endTime = now;
        consultation.status= 'completed'

        await consultation.save();

        //--------------- Calculate duration -------------
        let duration = 0;

        if(consultation.startTime){
            duration = (consultation.endTime - consultation.startTime)/(1000*60);

        }

        //--------------- bussiness logic here ------

        //--------- response -------------
        res.status(200).json({
            success:true,
            message:'Consultation ended',
            data:{
                consultationId: consultation._id,
                duration:Math.round(duration),
            }
        })
    } catch (error) {
        console.log('End consultation Error:',error);
        res.status(500).json({
            success:false,
            message:'Server error'
        })
    }
}