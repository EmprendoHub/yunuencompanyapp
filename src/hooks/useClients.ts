import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const useClients = () => {
  const [clients, setClients] = useState<any[]>([]);

  const getClients = async (postId: string) => {
    try {
      console.log(postId);
      const { data, error } = await supabase
        .from("fb_clients")
        .select("*")
        .eq("postId", postId)
        .order("created_at", { ascending: true });

      console.log("data", data);

      console.log(data);
      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.log("error getting messages", error);
    }
  };

  const subscribeToClients = async () => {
    supabase
      .channel("clients-followup")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "fb_clients" },
        (payload: any) => {
          console.log(payload);
          setClients([...clients, payload.new]);
        }
      )
      .subscribe();
  };

  // const setMessageType = async (id: string, type: string) => {
  //   console.log("set message type");
  //   try {
  //     const { data, error } = await supabase
  //       .from("messages")
  //       .update({ type })
  //       .eq("id", id);

  //     if (error) {
  //       console.error("Error updating message type:", error);
  //     } else {
  //       console.log("Message type updated successfully:", data);

  //       // Update local state to reflect the change
  //       setMessages((prevMessages) =>
  //         prevMessages.map((message) =>
  //           message.id === id ? { ...message, type } : message
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error in setMessageType function:", error);
  //   }
  // };

  return {
    clients,
    setClients,
    getClients,
    subscribeToClients,
  };
};
