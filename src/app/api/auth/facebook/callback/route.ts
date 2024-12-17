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

  try {
    if (payload.object === "page") {
      payload.entry.forEach((entry: any) => {
        const webhookEvent = entry.messaging || entry.changes;
        console.log(webhookEvent);

        if (webhookEvent) {
          webhookEvent.forEach(async (event: any) => {
            if (event.field === "comments") {
              await processCommentEvent(event);
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
      senderProfilePic: senderDetails.profile_pic,
    });
  } catch (error) {
    console.error("Message processing failed:", error);
  }
}

// Process comment events
async function processCommentEvent(event: any) {
  const commentId = event.value.comment_id;

  try {
    const commentDetails = await fetchCommentDetails(commentId);
    await storeComment(commentDetails);
  } catch (error) {
    console.error("Comment processing failed:", error);
  }
}

// Fetch user details
async function fetchUserDetails(userId: string) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${userId}?fields=name,profile_pic&access_token=${accessToken}`
    );
    if (!response.ok) throw new Error("Failed to fetch user details");

    return response.json();
  } catch (error) {
    console.error("User details retrieval error:", error);
    return { name: "Unknown User", profile_pic: null };
  }
}

// Store message (stub implementation)
async function storeMessage(messageDetails: any) {
  console.log("Message stored:", messageDetails);
}

// Fetch comment details
async function fetchCommentDetails(commentId: string) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${commentId}?fields=from{id,name,picture},message,created_time&access_token=${accessToken}`
  );

  if (!response.ok) throw new Error("Failed to fetch comment details");

  return response.json();
}

// Store comment (stub implementation)
async function storeComment(commentDetails: any) {
  console.log("Comment stored:", commentDetails);
}
