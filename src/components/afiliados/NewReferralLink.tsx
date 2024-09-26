"use client";
import React, { useContext, useState } from "react";
import AuthContext from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const NewReferralLink = () => {
  const { addNewReferralLink, clearErrors, error } = useContext(AuthContext);
  const { data: session }: any = useSession();
  const [targetUrl, setTargetUrl] = useState("");
  const [metadata, setMetadata] = useState("");

  if (!session) {
    return <div>Cargando...</div>;
  }
  const submitHandler = (e: any) => {
    e.preventDefault();

    if (targetUrl === "") {
      toast(
        "Por favor complete el nombre y numero de la calle para continuar."
      );
      return;
    }

    const newLink = {
      targetUrl,
      metadata,
    };
    addNewReferralLink(newLink);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">
        Crear enlace de referencia para {session.user.name}
      </h1>
      <label className="block mb-4">
        URL de destino:
        <input
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="border p-2 w-full"
        />
      </label>
      <label className="block mb-4">
        Metadata (opcional):
        <input
          type="text"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          className="border p-2 w-full"
        />
      </label>
      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={submitHandler}
      >
        Crear enlace de Afiliado
      </button>
    </div>
  );
};

export default NewReferralLink;
