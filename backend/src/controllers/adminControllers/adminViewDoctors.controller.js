import Doctor from "../../models/doctor.model.js";
import { Notification } from "../../models/notification.model.js";
import { emailTemplate } from "../../utils/emailTemplate.js";
import { getIO } from "../../socket.js";
import { sendEmail } from "../../config/nodemailer.js";

//---------------- APPROVE DOCTORS ----------------------

export const approveDoctorsRequest = async (req, res) => {
  const io = getIO()
  const { id } = req.params;

  try {
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { status: "approved", resubmissionApproved:false },
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

     const notification = await Notification.create({
      title: "Profile Approved",
      message: `Your profile has been reviewed and approved by admin`,
      recipient: doctor._id,
      role: "doctor",
      read: false,
    });

    io.to(doctor._id.toString()).emit("notification:new", notification);

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
  const {reason} = req.body;
  const io = getIO();
  try {
    const doctor = await Doctor.findByIdAndUpdate(id,{
      status:'rejected',
      rejectionReason: reason,
      resubmissionRequested:false

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
          highlightText: doctor.rejectionReason,
          highlightType: "error",
        }),
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    const notification = await Notification.create({
      title:'Profile Rejected',
      message:'Your profile has been reviewed and rejected by admin',
      recipient:doctor._id,
      role:'doctor'
    })

    io.to(doctor._id.toString()).emit('notification:new',notification)

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


//---------------------- BLOCK DOCTORS PROFILE ----------------
export const blockDoctorProfile = async (req,res) => {
  const {id} = req.params;
  const {reason} = req.body;
  const io = getIO();
  try {
    const doctor = await Doctor.findByIdAndUpdate(id,{
      status:'blocked',
      isBlocked:true,
      blockedReason: reason
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
        subject: "Profile Blocked – Action Required",
        html: emailTemplate({
          title: "Profile Blocked",
          subtitle: "Doctor Profile Review",
          body: `
            <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
            <p>Your profile has been blocked for violating <strong>terms and conditions</strong>.</p>
            <p>Please contact the admin for revoking your profile status.</p>
          `,
          highlightText: doctor.blockedReason,
          highlightType: "error",
        }),
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }


    const notification = await Notification.create({
      title:'Profile Blocked',
      message:'Your profile has been blocked',
      recipient:doctor._id,
      role:'doctor'
    })

    io.to(doctor._id.toString()).emit('notification:new',notification)

    return res.status(200).json({
      success: true,
      message: `Blocked profile ${doctor.name}`,
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

//--------------- UNBLOCK DOCTOR PROFILE ---------------
export const unblockDoctorProfile = async (req,res) => {
  const io = getIO()
  const {id} = req.params;
  try {
    const doctor = await Doctor.findByIdAndUpdate(id,{
      status:'pending',
      isBlocked:'false',
      blockedReason:''
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
        subject: "Profile Blocked – Action Required",
        html: emailTemplate({
          title: "Profile Blocked",
          subtitle: "Doctor Profile Review",
          body: `
            <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
            <p>Your profile has been <strong>unblocked</strong>.</p>
            <p>Please wait for admins approval.</p>
          `,
          highlightText: 'Profile unblocked and waiting admins approval',
          highlightType: "success",
        }),
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    const notification = await Notification.create({
          title:'Profile Unlocked',
          message:'Your profile has been unblocked',
          recipient:doctor._id,
          role:'doctor'
        })
    
        io.to(doctor._id.toString()).emit('notification:new',notification)

    return res.status(200).json({
      success: true,
      message: `Blocked profile ${doctor.name}`,
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


//----------------- REVOKE PROFILE STATUS ---------------
export const revokeDoctorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const io = getIO();

    // ---------- Validation ----------
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowedStatuses = ["pending", "approved", "rejected", "blocked","resubmit"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // ---------- Find Doctor ----------
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // ---------- Update ----------
    doctor.status = status;
    doctor.resubmission = true;

    // Reset flags if needed
    if (status !== "rejected") doctor.rejectionReason = "";
    if (status !== "blocked") doctor.blockedReason = "";

    await doctor.save();

    // ---------- Optional Email ----------
    try {
      const mailOptions = {
        from: `"PULSE360" <${process.env.GMAIL_USER}>`,
        to: doctor.email,
        subject: "Profile Status Updated",
        html: emailTemplate({
          title: "Profile Status Updated",
          subtitle: "Doctor Profile Review",
          body: `
            <p>Hello <strong>Dr. ${doctor.name}</strong>,</p>
            <p>Your profile status has been updated to:</p>
            <p><strong>${status.toUpperCase()}</strong></p>
          `,
          highlightText: `Current Status: ${status}`,
          highlightType: status === "approved" ? "success" : "warning",
        }),
      };

      await sendEmail(mailOptions);
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }

    const notification = await Notification.create({
          title:'Profile Status Revoked',
          message:'Your profile resubmission request has been approved',
          recipient:doctor._id,
          role:'doctor'
        })
    
        io.to(doctor._id.toString()).emit('notification:new',notification)

    // ---------- Response ----------
    return res.status(200).json({
      success: true,
      message: `Doctor status updated to ${status}`,
      user: doctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


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