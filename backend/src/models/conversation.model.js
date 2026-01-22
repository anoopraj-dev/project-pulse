import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {

    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'participants.userModel'
        },

        userModel: {
          type: String,
          required: true,
          enum: ['Patient','Doctor'],
        }
      }
    ],


    lastMessage: {
      text: { type: String },
      senderId: { type: mongoose.Schema.Types.ObjectId },
      createdAt: { type: Date },
    },

  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;