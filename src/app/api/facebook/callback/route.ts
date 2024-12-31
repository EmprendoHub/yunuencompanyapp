import Comment from "@/backend/models/Comment";
import dbConnect from "@/lib/db";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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
  updated_time: string;
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

  try {
    // Connect to DB once at the start of the request
    await dbConnect();

    if (payload.object === "page") {
      // Use Promise.all to handle all events concurrently
      const entries = await Promise.all(
        payload.entry.map(async (entry: any) => {
          const webhookEvent = entry.messaging || entry.changes;
          console.log(webhookEvent, "webhookEvent");

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
      let type = "";
      let intent = "none";
      const filterWords = [
        "compartido",
        "Compartido",
        "compartiendo",
        "Compatido",
        "Conpartido",
        "Comprartido",
        "Compartir",
        "Compatidoy",
        "Cómpartido",
        "Compartirdo",
        "COMPARTIDO",
      ];

      if (
        filterWords.some((word) =>
          feedDetails.message.toLowerCase().includes(word.toLowerCase())
        )
      ) {
        type = "fake_share";
        intent = "share";
      }

      if (
        feedDetails.message ===
        "Gracias por tu compra este articulo te lo ganaste tu!"
      )
        return NextResponse.json(
          { message: "PURCHASE CONFIRMED" },
          { status: 201 }
        );

      if (
        feedDetails.message ===
        "Una disculpa hubo un error y este articulo se lo gano alguien mas!"
      )
        return NextResponse.json(
          { message: "PURCHASE CANCELLED" },
          { status: 201 }
        );

      if (feedDetails.message && type !== "fake_share") {
        const openai = new OpenAI({
          apiKey: process.env.OPEN_AI_KEY,
        });

        const aiPromptRequest = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `
                    Eres un asistente experto en ventas en vivo que ayuda a evaluar la intención de compra de los clientes en un live stream. Tu tarea principal es analizar los mensajes enviados por los clientes en español para determinar si están expresando una intención de compra, y si es así, identificar los detalles clave del mensaje como:
              
                    1. Producto mencionado (si corresponde).
                    2. Cantidad o precio indicado.
                    3. Nombre o referencia personal (si se menciona, por ejemplo, "yo," "mía," "mío").
              
                    Ejemplo:
                    - Mensaje: "yo camisa negra" -> Respuesta: { intención: "compra", producto: "camisa negra", cantidad: 1 }
                    - Mensaje: "mia bolsa 150" -> Respuesta: { intención: "compra", producto: "bolsa", precio: 150 }
                    - Mensaje: "solo mirando" -> Respuesta: { intención: "sin compra" }
              
                    Si no hay suficiente información para determinar una intención clara o detalles del producto, responde con: { intención: "indeterminada" }.
              
                    Sé preciso y utiliza un formato JSON en tus respuestas. Contesta siempre en Ingles Americano y mantén la información directa y profesional si se determina que si existe una intencion de compra en el mensaje marca intent: purchase.
                    `,
            },
            {
              role: "user",
              content: feedDetails.message,
            },
          ],
          model: "gpt-3.5-turbo-0125",
        });

        if (aiPromptRequest.choices[0].message.content) {
          const responseJson = JSON.parse(
            aiPromptRequest.choices[0].message.content || "none"
          );
          intent = responseJson.intention;
        }
      }

      const commentData = {
        pageId: pageID,
        postId: feedDetails.post_id,
        facebookCommentId: feedDetails.comment_id,
        userId: feedDetails.from.id,
        userName: feedDetails.from.name,
        message: feedDetails.message,
        type,
        intent,
        email: "yunuengmc@gmail.com",
        createdAt: new Date(feedDetails.post.updated_time),
      };

      const clientData = {
        fb_id: feedDetails.from.id,
        name: feedDetails.from.name,
        postId: feedDetails.post_id,
      };
      // const newFeedEvent = new Comment(commentData);
      //supbase comment

      const data = await supabase.from("messages").insert(commentData);
      if (type === "fake_share") {
        const fb_client = await supabase.from("fb_clients").insert(clientData);
      }
      //const res = await newFeedEvent.save();

      return data;
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
