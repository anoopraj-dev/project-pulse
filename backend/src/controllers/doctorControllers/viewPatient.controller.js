import Patient from '../../models/patient.model.js'

//-------------- View Patient Profile --------------

export const viewPatientProfile = async(req,res) =>{
    try {
        const {id} = req.params;

        const patient = await Patient.findById(id,'-password');
        
        if(!patient) res.status(404).json({
            success:false,
            message:'Patient information not found'
        })

        res.status(200).json({
            success:true,
            user:patient
        })
    } catch (error) {
        console.log(error)
    }
}