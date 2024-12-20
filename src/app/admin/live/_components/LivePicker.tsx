"use client";

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./live.css";

interface Comment {
  message: string;
  userName: string;
}

interface LivePickerProps {
  initialData?: string;
}

const LivePicker: React.FC<LivePickerProps> = ({ initialData }) => {
  const data = JSON.parse(initialData || "[]");
  const [comments, setComments] = useState<Comment[]>(data);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io();

    setSocket(socketInstance);

    socketInstance.on("commentAdded", (newComment: Comment) => {
      setComments((prevComments) => [...prevComments, newComment]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div className="live-picker">
      <h2 className="title">Live Comments</h2>
      <div className="comment-list">
        {comments?.map((comment, index) => (
          <div key={index} className="comment">
            <p className="comment-message">{comment.message}</p>
            <p className="comment-user">- {comment.userName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePicker;
