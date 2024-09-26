"use client";
import React from "react";
import Link from "next/link";
import { IoLogoWhatsapp } from "react-icons/io";

const WhatsAppButton = () => {
  return (
    <Link
      className="fixed bottom-6 z-[20] cursor-pointer left-5 print:hidden"
      href="https://api.whatsapp.com/send?phone=5213532464146&text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20productos."
      target="_blank"
    >
      <IoLogoWhatsapp className="text-background text-[2.5rem] hover:scale-110 ease-in-out duration-300" />
    </Link>
  );
};

export default WhatsAppButton;
