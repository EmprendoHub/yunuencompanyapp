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

interface LivePickerProps {
  postId: string;
}

const LivePicker: React.FC<LivePickerProps> = ({ postId }) => {
  const { getMessages, messages, subscribeToMessages, setMessageType } =
    useMessages();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [filteredMessages, setFilteredMessages] = useState(messages);
  const containerRef = useRef<HTMLDivElement>(null);

  subscribeToMessages();

  useEffect(() => {
    getMessages(postId);
  }, []);

  useEffect(() => {
    setFilteredMessages(
      messages?.filter((comment) =>
        comment.message.toLowerCase().includes(searchQuery.toLowerCase())
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

  console.log(messages);

  return (
    <div className="live-picker">
      <h2 className="title">Live Comments</h2>

      <input
        type="text"
        placeholder="Search messages..."
        className="search-input mb-3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div
        className="live-picker max-h-[80vh] overflow-y-auto"
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
                  comment.intent === "purchase" ? "bg-emerald-200" : "bg-white"
                }`}
              >
                <div className="flex flex-col">
                  <p
                    className={` text-[0.8rem]  ${
                      comment.type === "sold" ? "text-[#fff]" : "text-[#555]"
                    }`}
                  >
                    {comment.message}
                  </p>
                  <p className="comment-user">- {comment.userName}</p>
                  <p
                    className={` text-[0.6rem]  ${
                      comment.type === "sold" ? "text-[#e4e4e4]" : "text-[#555]"
                    }`}
                  >
                    {formatReadableDate(comment.createdAt)}
                  </p>
                </div>
                <div className="actions pl-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <p className="text-black">...</p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        {comment.type === "fake_share" ? (
                          <div
                            onClick={() =>
                              handleSetAsLiked(comment.facebookCommentId)
                            }
                            className="flex gap-2 items-center bg-slate-200 cursor-pointer text-gray-600 hover:text-blue-600 rounded-md p-1"
                          >
                            Dar Like <FaThumbsUp />
                          </div>
                        ) : comment.type === "sold" ? (
                          <div
                            onClick={() =>
                              handleCancelSold(
                                comment.facebookCommentId,
                                comment.id
                              )
                            }
                            className="flex gap-2 items-center bg-slate-200 cursor-pointer text-gray-600 hover:text-red-600 rounded-md p-1"
                          >
                            Cancelar <X />
                          </div>
                        ) : comment.intent === "purchase" ? (
                          <div
                            onClick={() =>
                              handleSetAsSold(
                                comment.facebookCommentId,
                                comment.id
                              )
                            }
                            className="flex gap-2 items-center bg-slate-200 cursor-pointer text-gray-600 hover:text-emerald-700 rounded-md p-1"
                          >
                            Vender <FaMoneyBill />
                          </div>
                        ) : (
                          <div
                            onClick={() =>
                              handleSetAsLiked(comment.facebookCommentId)
                            }
                            className="flex gap-2 items-center bg-slate-200 cursor-pointer text-gray-600 hover:text-blue-600 rounded-md p-1"
                          >
                            Dar Like <FaThumbsUp />
                          </div>
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
          className="new-messages-button hover:bg-emerald-700 bg-emerald-500 text-white fixed bottom-4 right-4 p-2 rounded-full shadow-md"
          onClick={handleScrollToBottom}
        >
          {newMessagesCount} New Message(s)
        </button>
      )}
    </div>
  );
};

export default LivePicker;
