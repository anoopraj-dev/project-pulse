import Conversation from "../../models/conversation.model.js";
import Message from "../../models/message.model.js";
import Doctor from "../../models/doctor.model.js";
import Patient from "../../models/patient.model.js";

const modelMap = {
  Doctor,
  Patient,
};

// --------------------- GET ALL MESSAGES ---------------
export const getAllMessages = async (req, res) => {
  try {
    const userId1 = req.user.id;
    const userId2 = req.params.id;

    let userModel1, userModel2;

    if (req.user.role === "patient") {
      userModel1 = "Patient";
      userModel2 = "Doctor";
    } else if (req.user.role === "doctor") {
      userModel1 = "Doctor";
      userModel2 = "Patient";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const ParticipantModel = modelMap[userModel2];

    const participant = await ParticipantModel.findById(userId2).select(
      "name profilePicture",
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: userId1 } },
          { $elemMatch: { userId: userId2 } },
        ],
      },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        conversation: null,
        participant: {
          _id: participant._id,
          name: participant.name,
          profilePicture: participant.profilePicture,
        },
        messages: [],
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversation: {
        _id: conversation._id,
      },
      participant: {
        _id: participant._id,
        name: participant.name,
        profilePicture: participant.profilePicture,
      },
      messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

//------------------- GET ALL CHATS -----------------------
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      "participants.userId": userId,
    }).sort({ updatedAt: -1 });

    const result = [];

    for (const convo of conversations) {
      const other = convo.participants.find(
        (p) => p.userId.toString() !== userId,
      );

      const ParticipantModel = modelMap[other.userModel];
      const participant = await ParticipantModel.findById(other.userId).select(
        "name profilePicture",
      );

      result.push({
        _id: convo._id,
        participant,
        lastMessage: convo.lastMessage || null,
        updatedAt: convo.updatedAt,
      });
    }

    res.status(200).json({
      success: true,
      conversations: result,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

//-------------------- SEND MESSAGE ----------------------

export const sendMessage = async ({
  conversationId,
  senderId,
  senderModel,
  receiverId,
  receiverModel,
  text,
}) => {
  let conversation = conversationId
    ? await Conversation.findById(conversationId)
    : null;

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [
        { userId: senderId, userModel: senderModel },
        { userId: receiverId, userModel: receiverModel },
      ],
    });
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    senderModel,
    receiverId,
    receiverModel,
    text,
  });

  conversation.lastMessage = {
    text: message.text,
    senderId: message.senderId,
    createdAt: message.createdAt,
  };
  conversation.updatedAt = message.createdAt;
  await conversation.save();

  return {
    message,
    conversationId: conversation._id,
  };
};

