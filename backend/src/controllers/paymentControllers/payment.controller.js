import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../../models/payments.model.js";
import Wallet from "../../models/wallet.model.js";
import Transaction from "../../models/transaction.model.js";
import Admin from "../../models/admin.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//--------------- Create Razorpay Order --------------
export const createOrder = async (req, res) => {
  const { amount, doctorId } = req.body;

  try {
    const options = {
      amount: amount * 100, // ------- convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      patient: req.user.id,
      doctor: doctorId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: "created",
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//----------------- Verify Payment ----------------
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

    //-------- fetch all payment details from razorpay-------------
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    //------------- Update payment in db --------
    const payment = await Payment.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status:
          paymentDetails.status === "captured"
            ? "verified"
            : paymentDetails.status,
        method: paymentDetails.method,
        notes: `Paid via ${paymentDetails.method}`,
      },
      { new: true },
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

//--------------------- Update Payment Status --------------------
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, status, notes } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "OrderId and status are required" });
    }

    const validStatuses = [
      "created",
      "verified",
      "failed",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Payment Status" });
    }

    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { status, notes: notes || "" },
      { new: true },
    );

    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }

    //--------------- update admin wallet & transactions after successful payment -----------------

    //---------- Prevent double credit -----------
    if (payment.status === "verified") {
      return res.status(200).json({
        success: true,
        message: "Payment already processed",
      });
    }

    //-------- Only allow crated-- verified --------
    if (status === "verified" && payment.status !== "created") {
      return res.status(400).json({
        success: false,
        message: "Invalid state transition",
      });
    }

    const admin = await Admin.findOne();

    let adminWallet = await Wallet.findOne({ role: "admin" });

    if (!adminWallet) {
      //-------------- Create new admin wallet if it doesn't exist---------------
      adminWallet = await Wallet.create({
        userId: admin._id,
        role: "admin",
        balance: payment.amount,
        transactions: [],
      });
    } else {
      // Increment existing balance
      adminWallet.balance += payment.amount;
    }

    const txn = await Transaction.create({
      wallet: adminWallet._id,
      type: "credit",
      amount: payment.amount,
      referenceType: "payment",
      referenceId: payment._id,
      notes: `Received from patient ${payment.patient}`,
    });

    adminWallet.transactions.push(txn._id);
    await adminWallet.save();

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Could not update payment" });
  }
};
