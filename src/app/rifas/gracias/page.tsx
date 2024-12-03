import LogoComponent from "@/components/logos/LogoComponent";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFacebook } from "react-icons/bs";
import { FaFacebook, FaFacebookF } from "react-icons/fa6";
import { PiFacebookLogo } from "react-icons/pi";

const graciasPage = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#22315A] to-[#3A559A]">
      <LogoComponent className=" self-center mx-auto" />

      <div className="flex flex-col items-center gap-2 mt-2">
        <h3 className="text-xl">Gracias por Suscribirte</h3>

        <Image
          src={"/icons/facebook3d.webp"}
          alt="facebook"
          width={300}
          height={300}
        />
        <Link href={"https://www.facebook.com/yunuencompany"} target="_blank">
          <div className="text-4xl">
            <p>SÍGUENOS EN</p>
            <p className="text-5xl font-black">FACEBOOK</p>
          </div>
          <div>
            <div className="relative flex items-center w-[300px] h-20">
              <FaFacebookF
                className="text-white bg-blue-800 p-4 rounded-full border-white border-8 absolute z-10 left-0"
                size={100}
              />
              <div className="bg-white p-3 rounded-r-lg absolute z-1 left-16 text-right">
                <span className="text-black pl-2">@yunuencompany</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default graciasPage;
