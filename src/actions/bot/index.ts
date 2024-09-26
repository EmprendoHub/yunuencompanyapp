"use server";

import OpenAi from "openai";
import { Product } from "@/types";

const openai = new OpenAi({
  apiKey: process.env.OPEN_AI_KEY,
});

const extractUserContent = async (messages: any) => {
  return messages
    .filter((message: { role: string }) => message.role === "user")
    .map((message: { content: string }) => message.content)
    .join(" ");
};

export const onAiProductAssistant = async (
  _id: string,
  chat: { role: "assistant" | "user"; content: string }[],
  author: "user",
  message: string,
  product: Product
) => {
  try {
    // await dbConnect();

    const aiPromptRequest = await openai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `
          You are a highly knowledgeable and experienced sales representative for a ${product.title} that offers a valuable product or service. Your goal is to have a natural, human-like conversation with the customer in order to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or redirect them to a link if they havent provided all relevant information.
          Right now you are talking to a customer for the first time. Start by giving them a warm welcome on behalf of ${author} and make them feel welcomed.

          Your next task is lead the conversation naturally to get the customers email address. Be respectful and never break character

        `,
        },
        ...chat,
        {
          role: "user",
          content: message,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    if (aiPromptRequest) {
      const response = {
        role: "assistant",
        content: aiPromptRequest.choices[0].message.content,
      };

      return { response };
    }
  } catch (error: any) {
    console.log(error, "errors");
  }
};
