import {
  createTicketService,
  getTicketsService,
  updateTicketStatusService,
  createAlertService,
  getSystemAlersService,
  updateAlertStatusService,
  createEscalationService,
  getEscalationsService,
  resolveEscalationService,
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
    const { status, resolutionNotes } = req.body;

    const updatedTicket = await updateTicketStatusService(
      id,
      status,
      resolutionNotes
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
    next(error);
  }
};



//------------------ ALERTS ------------------//

export const createAlert = async (req, res, next) => {
  try {
    const alert = await createAlertService(req.body);

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    next(error);
  }
};

export const systemAlerts= async (req, res, next) => {
  try {
    const alerts = await getSystemAlersService();

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



//------------------ ESCALATIONS ------------------//

export const createEscalation = async (req, res, next) => {
  try {
    const escalation = await createEscalationService(req.body);

    res.status(201).json({
      success: true,
      message: 'Escalation created successfully',
      data: escalation
    });
  } catch (error) {
    next(error);
  }
};

export const getEscalations = async (req, res, next) => {
  try {
    const escalations = await getEscalationsService();

    res.status(200).json({
      success: true,
      count: escalations.length,
      data: escalations
    });
  } catch (error) {
    next(error);
  }
};

export const resolveEscalation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const escalation = await resolveEscalationService(id);

    if (!escalation) {
      return res.status(404).json({
        success: false,
        message: 'Escalation not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Escalation resolved successfully',
      data: escalation
    });
  } catch (error) {
    next(error);
  }
};

//------------ Change Password ------------
export const changePassword = async ( req , res) =>{
   try {
     const patientId = req.user.id;

    const {currentPassword,newPassword,role} = req.body;
    console.log('role',role)
    await changePasswordService(role,patientId,currentPassword,newPassword);

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