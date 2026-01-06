import Patient from "../../models/patient.model.js"
import { sendEmail } from "../../config/nodemailer.js";
import { emailTemplate } from "../../utils/emailTemplate.js";

//------------------- VIEW ALL PATIENTS ---------------------
export const getAllPatients = async (req,res) =>{
    try {
        const patients = await Patient.find();
        if(!patients) return res.status(404).json({
            sucess:false,
            message:'Data not found'
        })
        return res.status(200).json({
            success:true,
            message:'Data loaded successfully',
            users:patients

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:'Internal server error'})
    }
}


// ----------------- VIEW PATIENT PROFILE -------------------
export const getPatientProfile = async (req, res) => {
  const { id } = req.params;

  try {

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data loaded successfully",
      user: patient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//----------------- BLOCK PATIENT ----------------
export const blockPatientProfile = async (req, res) => {
  try {
  
    const { id } = req.params;
    const {reason }= req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.status = "blocked";
    patient.blockedReason= reason;
    await patient.save();

    //-------------- SEND MAIL --------------
    try {
          const mailOptions = {
            from: `"PULSE360" <${process.env.GMAIL_USER}>`,
            to: patient.email,
            subject: "Profile Status Updated",
            html: emailTemplate({
              title: "Account Blocked",
              subtitle: "Patient Profile Review",
              body: `
                <p>Hello <strong> ${patient.name}</strong>,</p>
                <p>Your profile status has been temperorily blocked:</p>
                <p> for <strong>${patient.blockedReason}</strong></p>
                <p> Kindly contact the support for further action </p>
              `,
              highlightText: `Current Status: ${patient.status}`,
              highlightType: patient.status === "active" ? "success" : "error",
            }),
          };
    
          await sendEmail(mailOptions);
        } catch (emailError) {
          console.error("Email failed:", emailError);
        }
    

    return res.status(200).json({
      success: true,
      message: "Patient blocked successfully",
      user: patient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//-------------- UNBLOCK PATIENT PROFILE -------------
export const unblockPatientProfile = async (req, res) => {

  try {
    const { id } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.status = "active";
    patient.blockedReason='';
    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient unblocked successfully",
      user: patient,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
