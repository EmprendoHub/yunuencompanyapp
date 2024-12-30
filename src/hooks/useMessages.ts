import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const useMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const getMessages = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("postId", postId)
        .order("createdAt", { ascending: true });

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.log("error getting messages", error);
    }
  };

  const subscribeToMessages = async () => {
    supabase
      .channel("messages-followup")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload: any) => {
          setMessages((prevMessages) => {
            const exists = prevMessages.some(
              (message) => message.id === payload.new.id
            );

            // Only add the new message if it doesn't already exist
            if (!exists) {
              return [...prevMessages, payload.new];
            }

            return prevMessages;
          });
        }
      )
      .subscribe();
  };

  const setMessageType = async (id: string, type: string) => {
    console.log("set message type");
    try {
      const { data, error } = await supabase
        .from("messages")
        .update({ type })
        .eq("id", id);

      if (error) {
        console.error("Error updating message type:", error);
      } else {
        console.log("Message type updated successfully:", data);

        // Update local state to reflect the change
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === id ? { ...message, type } : message
          )
        );
      }
    } catch (error) {
      console.error("Error in setMessageType function:", error);
    }
  };

  const getSupabaseFBComments = async (videoId: string) => {
    const video = videoId || "421878677666248_122131066880443689";

    try {
      const { data: commentsData, error } = await supabase
        .from("comments") // Replace with your Supabase table name
        .select("*")
        .eq("postId", video)
        .order("createdAt", { ascending: false });

      setMessages([...messages, commentsData]);
      if (error) {
        console.error("Error fetching comments from Supabase:", error);
        return { status: 500, error };
      }

      return {
        status: 200,
        commentsData: JSON.stringify(commentsData),
        commentsDataCount: commentsData?.length || 0,
      };
    } catch (error: any) {
      console.error("Error setting up request:", error);
      return { status: 500, error };
    }
  };

  return {
    messages,
    setMessages,
    getMessages,
    subscribeToMessages,
    setMessageType,
    getSupabaseFBComments,
  };
};
