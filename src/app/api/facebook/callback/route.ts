import { runRevalidationTo } from "@/app/_actions";
import Comment from "@/backend/models/Comment";
import dbConnect from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface FacebookComment {
  from: {
    id: string;
    name: string;
  };
  post: {
    status_type: string;
    is_published: boolean;
    updated_time: string;
    permalink_url: string;
    promotion_status: string;
    id: string;
  };
  message: string;
  post_id: string;
  comment_id: string;
  created_time: string;
  item: string;
  parent_id: string;
  verb: string;
}

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

export async function POST(request: NextRequest) {
  const payload = await request.json();
  console.log(payload, "payload");

  try {
    // Connect to DB once at the start of the request
    await dbConnect();

    if (payload.object === "page") {
      // Use Promise.all to handle all events concurrently
      const entries = await Promise.all(
        payload.entry.map(async (entry: any) => {
          const webhookEvent = entry.messaging || entry.changes;

          if (webhookEvent) {
            const eventPromises = webhookEvent.map(async (event: any) => {
              if (event.field === "feed") {
                return storeFeedEvent(event.value);
              }
              if (event.message) {
                return processMessageEvent(event);
              }
            });

            await Promise.all(eventPromises);
          }
        })
      );
    }

    return NextResponse.json({ message: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Modify storeFeedEvent to not handle DB connection
async function storeFeedEvent(feedDetails: FacebookComment) {
  if (feedDetails.item === "comment") {
    try {
      const pageID = feedDetails?.post_id.split("_")[0];

      const commentData = {
        pageId: pageID,
        postId: feedDetails.post_id,
        facebookCommentId: feedDetails.comment_id,
        userId: feedDetails.from.id,
        userName: feedDetails.from.name,
        message: feedDetails.message,
        createdAt: new Date(feedDetails.created_time),
      };
      const newFeedEvent = new Comment(commentData);

      const res = await newFeedEvent.save();
      runRevalidationTo("/admin/live/");
      return res;
    } catch (error: any) {
      console.error("Feed event processing error:", error);
      throw error; // Propagate error up
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
