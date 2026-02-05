import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "participants.userModel",
        },

        userModel: {
          type: String,
          required: true,
          enum: ["Patient", "Doctor"],
        },
      },
    ],

    lastMessage: {
      text: { type: String },
      senderId: { type: mongoose.Schema.Types.ObjectId },
      createdAt: { type: Date },
      type: { type: String, enum: ["text", "media"], default: "text" },
      files: [
        {
          url: String,
          resourceType: {
            type: String,
            enum: ["image", "video", "raw"],
          },
          name: String,
          size: Number,
          isProtected: {type: Boolean, default :false},
          thumbnailUrl: String,
        },
      ],
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
