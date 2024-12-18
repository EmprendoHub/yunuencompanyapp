import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
  },
  recipientId: {
    type: String,
  },
  senderName: {
    type: String,
  },
  senderProfilePic: {
    type: String,
  },
  messageText: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
});

export default mongoose?.models?.Message ||
  mongoose.model("Message", MessageSchema);
