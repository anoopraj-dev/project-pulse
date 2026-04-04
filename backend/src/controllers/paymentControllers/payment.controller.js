// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Payment from "../../models/payments.model.js";
// import Wallet from "../../models/wallet.model.js";
// import Transaction from "../../models/transaction.model.js";
// import Admin from "../../models/admin.model.js";
// import DoctorAvailability from "../../models/availability.model.js";
// import Appointment from "../../models/appointments.model.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// //----------------- PAYMENT WITH RAZORPAY -----------------
// export const createOrder = async (req, res) => {
//   const { amount, doctorId, date, time, serviceType, reason, notes } = req.body;

//   try {
//     // ---------------- Validation  ----------------
//     if (!doctorId || !date || !time || !serviceType || !reason) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing booking fields",
//       });
//     }

//     const slot = await DoctorAvailability.findOne({
//       doctorId,
//       date: new Date(date),
//       "slots.startTime": time,
//       "slots.isBooked": false,
//     });

//     if (!slot) {
//       return res.status(409).json({
//         success: false,
//         message: "Selected slot not available",
//       });
//     }

//     //-------------- payment options -------------
//     const options = {
//       amount: amount * 100, // ------- convert to paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     const appointment = await Appointment.create({
//       patient: req.user.id,
//       doctor: doctorId,
//       appointmentDate: date,
//       timeSlot: time,
//       reason,
//       notes,
//       serviceType,
//       status: "pending",
//       isActive: false,
//     });

//     await appointment.save();

//     await Payment.create({
//       patient: req.user.id,
//       doctor: doctorId,
//       appointment: appointment._id,
//       method: "razorpay",
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       receipt: order.receipt,
//       status: "created",
//       attempts: 0,
//     });

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// //----------------- Verify Payment ----------------
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       req.body;

//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generated_signature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Signature",
//       });
//     }

//     //-------- fetch all payment details from razorpay-------------
//     const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

//     //------------- Update payment in db --------
//     const payment = await Payment.findOneAndUpdate(
//       { orderId: razorpay_order_id },
//       {
//         paymentId: razorpay_payment_id,
//         signature: razorpay_signature,
//         method: "razorpay",
//         notes: `Paid via ${paymentDetails.method}`,
//       },
//       { new: true },
//     );

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment record not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Payment Verified",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Verification failed",
//     });
//   }
// };

// //--------------------- Update Payment Status --------------------
// export const updatePaymentStatus = async (req, res) => {
//   console.log("upadating payment status");
//   try {
//     const { orderId, status, notes } = req.body;

//     const payment = await Payment.findOne({ orderId });

//     if (!payment) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Payment record not found" });
//     }

//     //---------- Prevent double credit -----------
//     if (payment.status === "verified") {
//       return res.status(200).json({
//         success: true,
//         message: "Payment already processed",
//       });
//     }

//     //-------- Validate state transition --------
//     if (
//       status === "verified" &&
//       !["created", "failed"].includes(payment.status)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid state transition",
//       });
//     }

//     payment.status = status;
//     payment.notes = notes || "";
//     await payment.save();

//     console.log("verified payment status", payment.status);

//     //--------------- update admin wallet & transactions after successful payment -----------------

//     if (status !== "verified") {
//       return res.status(200).json({
//         success: true,
//         message: "Payment not verified, wallet not credited",
//       });
//     }

//     const admin = await Admin.findOne();

//     let adminWallet = await Wallet.findOne({ role: "admin" });

//     if (!adminWallet) {
//       //-------------- Create new admin wallet if it doesn't exist---------------
//       adminWallet = await Wallet.create({
//         userId: admin._id,
//         role: "admin",
//         balance: payment.amount,
//         transactions: [],
//       });
//     } else {
//       // Increment existing balance
//       adminWallet.balance += payment.amount;
//     }

//     await Transaction.create({
//       wallet: adminWallet._id,
//       type: "credit",
//       amount: payment.amount,
//       referenceType: "payment",
//       referenceId: payment._id,
//       notes: `Received from patient ${payment.patient}`,
//     });

//     await adminWallet.save();

//     return res.status(200).json({ success: true, payment });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Could not update payment" });
//   }
// };

// //--------------------- Retry Payment --------------------
// export const retryPayment = async (req, res) => {
//   try {
//     const { id: paymentId } = req.params;

//     const payment = await Payment.findById(paymentId);

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Payment not found",
//       });
//     }

//     //----------- Only failed payments can be retried ----------
//     if (payment.status !== "failed") {
//       return res.status(400).json({
//         success: false,
//         message: "Only failed payments can be retried",
//       });
//     }

//     //----------- Maximum 3 retry attempts ----------
//     if (payment.attempts >= 3) {
//       return res.status(400).json({
//         success: false,
//         message: "Maximum retry attempts exceeded",
//       });
//     }

//     //-------------- find the appointment ------------
//     const appointment = await Appointment.findOne({
//       _id: payment?.appointment._id,
//     });

//     //--------------- Build payload for booking --------------
//     const payload = {
//       doctorId: appointment.doctor,
//       date: appointment.appointmentDate,
//       time: appointment.timeSlot,
//       reason: appointment.reason,
//       notes: appointment.notes,
//       serviceType: appointment.serviceType,
//       paymentMethod: "razorpay",
//     };

//     const now = new Date();
//     const createdAt = new Date(payment.createdAt);
//     const diffInHours = (now - createdAt) / (1000 * 60 * 60);

//     //----------- Retry allowed only within 24 hours ----------
//     if (diffInHours > 24) {
//       return res.status(400).json({
//         success: false,
//         message: "Retry window expired (24 hours)",
//       });
//     }

//     //------------- Create new Razorpay order ----------------
//     const newOrder = await razorpay.orders.create({
//       amount: payment.amount, // already stored in paise
//       currency: "INR",
//       receipt: `retry_${Date.now()}`,
//     });

