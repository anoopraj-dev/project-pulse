import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../../models/payments.model.js";
import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import Admin from "../../models/admin.model.js";
import DoctorAvailability from "../../models/availability.model.js";
import Appointment from "../../models/appointments.model.js";
import { validateAdvanceBooking } from "../../utils/timeValidation.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//-------- calculate slot duration --------------
const calculateDuration = (startTime, endTime = null, fallback = 30) => {
  if (!endTime) return fallback;

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  return eh * 60 + em - (sh * 60 + sm);
};

//------------------- Build UTC date ------
const buildUTCDate = (date, time) => {
  return new Date(`${date}T${time}:00+05:30`);
};

// -------- CREATE ORDER ----------
export const createOrderService = async (userId, body) => {
  const { amount, doctorId, date, time, serviceType, reason, notes } = body;

  console.log('payload recieved in create order',body)

  if (!doctorId || !date || !time || !serviceType || !reason) {
    throw new Error("Missing booking fields");
  }

  validateAdvanceBooking(date, time, 1);

  const availability = await DoctorAvailability.findOne({
    doctorId,
    dateKey: date,
  });

  if (!availability) {
    throw new Error("No availability found");
  }

  const slotStartUTC = buildUTCDate(date, time);

  const slot = availability.slots.find(
    (s) =>
      s.startAt.getTime() === slotStartUTC.getTime() &&
      s.status === "available",
  );

  if (!slot) {
    throw new Error("Selected slot not available");
  }

  const duration =
    (new Date(slot.endAt) - new Date(slot.startAt)) / (1000 * 60);

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });


const appointment = await Appointment.create({
  patient: userId,
  doctor: doctorId,
  appointmentDate: date,
  timeSlot: time,
  reason,
  notes,
  serviceType,
  duration,
  status: "pending",
  isActive: false,
});

  await Payment.create({
    patient: userId,
    doctor: doctorId,
    appointment: appointment._id,
    method: "razorpay",
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    status: "created",
    attempts: 0,
  });

  return order;
};

// -------- VERIFY PAYMENT ----------
export const verifyPaymentService = async (body) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    throw new Error("Invalid Signature");
  }

  const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

  const payment = await Payment.findOneAndUpdate(
    { orderId: razorpay_order_id },
    {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      method: "razorpay",
      notes: `Paid via ${paymentDetails.method}`,
    },
    { new: true },
  );

  if (!payment) throw new Error("Payment record not found");

  return payment;
};

// -------- UPDATE PAYMENT STATUS ----------
export const updatePaymentStatusService = async (body) => {
  const { orderId, status, notes } = body;

  const payment = await Payment.findOne({ orderId });
  if (!payment) throw new Error("Payment record not found");

  if (payment.status === "verified") {
    return { alreadyProcessed: true };
  }

  if (
    status === "verified" &&
    !["created", "failed"].includes(payment.status)
  ) {
    throw new Error("Invalid state transition");
  }

  payment.status = status;
  payment.notes = notes || "";
  await payment.save();

  if (status !== "verified") {
    return { payment };
  }

  const admin = await Admin.findOne();

  let adminWallet = await Wallet.findOne({ role: "admin" });

  if (!adminWallet) {
    adminWallet = await Wallet.create({
      userId: admin._id,
      role: "admin",
      balance: payment.amount,
    });
  } else {
    adminWallet.balance += payment.amount;
  }

  await Transaction.create({
    wallet: adminWallet._id,
    type: "credit",
    amount: payment.amount,
    referenceType: "payment",
    referenceId: payment._id,
    notes: `Received from patient ${payment.patient}`,
  });

  await adminWallet.save();

  return { payment };
};

