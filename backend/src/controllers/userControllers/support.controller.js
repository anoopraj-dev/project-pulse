import {
  createTicketService,
  getTicketsService,
  updateTicketStatusService,
  getSystemAlertsService,
  updateAlertStatusService,
  changePasswordService
} from '../../services/user/support.service.js';

//------------------ TICKETS ------------------//

export const createSupportTicket = async (req, res, next) => {
  try {
    const ticket = await createTicketService(req.body);

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const supportTickets = async (req, res, next) => {
  try {
    const tickets = await getTicketsService();

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status} = req.body;

    const updatedTicket = await updateTicketStatusService(
      id,
      status,
    );

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: updatedTicket
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:'Something went wrong'
    })
  }
};



//------------------ ALERTS ------------------//

export const systemAlerts= async (req, res, next) => {
  try {
    const {page=1,limit=10,status} = req.query;
    const alerts = await getSystemAlertsService({page,limit});

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
};

export const updateAlertStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAlert = await updateAlertStatusService(id, status);

    if (!updatedAlert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alert updated successfully',
      data: updatedAlert
    });
  } catch (error) {
    next(error);
  }
};


//------------ Change Password ------------
export const changePassword = async ( req , res) =>{
   try {
     const id = req.user.id;

    const {currentPassword,newPassword,role} = req.body;
    await changePasswordService(role,id,currentPassword,newPassword);

    return res.status(200).json({
        success:true,
        message:'Password changed succesfully'
    })
   } catch (error) {
    return res.status(error.statusCode || 500).json({
        success:false,
        message:error.message || 'Something went wrong'
    })
   }
}