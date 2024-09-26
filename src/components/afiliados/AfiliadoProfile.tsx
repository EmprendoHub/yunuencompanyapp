"use client";
import React, { useContext } from "react";
import Image from "next/image";
import AuthContext from "@/context/AuthContext";
import { formatDate, formatTime } from "@/backend/helpers";

const AfiliadoProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <figure className="flex items-start sm:items-center text-foreground">
        <div className="relative">
          <Image
            className="w-16 h-16 rounded-full mr-4"
            src={user?.image ? user?.image : "/next.svg"}
            alt={user?.name ? user?.name : "avatar"}
            width={50}
            height={50}
          />
        </div>
        <figcaption>
          <h5 className="font-semibold text-lg">
            {user?.name}
            <span className="text-red-400 text-sm pl-2">( {user?.role} )</span>
          </h5>
          <p>
            <b>Email:</b> {user?.email}
          </p>
          <p>
            <b>Se Unió el: </b>
            {user?.createdAt &&
              `${formatDate(
                user?.createdAt.substring(0, 24)
              )} a las ${formatTime(user?.createdAt.substring(0, 24))} CST`}
          </p>
        </figcaption>
      </figure>

      <hr className="my-4" />
    </>
  );
};

export default AfiliadoProfile;
