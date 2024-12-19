import Comment from "@/backend/models/Comment";
import dbConnect from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const FACEBOOK_VERIFY_TOKEN = process.env.FB_WEBHOOKTOKEN;

// Facebook webhook verification (GET)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = searchParams.get("hub.verify_token");
  const mode = searchParams.get("hub.mode");

  if (mode === "subscribe" && verifyToken === FACEBOOK_VERIFY_TOKEN) {
    console.log("Webhook verified");
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Verification failed", { status: 403 });
  }
}

// Facebook webhook processing (POST)
export async function POST(request: NextRequest) {
  const payload = await request.json();
  console.log(payload, "payload");

  try {
    if (payload.object === "page") {
      payload.entry.forEach((entry: any) => {
        const webhookEvent = entry.messaging || entry.changes;

        if (webhookEvent) {
          webhookEvent.forEach(async (event: any) => {
            if (event.field === "comments") {
              await storeComment(event.value);
            }
            if (event.field === "feed") {
              await storeFeedEvent(event.value);
            }
            if (event.message) {
              await processMessageEvent(event);
            }
          });
        }
      });
    }

    return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Store comment (stub implementation)
async function storeComment(commentDetails: any) {
  await dbConnect();

  //console.log("Comment stored:", commentDetails);
  const newComment = await Comment.create({
    facebookCommentId: commentDetails.id,
    userId: commentDetails.from.id,
    userName: commentDetails.from.name,
    message: commentDetails.message,
    createdAt: new Date(commentDetails.created_time),
  });
}

// Store comment (stub implementation)
async function storeFeedEvent(feedDetails: any) {
  if (feedDetails.item === "comment") {
    try {
      console.log(
        feedDetails?.post_id,
        "postID split",
        typeof feedDetails.post_id
      );
      const pageID = feedDetails?.post_id.split("_")[0];
      console.log(pageID, "pageID");
      await dbConnect();

      const newFeedEvent = await Comment.create({
        pageId: pageID,
        postId: feedDetails.post_id,
        facebookCommentId: feedDetails.id,
        userId: feedDetails.from.id,
        userName: feedDetails.from.name,
        message: feedDetails.message,
        createdAt: new Date(feedDetails.created_time),
      });
      console.log("Feed stored:", newFeedEvent);
    } catch (error: any) {
      console.error("Webhook processing error:", error);
    }
  }
}

// Process message events
async function processMessageEvent(event: any) {
  try {
    const senderId = event.sender.id;
    const recipientId = event.recipient.id;
    const timestamp = event.timestamp;
    const messageText = event.message.text;

    const senderDetails = await fetchUserDetails(senderId);

    await storeMessage({
      senderId,
      recipientId,
      timestamp,
      messageText,
      senderName: senderDetails.name,
    });
  } catch (error) {
    console.error("Message processing failed:", error);
  }
}

// Fetch user details
async function fetchUserDetails(userId: string) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  try {
    const nextPageUrl = `https://graph.facebook.com/v21.0/${userId}`;
    const headers = {
      Authorization: `Bearer ${process.env.FB_LAIF_TOKEN}`,
    };
    const config: any = {
      method: "get",
      url: nextPageUrl,
      headers,
    };

    const response: any = await axios(config);
    if (!response.ok) throw new Error("Failed to fetch user details");

    return response.json();
  } catch (error) {
    console.error("User details retrieval error:", error);
    return { name: "Unknown User", profile_pic: null };
  }
}

// Store message (stub implementation)
async function storeMessage(messageDetails: any) {
  await dbConnect();

  const newComment = await Comment.create({
    senderId: messageDetails.senderId,
    recipientId: messageDetails.recipientId,
    senderName: messageDetails.senderName,
    messageText: messageDetails.messageText,
    timestamp: new Date(messageDetails.timestamp),
  });
  console.log("Message stored:", newComment);
}
