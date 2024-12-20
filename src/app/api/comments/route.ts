import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import Comment from "@/backend/models/Comment";

export async function POST(req: Request, res: any) {
  await dbConnect();
  const io: any = res.socket?.server?.io;

  try {
    const body = await req.json();
    const { postId, message, userName } = body;

    const newComment = await Comment.create({ postId, message, userName });

    // Broadcast the new comment to WebSocket clients
    if (io) {
      io.emit("commentAdded", newComment);
    }

    return res.status(201).json({ success: true, comment: newComment });
  } catch (error: any) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