//     //------------- Update payment record ----------------
//     payment.orderId = newOrder.id;
//     payment.attempts += 1;

//     const data = {
//       ...payload,
//       doctorId: payment.doctor,
//       paymentMethod: "razorpay",
//     };

//     await payment.save();

//     return res.status(200).json({
//       success: true,
//       message: "Retry order created successfully",
//       order: newOrder,
//       bookingData: data,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Retry failed",
//     });
//   }
// };

// //--------------- Wallet payment controller ---------------

// export const walletPayment = async (req, res) => {
//   try {
//     console.log("wallet payment route hit");
//     const {
//       amount,
//       doctorId,
//       date,
//       time,
//       serviceType,
//       reason,
//       notes,
//       paymentMethod,
//     } = req.body;
//     const patientId = req.user.id;

//     //-------------- Validate Slot ------------
//     const slot = await DoctorAvailability.findOne({
//       doctorId,
//       date: new Date(date),
//       "slots.startTime": time,
//       "slots.isBooked": false,
//     });

//     if (!slot) {
//       return res.status(409).json({
//         success: false,
//         message: "Selected slot is not available",
//       });
//     }

//     //------------- Find patient Wallet -------------
//     const wallet = await Wallet.findOne({
//       userId: patientId,
//       role: "patient",
//     });

//     if (!wallet || wallet.balance < amount * 100) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient wallet balance",
//       });
//     }

//     //--------------- Deduct wallet balance --------------
//     wallet.balance -= amount * 100;
//     await wallet.save();

//     //-------------- Generate orderId ------------------
//     const orderId = `wal_${Date.now()}`;

//     //-------------- create Appointment ----------------
//     const appointment = await Appointment.create({
//       patient: patientId,
//       doctor: doctorId,
//       appointmentDate: date,
//       timeSlot: time,
//       reason,
//       notes,
//       serviceType,
//       status: "pending",
//       isActive: false,
//     });

//     //------------------ Create payment record --------------
//     const payment = await Payment.create({
//       patient: patientId,
//       doctor: doctorId,
//       appointment: appointment._id,
//       method: "wallet",
//       orderId,
//       amount: amount * 100,
//       currency: "INR",
//       method: "wallet",
//       status: "verified",
//     });

//     //------------- Record patient transaction -------------
//     await Transaction.create({
//       wallet: wallet._id,
//       type: "debit",
//       amount: amount * 100,
//       referenceType: "payment",
//       referenceId: payment._id,
//       notes: "Appointment payment via wallet",
//     });

//     await wallet.save();

//     const admin = await Admin.findOne();

//     //-------------- Credit admin wallet -------------
//     let adminWallet = await Wallet.findOne({ role: "admin" });

//     if (!adminWallet) {
//       adminWallet = await Wallet.create({
//         userId: admin._id,
//         role: "admin",
//         balance: amount * 100,
//         transactions: [],
//       });
//     } else {
//       adminWallet.balance += amount * 100;
//     }

//     await Transaction.create({
//       wallet: adminWallet._id,
//       type: "credit",
//       amount: amount * 100,
//       referenceType: "payment",
//       referenceId: payment._id,
//       notes: `Wallet payment from patient ${patientId}`,
//     });

//     await adminWallet.save();

//     return res.status(200).json({
//       success: true,
//       message: "Wallet payment successful",
//       payment,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Wallet payment failed",
//     });
//   }
// };

// export const verifyWalletPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_payment_id,
//       razorpay_order_id,
//       razorpay_signature,
//       amount,
//     } = req.body;

//     // -------------- Verify signature with Razorpay HMAC -------
//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generated_signature !== razorpay_signature) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid signature" });
//     }

//     // -------------------- Credit wallet -------------------------
//     let wallet = await Wallet.findOne({
//       userId: req.user._id,
//       role: "patient",
//     });
//     if (!wallet) {
//       wallet = await Wallet.create({
//         userId: req.user._id,
//         role: "patient",
//         balance: 0,
//         transactions: [],
//       });
//     }
//     wallet.balance += amount;
//     await wallet.save();

//     //--- Create wallet transaction ------
//     const txn = await Transaction.create({
//       wallet: wallet._id,
//       type: "credit",
//       amount,
//       referenceType: "topup",
//       referenceId: razorpay_payment_id,
//       notes: "Wallet top-up via Razorpay",
//     });
//     wallet.transactions.push(txn._id);
//     await wallet.save();

//     return res.json({
//       success: true,
//       message: "Wallet credited successfully",
//       wallet,
//       transaction: txn,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to verify payment" });
//   }
// };


import {
  createOrderService,
  verifyPaymentService,
  updatePaymentStatusService,
  retryPaymentService,
  walletPaymentService,
  verifyWalletTopupService,
} from "../../services/payment/payment.service.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const order = await createOrderService(req.user.id, req.body);
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    await verifyPaymentService(req.body);
    res.json({ success: true, message: "Payment Verified" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE STATUS
export const updatePaymentStatus = async (req, res) => {
  try {
    const result = await updatePaymentStatusService(req.body);

    if (result?.alreadyProcessed) {
      return res.json({ success: true, message: "Already processed" });
    }

    res.json({ success: true, payment: result.payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// RETRY
export const retryPayment = async (req, res) => {
  try {
    const data = await retryPaymentService(req.params.id);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// WALLET PAYMENT
export const walletPayment = async (req, res) => {
  try {
    const payment = await walletPaymentService(req.user.id, req.body);
    res.json({ success: true, payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// VERIFY WALLET TOPUP
export const verifyWalletPayment = async (req, res) => {
  try {
    const data = await verifyWalletTopupService(req.user.id, req.body);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};