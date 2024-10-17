"use client";
import { setCookie, hasCookie } from "cookies-next";
import Link from "next/link";
import { useState, useEffect } from "react";
import SquareLogo from "../logos/SquareLogo";
import Image from "next/image";

const CookieConsentComp = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // If no consent cookie is present, show the consent popup
    if (!hasCookie("consent")) {
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    // When user accepts the consent, hide the popup and set a consent cookie
    setShowConsent(false);
    setCookie("consent", "true");
  };

  if (!showConsent) {
    return null;
  }
  return (
    <div className="backdrop fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[555]">
      <div className="bg-background ml-0 fixed bottom-1/4 maxsm:bottom-5 left-1/2 maxmd:left-1/3 w-full maxsm:w-[90%] maxmd:w-[80%] maxlg:w-1/2 maxxl:w-1/3 max-w-2xl pt-16 p-8 m-4 flex flex-col items-center justify-center transform -translate-x-1/2 maxmd:-translate-x-1/3  bg-secondary-gradient text-foreground z-[888] mx-auto shadow-lg rounded-md ">
        <SquareLogo className={""} />
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-xs mt-3">
            Utilizamos cookies para mejorar su experiencia. Utilizamos algunos{" "}
            <strong>paquetes de análisis estandarizados</strong> para comprender
            el comportamiento general del usuario, de modo que podamos descubrir
            cómo mejorar nuestro contenido. Al utilizar este sitio de forma
            continua, usted acepta dicho uso.
          </p>
          <div
            onClick={acceptConsent}
            className="mt-3 text-xs tracking-wide text-slate-700"
          >
            <Link href={"/politica"}>
              <p>Leer Mas...</p>
            </Link>
          </div>
          <div className="flex flex-col items-center gap3 mt-2">
            <button
              onClick={acceptConsent}
              className="bg-primary hover:bg-red-800 text-white text-sm px-6 py-2 rounded mr-2 tracking-wide my-t"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentComp;