// -------- RETRY PAYMENT ----------
export const retryPaymentService = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new Error("Payment not found");

  if (payment.status !== "failed") {
    throw new Error("Only failed payments can be retried");
  }

  if (payment.attempts >= 3) {
    throw new Error("Maximum retry attempts exceeded");
  }

  const appointment = await Appointment.findById(payment.appointment);

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const now = new Date();

  const diffInHours =
    (now - new Date(payment.createdAt)) / (1000 * 60 * 60);

  if (diffInHours > 6) {
    throw new Error("Retry window expired (6 hours)");
  }

  // -------- FIX: derive datetime safely from schema fields --------
  if (!appointment.appointmentDate || !appointment.timeSlot) {
    throw new Error("Appointment data missing");
  }

  const baseDate =
    appointment.appointmentDate instanceof Date
      ? appointment.appointmentDate
      : new Date(appointment.appointmentDate);

  if (isNaN(baseDate.getTime())) {
    throw new Error("Invalid appointment date");
  }

  const [hours, minutes] = appointment.timeSlot.split(":").map(Number);

  const appointmentDateTime = new Date(baseDate);
  appointmentDateTime.setHours(hours, minutes, 0, 0);

  if (isNaN(appointmentDateTime.getTime())) {
    throw new Error("Invalid appointment timeSlot");
  }

  const diff = appointmentDateTime - now;

  if (diff <= 60 * 60 * 1000) {
    throw new Error("Cannot retry payment for past appointment");
  }

  const newOrder = await razorpay.orders.create({
    amount: payment.amount,
    currency: "INR",
    receipt: `retry_${Date.now()}`,
  });

  payment.orderId = newOrder.id;
  payment.attempts += 1;
  await payment.save();

  return {
    order: newOrder,
    bookingData: {
      doctorId: appointment.doctor,
      date: appointment.appointmentDate,
      time: appointment.timeSlot,
      reason: appointment.reason,
      notes: appointment.notes,
      serviceType: appointment.serviceType,
      paymentMethod: "razorpay",
    },
  };
};
// -------- WALLET PAYMENT ----------
export const walletPaymentService = async (userId, body) => {
  const { amount, doctorId, date, time, serviceType, reason, notes } = body;

  validateAdvanceBooking(date, time, 0);

  const availability = await DoctorAvailability.findOne({
    doctorId,
    date: new Date(date),
  });

  const slot = availability?.slots?.find(
    (s) => s.startTime === time && !s.isBooked,
  );

  if (!slot) throw new Error("Selected slot is not available");

  const duration =
    slot?.duration || calculateDuration(slot.startTime, slot.endTime);

  const wallet = await Wallet.findOne({
    userId,
    role: "patient",
  });

  if (!wallet || wallet.balance < amount * 100) {
    throw new Error("Insufficient wallet balance");
  }

  wallet.balance -= amount * 100;
  await wallet.save();

  const appointment = await Appointment.create({
    patient: userId,
    doctor: doctorId,
    appointmentDate: date,
    timeSlot: time,
    reason,
    notes,
    serviceType,
    duration,
    status: "pending",
    isActive: false,
  });

  const payment = await Payment.create({
    patient: userId,
    doctor: doctorId,
    appointment: appointment._id,
    method: "wallet",
    orderId: `wal_${Date.now()}`,
    amount: amount * 100,
    currency: "INR",
    status: "verified",
  });

  await Transaction.create({
    wallet: wallet._id,
    type: "debit",
    amount: amount * 100,
    referenceType: "payment",
    referenceId: payment._id,
    notes: "Appointment payment via wallet",
  });

  const admin = await Admin.findOne();
  let adminWallet = await Wallet.findOne({ role: "admin" });

  if (!adminWallet) {
    adminWallet = await Wallet.create({
      userId: admin._id,
      role: "admin",
      balance: amount * 100,
    });
  } else {
    adminWallet.balance += amount * 100;
  }

  await Transaction.create({
    wallet: adminWallet._id,
    type: "credit",
    amount: amount * 100,
    referenceType: "payment",
    referenceId: payment._id,
    notes: `Wallet payment from patient ${userId}`,
  });

  await adminWallet.save();

  return payment;
};

// -------- VERIFY WALLET TOPUP ----------
export const verifyWalletTopupService = async (userId, body) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } =
    body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    throw new Error("Invalid signature");
  }

  let wallet = await Wallet.findOne({ userId, role: "patient" });

  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      role: "patient",
      balance: 0,
    });
  }

  wallet.balance += amount;
  await wallet.save();

  const txn = await Transaction.create({
    wallet: wallet._id,
    type: "credit",
    amount,
    referenceType: "topup",
    referenceId: razorpay_payment_id,
    notes: "Wallet top-up via Razorpay",
  });

  return { wallet, txn };
};
