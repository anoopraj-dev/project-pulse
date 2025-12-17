import Patient from "../../models/patient.model.js";
import Doctor from "../../models/doctorModels/doctor.model.js";
import Otp from "../../models/otps.model.js";
import { generateOtp } from "../../utils/otpGenerator.js";
import { sendEmail } from "../../config/nodemailer.js";
import bcrypt from "bcryptjs";


//------------------ VERIFY OTP CONTROLLER -------------------
export const verifyOtp = async (req, res) => {
  try {
    console.log('Session data:', req.session);

    if (!req.session || !req.session.OTP) {
      return res.status(400).json({ success: false, message: 'Session expired or OTP not generated' });
    }
    const { otp} = req.body;
    const {email,type,role} = req.session.OTP; 

    //------------ Check if OTP exists --------------------
    const savedOtp = await Otp.findOne({ email });
  
    if (!savedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found'
      });
    }

    //------------- Check if OTP expired -----------------------
    if (savedOtp.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired! Try again'
      });
    }

    // --------------- Check if OTP matches -------------------
    if (savedOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    await Otp.deleteOne({ email });

    // ---------------- check the type of otp --------------------
    if(type === 'emailVerification'){
    await Patient.findOneAndUpdate({ email }, { isVerified: true });
    await Doctor.findOneAndUpdate({ email }, { isVerified: true });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully!'
    });
    } else if (type === 'resetPassword'){

      req.session.emailInfo = {
        email,
        expiresAt: Date.now() + 5 * 60 * 1000,
        type
      }
      return res.status(200).json({
        success: true,
        message:'OTP verified. Set your new Password',
        type:'resetPassword'
      })
    } 

    

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};


// ------------------------- RESET PASSWORD CONTROLLER ---------------------
export const resetPassword = async (req, res) => {

  try {
    const { email, role,type } = req.body;

    console.log(email,role,type)

    const Model = role ==='doctor'? Doctor: Patient;
    const user = await Model.findOne({email})
    if(!user){
      console.error(`${role.charAt(0).toUpperCase()+role.slice(1)} not found`)
      return res.status(404).json({
        success:false,
        message: `${role.charAt(0).toUpperCase()+role.slice(1)} not found`
      })
    }

    //---------- generate otp ----------
    const otpCode = generateOtp();
    await Otp.create({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000) // 2 minutes
    });

    req.session.OTP = {
      email,
      type,
      role
    }

    //------------- send mail ------------------
    const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Email verification',
      text: `Hello , verify your email with this one-time password: ${otpCode}`
    };


    await sendEmail(mailOptions);

    await Otp.deleteOne({ email });


    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    })

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error sending OTP, try resending the email'
    });
  }

}
//---------------- Set new password---------------

export const setNewPassword =async (req,res) => {
  const {newPassword,confirmPassword} = req.body;
  const {email,role} = req.session.OTP;
  console.log(newPassword,confirmPassword)
  
 try {
   const Model = role === 'patient'? Patient:Doctor;
  const user = await Model.findOne({email});

  if(!user){
    return res.status(404).json({
      success: false,
      message: 'User not found!'
    })
  }

  if(newPassword !== confirmPassword){
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match'
    })
  }

  const hashedPassword = await bcrypt.hash(newPassword,10);

  user.password = hashedPassword;
  await user.save();

  return res.status(200).json({
  success: true,
  message: 'Password updated successfully!'
});

 } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
 }

}


//--------------- RESEND OTP CONTROLLER ---------------------

export const resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    console.log(email,type)

    if (!email || !type) {
      return res.status(400).json({
        success: false,
        message: "Email and verification type are required."
      });
    }

    //----------------- Generate a new OTP code --------------
    const otpCode = generateOtp();
    const otpRecord = await Otp.findOneAndUpdate(
      { email },
      { otp: otpCode, expiresAt: new Date(Date.now() + 2 * 60 * 1000) }, // 2 minutes expiration
      { new: true, upsert: true }
    );

    const mailOptions = {
      from: `"PULSE360" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Resend Email verification OTP',
      text: `Hello, your new OTP is ${otpCode}. It will expire in 2 minutes.`
    };

    // ----------------- Send email with new OTP ----------------
    await sendEmail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your email."
    });

  } catch (error) {
    console.error("Error in resendOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again."
    });
  }
};