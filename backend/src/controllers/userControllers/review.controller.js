import { submitReviewService } from "../../services/user/review.service.js";

export const submitReviewController = async (req , res) =>{
    try {
        const consultationId = req.params.id;
        const patientId = req.user.id;
        const{ rating, review} = req.body;
        
        if(!rating){
            return res.status(400).json({
                success:false,
                message:'Rating is required'
            })
        }

        const reviewDoc = await submitReviewService({
            consultationId,
            patientId,
            rating,
            review
        })

        return res.status(200).json({
            success:true,
            message:'Review submitted succesfully',
            data: reviewDoc,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Something went wrong'
        })
    }
}