"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const HostComment = () => {
  const [hostComment, setHostComment] = useState("");
  const handleNewHostComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    setHostComment(e.target.value);
  };

  const handleSendComment = async () => {
    try {
      console.log(hostComment);

      const payload = {
        object: "page",
        entry: [
          {
            id: "1234567890",
            time: 1698745600000,
            changes: [
              {
                field: "feed",
                value: {
                  from: {
                    id: "27758177473826994",
                    name: "Salvador Sandoval Sanchez",
                  },
                  post: {
                    id: "421878677666248_122131066880443689",
                    updated_time: Date.now(),
                  },
                  item: "comment",
                  verb: "add",
                  message: hostComment,
                  created_time: Math.floor(Date.now() / 1000), // Unix timestamp
                  post_id: "421878677666248_122131066880443689",
                  comment_id: Math.random().toString(36).substring(10),
                },
              },
            ],
          },
        ],
      };

      const res = await fetch("/api/facebook/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error sending comment:", errorData);
        setHostComment("");
        return;
      }

      const responseData = await res.json();
      console.log("Comment sent successfully:", responseData);
      setHostComment("");
    } catch (error) {
      setHostComment("");

      console.error("Error in handleSendComment:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={hostComment}
        placeholder="Escribe tu comentario"
        onChange={(e) => handleNewHostComment(e)}
      />
      <Button variant={"secondary"} onClick={handleSendComment}>
        Enviar
      </Button>
    </div>
  );
};

export default HostComment;
