"use client";
import React from "react";
import Image from "next/image";
import { formatDate, formatTime } from "@/backend/helpers";

const AffiliateProfile = ({
  affiliate,
  orders,
}: {
  affiliate: any;
  orders: any;
}) => {
  return (
    <>
      <figure className="flex items-start sm:items-center text-foreground">
        <div className="relative">
          {affiliate?.image ? (
            <Image
              className="w-16 h-16 rounded-full mr-4"
              src={affiliate?.image ? affiliate?.image : "/next.svg"}
              alt={affiliate?.name ? affiliate?.name : "avatar"}
              width={50}
              height={50}
            />
          ) : (
            <div className="w-16 h-16 rounded-full mr-4 bg-black text-white flex items-center justify-center uppercase text-2xl font-EB_Garamond">
              {affiliate?.email.substring(0, 1)}
            </div>
          )}
        </div>
        <figcaption>
          <h5 className="font-semibold text-lg">
            {affiliate?.fullName}
            <span className="text-red-400 text-sm pl-2">( Afiliado )</span>
          </h5>
          <p>
            <b>Email:</b> {affiliate?.email}
          </p>
          <p>
            <b>Se Unió el: </b>
            {affiliate?.createdAt &&
              `${formatDate(
                affiliate?.createdAt.substring(0, 24)
              )} a las ${formatTime(
                affiliate?.createdAt.substring(0, 24)
              )} CST`}
          </p>
          <p>
            <b>Estado:</b>{" "}
            {affiliate?.isActive === true ? "Verificado" : "Inactivo"}
          </p>
        </figcaption>
      </figure>

      <hr className="my-4" />
      <div>
        <br />
        <p>Tel: {affiliate?.contact.phone}</p>
        <br />
        <b>Domicilio:</b>
        <p>{affiliate?.address.street}</p>
        <p>{affiliate?.address.city}</p>
        <p>{affiliate?.address.zip_code}</p>
        <p>{affiliate?.address.country}</p>
      </div>
    </>
  );
};

export default AffiliateProfile;
