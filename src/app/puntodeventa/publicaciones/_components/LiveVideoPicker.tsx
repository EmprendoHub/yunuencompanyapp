"use client";
import React, { useEffect, useState } from "react";
import "./video.css";
import Link from "next/link";
import { useSupabase } from "@/hooks/useSupabase";
import Image from "next/image";
import { formatReadableDate } from "@/lib/utils";

interface WinnerData {
  ticketNumber: string;
  name?: string;
  prize: string;
}

const LiveVideoPicker = ({
  data,
  pagingData,
}: {
  data: string;
  pagingData?: string;
}) => {
  const { getSupaSession } = useSupabase();

  useEffect(() => {
    getSupaSession();
  }, []);

  const lives = JSON.parse(data || "[]");

  // Function to modify width and height of the iframe
  const adjustEmbedHtml = (html: string, width: number, height: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const videoElement = tempDiv.querySelector("iframe");

    if (videoElement) {
      videoElement.setAttribute("width", width.toString());
      videoElement.setAttribute("height", height.toString());
    }

    return tempDiv.innerHTML;
  };

  return (
    <div className="flex items-center ">
      <div className="w-1/2">
        <div className="bg-card  p-3 rounded-md h-screen overflow-y-auto">
          <h3 className=" font-bold text-2xl">Publicaciones</h3>
          <hr className="my-3 maxmd:my-1 " />
          {lives.map((live: any, i: number) => (
            <div key={i} className="flex flex-col">
              <p className="text-xs text-gray-600">
                {" "}
                {formatReadableDate(live.created_time)}
              </p>
              <Link
                className="text-blue-500"
                href={`/puntodeventa/live/${live.id}`}
              >
                <div className="text-xs">{live.message}</div>
                {/* Render embed_html as raw HTML */}
                {/* <div className="w-40 h-auto bg-background rounded-md">
                <div
                  dangerouslySetInnerHTML={{
                    __html: adjustEmbedHtml(live.embed_html, 200, 300), // Change dimensions here
                  }}
                />
              </div> */}
                <Image
                  src={
                    live.imageUrl ||
                    "/images/product-placeholder-minimalist.jpg"
                  }
                  alt="post-image"
                  width={100}
                  height={150}
                  priority
                  className="rounded-md w-auto h-auto"
                />
              </Link>

              <hr className="my-3 maxmd:my-1 " />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveVideoPicker;
