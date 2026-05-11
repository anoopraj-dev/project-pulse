import {
  createTicketService,
  getTicketsService,
  updateTicketStatusService,
  getSystemAlertsService,
  updateAlertStatusService,
  changePasswordService,
} from "../../services/user/support.service.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AppError from "../../utils/AppError.js";

//------------------ TICKETS ------------------//

export const createSupportTicket = asyncHandler(async (req, res) => {
  const ticket = await createTicketService(req.body);
  res.status(201).json({
    success: true,
    message: "Ticket created successfully",
    data: ticket,
  });
});

export const supportTickets = asyncHandler(async (req, res) => {
  const tickets = await getTicketsService();
  res.status(200).json({ success: true, count: tickets.length, data: tickets });
});

export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedTicket = await updateTicketStatusService(id, status);
  if (!updatedTicket) throw new AppError("Ticket not found", 404);

  res.status(200).json({
    success: true,
    message: "Ticket updated successfully",
    data: updatedTicket,
  });
});

//------------------ ALERTS ------------------//

export const systemAlerts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const alerts = await getSystemAlertsService({ page, limit });
  res.status(200).json({ success: true, count: alerts.length, data: alerts });
});

export const updateAlertStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedAlert = await updateAlertStatusService(id, status);
  if (!updatedAlert) throw new AppError("Alert not found", 404);

  res.status(200).json({
    success: true,
    message: "Alert updated successfully",
    data: updatedAlert,
  });
});

//------------ Change Password ------------
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, role } = req.body;
  await changePasswordService(role, req.user.id, currentPassword, newPassword);

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});