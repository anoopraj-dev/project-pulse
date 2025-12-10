import Doctor from "../../models/doctorModels/doctor.model.js";
import Patient from "../../models/patient.model.js";


//------------- GET ADMIN DASHBORD---------------

export const getAdminDashboard = async (req, res) => {
  console.log("route hit");
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

//---------------- APPROVE DOCTORS ----------------------

export const approveDoctorsRequest = async(req,res) =>{
  const {id} = req.params;
  try {
    const doctor = await Doctor.findByIdAndUpdate(id,{
      status:'approved'
    });
    if(doctor) return res.status(200).json({
      success: true,
      message:`Approved Dr ${doctor.name}`
    })
      return res.status(404).json({
        success: false,
        message:'Doctor not found!'
      })
    
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:'Internal server error'
    })
  }
}

// ----------------------- REJECT DOCTORS -----------------

export const rejectDoctorsRequest = async (req,res) => {
  const {id} = req.params;
  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if(doctor){
      return res.status(200).json({
        success:true,
        message:`Rejected request from ${doctor.name}`
      })
    }
    
    return res.status(404).jsonn({
      success:false,
      message:'Rejection failed! Try again'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message:'Server Error'
    })
  }
}
