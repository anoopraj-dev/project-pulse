import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { sendEmail } from "../../config/nodemailer.js";


//------------- GET ADMIN DASHBORD---------------

export const getAdminDashboard = async (req, res) => {
  try {
    const [doctorCount, patientCount] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
    ]);

    const pendingDoctorsApproval = await Doctor.find({ status: "pending" })
      .select("name professionalInfo.specializations createdAt profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      doctorCount,
      patientCount,
      pendingDoctorsApproval,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};

//-------------- REVIEW PENDING PROFILES -----------------

export const getPendingDoctorProfile = async (req, res) => {
  try {
    const id  = req.params.id;
    const doctor = await Doctor.findById(id).select('-password');
    if(!doctor) return res.status(400).json({
        success:false,
        message:'Doctor not found!'
    })
    else{
        return res.status(200).json({
            success:true,
            user: doctor
        })
    }
  } catch (error) {
    console.log(error)
  }
};

// --------------- GET DOCTOR DOCUMENTS ------------------
export const getDoctorDocuments = async(req,res) => {
  try {
    console.log('document route hit')
    const id = req.params.id;
    const doctor = await Doctor.findById(id);
    if(!doctor) return res.status(404).json({success:false, message:'Doctor not found!'})
    res.status(200).json({success: true, user : doctor })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:'Internal Server Error'
    })
  }
}

//---------------- APPROVE DOCTORS ----------------------

export const approveDoctorsRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found!",
      });
    }

    // -------- Send Approval Email --------
    try {
      const mailOptions = {
        from: `"PULSE360" <${process.env.GMAIL_USER}>`,
        to: doctor.email,
        subject: "Profile Approved – Welcome to Pulse360 ",
        html: emailTemplate({
          title: "Profile Approved",
          subtitle: "Doctor Profile Review",
          body: `
            <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
            <p>We are happy to inform you that your profile has been <strong>approved</strong>.</p>
            <p>You are now visible on the platform and can start receiving patient requests.</p>
          `,
          highlightText: "Your account is now active",
          highlightType: "success",
        }),
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error("Approval email failed:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: `Approved Dr ${doctor.name}`,
      user: doctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ----------------------- REJECT DOCTORS -----------------

export const rejectDoctorsRequest = async (req,res) => {
  const {id} = req.params;
  const {rejectionReason} = req.body;
  try {
    const doctor = await Doctor.findByIdAndUpdate(id,{
      status:'rejected'
    },
  {new : true});
    if(!doctor){
      return res.status(404).json({
        success:false,
        message:'Doctor not found!',
      })
    }
    
     try {
      const mailOptions = {
        from: `"PULSE360" <${process.env.GMAIL_USER}>`,
        to: doctor.email,
        subject: "Profile Rejected – Action Required",
        html: emailTemplate({
          title: "Profile Rejected",
          subtitle: "Doctor Profile Review",
          body: `
            <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
            <p>Your profile has been reviewed and unfortunately was <strong>rejected</strong>.</p>
            <p>Please check the reason below and update your profile accordingly.</p>
          `,
          highlightText: rejectionReason,
          highlightType: "error",
        }),
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    return res.status(200).json({
      success: true,
      message: `Rejected request from ${doctor.name}`,
      user: doctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:'Server Error'
    })
  }
}

//--------------- GET ALL DOCTORS --------------
export const getAllDoctors = async(req,res) => {
  try {
    const doctors = await Doctor.find().select('-password')
    if(!doctors) return res.status(404).json({success:false, message:'Data not found'});
    return res.status(200).json({success:true, message:'Data loaded successfully', users:doctors})
  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false, message:'Internal server error'})
  }
}