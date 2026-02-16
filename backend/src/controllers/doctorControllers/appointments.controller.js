import Appointment from "../../models/appointments.model.js";

//---------------- Get all appointments --------------
export const getAllAppointments = async (req,res) =>{
    try {
        const {id} = req.user;
        const appointments = await Appointment.find({doctor:id}).populate('patient','name profilePicture gender')

        res.status(200).json({
            success:true,
            message:'Appointments loaded successfully',
            appointments
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Server error'
        })
    }
}