import Admin from "../../models/admin.model.js";
import Doctor from "../../models/doctorModels/doctor.model.js";
import Patient from "../../models/patient.model.js";


export const getCurrentUserInfo = async (req, res) => {
    try {
        const { id, email, role } = req.user;

        let user;
        if (role === 'admin') {
            user = await Admin.findOne({ email }).select('-password');
        } else if (role === 'doctor') {
            user = await Doctor.findOne({ email }).select('-password');
        } else {
            user = await Patient.findOne({ email }).select('-password');
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            })
        }

        return res.status(200).json({
            success: true,
            user: {
                id,
                name: user.name,
                email: user.email,
                role
            }
        })
    } catch (error) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}