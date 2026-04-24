import { revenueSummaryService } from "../../services/admin/revenue.service.js";

export const revenueSummary = async (req , res) => {
    try {
        const {range} = req.query;

        const data = await revenueSummaryService(range);

        return res.status(200).json({
            success: true,
            message:'Revenue summary fetched successfully',
            data,
        })
    } catch (error) {

        return res.status(500).json({
            success:false,
            message:'Failed to fetch revenue summary',
            error:error.message
        })
    }
}