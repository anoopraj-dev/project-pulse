import { doctorRevenueService, upcomingAppointmentService,dashboardStatsService ,recentPatientsService,feedbackService} from "../../services/doctor/dashboard.service.js";

export const doctorRevenue = async (req , res) =>{
    try {
        const doctorId = req.user.id;
        const {range} = req.query;

        console.log(range)

        const data = await doctorRevenueService(doctorId,range);

        return res.status(200).json({
            success:true,
            data,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Failed to fech revenue'
        })
    }
}


//------------- appointments -------------
export const upcomingAppointments = async (req , res) =>{
    try {
        const doctorId = req.user?.id;

        if(!doctorId){
            return res.status(401).json({
                success:false,
                message:'Unauthorized'
            })
        }

        const limit = parseInt(req.query.limit || '10',10);

        const data = await upcomingAppointmentService(doctorId,limit);

        return res.status(200).json({
            success:true,
            message:'Upcoming appointments fetched successfully',
            data,
        })
    } catch (error) {
        console.log('appointments fetch error:',error);

        return res.status(500).json({
            success:false,
            message:'Failed to fetch upcoming appoiontments'
        })
    }
    
}

//---------------- Dashboard stats ------------

export const doctorDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user.id; // from auth middleware

    const stats = await dashboardStatsService(doctorId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

export const recentPatients = async (req, res) => {
  try {
    const doctorId = req.user._id; // assuming auth middleware

    const data = await recentPatientsService(doctorId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Recent patients error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent patients",
    });
  }
};

export const patientFeedbacks = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const data = await feedbackService(doctorId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("Feedback error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};