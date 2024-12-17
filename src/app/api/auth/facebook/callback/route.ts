export default async function handler(request: any, res: Response) {
  // Facebook webhook verification
  if (request.method === "GET") {
    const {
      "hub.challenge": challenge,
      "hub.verify_token": verifyToken,
      "hub.mode": mode,
    } = request.query;

    const FACEBOOK_VERIFY_TOKEN = process.env.FB_WEBHOOKTOKEN;

    if (mode === "subscribe" && verifyToken === FACEBOOK_VERIFY_TOKEN) {
      console.log("Webhook verified");
      return request.status(200).send(challenge);
    } else {
      return request.status(403).send("Verification failed");
    }
  }

  // Webhook POST handling
  if (request.method === "POST") {
    const payload: any = request.body;

    // Verify webhook authenticity (optional but recommended)
    // const signature = request.headers['x-hub.signature-256'];
    // const hmac = crypto.createHmac('sha256', process.env.FACEBOOK_APP_SECRET);
    // const computedSignature = `sha256=${hmac.update(JSON.stringify(payload)).digest('hex')}`;

    // if (signature !== computedSignature) {
    //   return res.status(403).send('Invalid signature');
    // }

    try {
      // Process different webhook events
      if (payload.object === "page") {
        payload.entry.forEach((entry: { messaging: any; changes: any }) => {
          const webhookEvent = entry.messaging || entry.changes;

          if (webhookEvent) {
            webhookEvent.forEach(
              async (event: { field: string; message: any }) => {
                // Comment-specific processing
                if (event.field === "comments") {
                  await processCommentEvent(event);
                }

                // Message-specific processing
                if (event.message) {
                  await processMessageEvent(event);
                }
              }
            );
          }
        });
      }

      return new Response("EVENT_RECEIVED", { status: 200 });
    } catch (error: any) {
      console.error("Webhook processing error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
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

    // Retrieve sender details
    const senderDetails = await fetchUserDetails(senderId);

    // Store or process message
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
    // Retrieve detailed comment information
    const commentDetails = await fetchCommentDetails(commentId);

    // Store or process comment (e.g., database, notification)
    await storeComment(commentDetails);
  } catch (error) {
    console.error("Comment processing failed:", error);
  }
}

// Fetch user details from Facebook Graph API
async function fetchUserDetails(userId: any) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${userId}?fields=name,profile_pic&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return response.json();
  } catch (error) {
    console.error("User details retrieval error:", error);
    return {
      name: "Unknown User",
      profile_pic: null,
    };
  }
}

// Store message in database or processing system
async function storeMessage(messageDetails: any) {
  // Implement your storage logic
  // Example with Prisma or your preferred database ORM
  // await prisma.message.create({
  //   data: {
  //     facebookSenderId: messageDetails.senderId,
  //     recipientId: messageDetails.recipientId,
  //     message: messageDetails.messageText,
  //     senderName: messageDetails.senderName,
  //     senderProfilePic: messageDetails.senderProfilePic,
  //     createdAt: new Date(messageDetails.timestamp),
  //   },
  // });
  console.log(messageDetails);
}

// Fetch detailed comment information
async function fetchCommentDetails(commentId: any) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  const response = await fetch(
    `https://graph.facebook.com/v21.0/${commentId}?fields=from{id,name,picture},message,created_time&access_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comment details");
  }

  return response.json();
}

// Store comment in database or processing system
async function storeComment(commentDetails: {
  id: any;
  from: { id: any; name: any };
  message: any;
  created_time: string | number | Date;
}) {
  // Implement your storage logic
  // Example with Prisma or your preferred database ORM
  // await prisma.comment.create({
  //   data: {
  //     facebookCommentId: commentDetails.id,
  //     userId: commentDetails.from.id,
  //     userName: commentDetails.from.name,
  //     message: commentDetails.message,
  //     createdAt: new Date(commentDetails.created_time),
  //   },
  // });
  console.log(commentDetails);
}
