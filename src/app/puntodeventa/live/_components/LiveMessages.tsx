"use client";

import React, { useEffect, useRef, useState } from "react";
import "./live.css";
import { useMessages } from "@/hooks/useMessages";
import { formatReadableDate } from "@/lib/utils";
import { likeToFBComment, respondToFBComment } from "@/app/_actions";
import { X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaThumbsUp } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa6";
import { useClients } from "@/hooks/useClients";

interface LivePickerProps {
  postId: string;
}

const LiveMessages: React.FC<LivePickerProps> = ({ postId }) => {
  const {
    getMessages,
    messages,
    subscribeToMessages,
    setMessageType,
    newMessagesCount,
    setNewMessagesCount,
  } = useMessages();
  const { getClients, clients, subscribeToClients } = useClients();
  const [winningNumber, setWinningNumber] = useState<string | null>(null);
  subscribeToClients();

  useEffect(() => {
    getClients(postId);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const containerRef = useRef<HTMLDivElement>(null);

  subscribeToMessages();

  useEffect(() => {
    getMessages(postId);
  }, []);

  useEffect(() => {
    setFilteredMessages(
      messages?.filter(
        (comment) =>
          comment.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [messages, searchQuery]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const handleScroll = () => {
        const atBottom =
          container.scrollTop + container.clientHeight >=
          container.scrollHeight;
        if (atBottom) {
          setNewMessagesCount(0);
        }
      };
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleNewMessage = () => {
    setNewMessagesCount((count) => count + 1);
  };

  const handleScrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setNewMessagesCount(0);
    }
  };

  const handleSetAsSold = async (commentId: string, id: string) => {
    await setMessageType(id, "sold");
    await respondToFBComment(
      commentId,
      "Gracias por tu compra este articulo te lo ganaste tu!"
    );
  };

  const handleCancelSold = async (commentId: string, id: string) => {
    await setMessageType(id, "purchase");
    await respondToFBComment(
      commentId,
      "Una disculpa hubo un error y este articulo se lo gano alguien mas!"
    );
  };

  const handleSetAsLiked = async (commentId: string) => {
    await likeToFBComment(commentId);
  };

  return (
    <section className="max-h-[100dvh] flex flex-col items-center p-5">
      <div className="live-picker relative flex flex-col items-center">
        <input
          type="text"
          placeholder="Buscar comentario..."
          className="search-input mb-3 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div
          className="live-picker max-h-[70vh] overflow-y-auto"
          ref={containerRef}
        >
          <div className="comment-list">
            {filteredMessages?.map((comment, index) => (
              <div key={index}>
                <div
                  className={`comment flex ${
                    comment.type === "fake_share"
                      ? "bg-yellow-400"
                      : comment.type === "sold"
                      ? "bg-emerald-700"
                      : ""
                  } ${
                    comment.intent === "purchase"
                      ? "bg-emerald-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex flex-col w-full">
                    <p
                      className={` text-[0.7rem]  ${
                        comment.type === "sold" ? "text-[#fff]" : "text-[#555]"
                      }`}
                    >
                      {comment.message}
                    </p>
                    <div className="flex maxmd:flex-col items-center justify-between min-w-full">
                      <p className="comment-user">- {comment.userName}</p>
                      <p
                        className={` text-[0.6rem]  ${
                          comment.type === "sold"
                            ? "text-[#e4e4e4]"
                            : "text-[#9b9a9a]"
                        }`}
                      >
                        {formatReadableDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="actions pl-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <p className="text-black">...</p>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        onCloseAutoFocus={(event) => event.preventDefault()}
                      >
                        <DropdownMenuLabel>
                          {comment.type === "fake_share" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                handleSetAsLiked(comment.facebookCommentId);
                              }}
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 rounded-full p-1 cursor-pointer"
                            >
                              <FaThumbsUp />
                            </DropdownMenuItem>
                          ) : comment.type === "sold" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                handleCancelSold(
                                  comment.facebookCommentId,
                                  comment.id
                                );
                              }}
                              className="flex items-center gap-2 text-gray-600 hover:text-red-600 rounded-full p-1 cursor-pointer"
                            >
                              <X />
                            </DropdownMenuItem>
                          ) : comment.intent === "purchase" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                handleSetAsSold(
                                  comment.facebookCommentId,
                                  comment.id
                                );
                              }}
                              className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 rounded-full p-1 cursor-pointer"
                            >
                              <FaMoneyBill />
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                handleSetAsLiked(comment.facebookCommentId);
                              }}
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 rounded-full p-1 cursor-pointer"
                            >
                              <FaThumbsUp />
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {newMessagesCount > 0 && (
          <button
            className="new-messages-button hover:bg-blue-700 bg-black text-white text-xs absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 rounded-full shadow-md"
            onClick={handleScrollToBottom}
          >
            {newMessagesCount} Mensaje{newMessagesCount > 1 && "s"} Nuevo
            {newMessagesCount > 1 && "s"}
          </button>
        )}
      </div>
    </section>
  );
};

export default LiveMessages;
