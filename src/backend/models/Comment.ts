import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  pageId: {
    type: String,
  },
  postId: {
    type: String,
  },
  facebookCommentId: {
    type: String,
  },
  userId: {
    type: String,
  },
  userName: {
    type: String,
  },
  message: {
    type: String,
  },

  createdAt: {
    type: Date,
  },
});

export default mongoose?.models?.Comment ||
  mongoose.model("Comment", CommentSchema);
