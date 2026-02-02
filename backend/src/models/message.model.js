import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Doctor", "Patient"],
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Doctor", "Patient"],
    },

    text: {
      type: String,
      trim: true,
      default: "",
    },
    isRead: {
      type:Boolean,
      default:false,
      index: true
    },
     files: [
      {
        url: { type: String, required: true },    
        type: { type: String },                   
        name: { type: String },                   
        size: { type: Number },                   
      },
    ],
  },
  { timestamps: true }
);


const Message = mongoose.model("Message", messageSchema);
export default Message
