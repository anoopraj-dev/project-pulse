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

    //--------------- get conversations
    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: 1 })
      .lean();


    //-------------- format messages --------------
    const formattedMessages = messages.map((msg) => ({
      ...msg,
      files:
        msg.files?.map((f) => ({
          url: f.url,
          name: f.name,
          size: f.size,
          resourceType: f.resourceType || "image",
        })) || [],
    }));

    //-------------- mark read --------------
    await Message.updateMany(
      {
        conversationId: conversation._id,
        receiverId: userId1,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );

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
      messages: formattedMessages,
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

      //----------------- Unread count ----------------
      const unreadCount = await Message.countDocuments({
        conversationId: convo._id,
        receiverId: userId,
        isRead: false,
      });

      result.push({
        _id: convo._id,
        participant,
        lastMessage: convo.lastMessage || null,
        unreadCount,
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
  files,
}) => {
  let conversation = null;
  let isNewConversation = false;
  

  //------------------- Find or Create conversation --------------------

  console.log("files recieved in send message", files);
  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
  }

  if (!conversation) {
    // try to find existing conversation between these users
    conversation = await Conversation.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: senderId } },
          { $elemMatch: { userId: receiverId } },
        ],
      },
    });

    // only create if still not found
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [
          { userId: senderId, userModel: senderModel },
          { userId: receiverId, userModel: receiverModel },
        ],
      });
      isNewConversation = true;
    }
  }

  //---------------- Create Message -------------------------
  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    senderModel,
    receiverId,
    receiverModel,
    text,
    files,
  });

  conversation.lastMessage = {
    text: message.text,
    senderId: message.senderId,
    files: message.files || [],
    type: message.files?.length ? "media" : "text",
    createdAt: message.createdAt,
  };

  conversation.updatedAt = message.createdAt;
  await conversation.save();

  // --------------------- Populate pariicaipants ---------------------

  const populatedConversation = await Conversation.findById(
    conversation._id,
  ).populate("participants.userId", "name profilePicture");

  const getOtherParticipant = (conversation, viewerId) => {
    return conversation.participants.find(
      (p) => p.userId._id.toString() !== viewerId.toString(),
    ).userId;
  };

  const senderParticipant = getOtherParticipant(
    populatedConversation,
    senderId,
  );

  const receiverParticipant = getOtherParticipant(
    populatedConversation,
    receiverId,
  );

  return {
    conversationId: populatedConversation._id,
    message,
    isNewConversation,
    senderConversation: {
      _id: populatedConversation._id,
      participant: senderParticipant,
      lastMessage: populatedConversation.lastMessage,
      updatedAt: populatedConversation.updatedAt,
    },
    receiverConversation: {
      _id: populatedConversation._id,
      participant: receiverParticipant,
      lastMessage: populatedConversation.lastMessage,
      updatedAt: populatedConversation.updatedAt,
    },
  };
};
