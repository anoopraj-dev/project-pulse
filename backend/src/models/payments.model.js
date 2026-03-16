// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     patient: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Patient",
//       required: true,
//     },

//     doctor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Doctor",
//       required: true,
//     },

//     appointment: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Appointment",
//       default: null,
//     },

//     bookingData: {
//       doctorId: mongoose.Schema.Types.ObjectId,
//       date: Date,
//       time: String,
//       serviceType: String,
//       reason: String,
//       notes: String,
//     },

//     orderId: {
//       type: String,
//       required: true,
//     },

//     paymentId: {
//       type: String,
//       default: null,
//     },

//     signature: {
//       type: String,
//       default: null,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     currency: {
//       type: String,
//       default: "INR",
//     },

//     status: {
//       type: String,
//       enum: ["created", "verified", "failed", "refunded"],
//       default: "created",
//     },

//     method: {
//       type: String,
//       default: null,
//     },

//     receipt: {
//       type: String,
//       default: null,
//     },
//     attempts: {
//       type: Number,
//       default: 1,
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("Payment", paymentSchema);

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    method: {
      type: String,
      enum: ["razorpay", "wallet"],
      required: true,
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      default: null,
    },

    signature: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "verified", "failed", "refunded"],
      default: "created",
    },

    receipt: {
      type: String,
      default: null,
    },

    attempts: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
