"use client";

import { useEffect, useState } from "react";
import { createHash } from "crypto";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { hasCookie, setCookie, getCookie } from "cookies-next";

const MercadoTokenUpdate = ({ searchParams }: { searchParams: any }) => {
  const [error, setError] = useState("");
  const [code, setCode] = useState(searchParams?.code);
  const [token, setToken] = useState("");

  const handleRefreshToken: any = async (authCode: string) => {
    try {
      const response = await fetch("/api/updatetoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const tokenResponse = await response.json();
      if (tokenResponse.error) {
        setError(tokenResponse.error);
        return;
      }
      setToken(tokenResponse.access_token);
      setCookie("mercadotoken", tokenResponse.access_token);
    } catch (err: any) {
      setError("Error al crear token: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Image
        src={"/icons/mercadolibre-svgrepo-com.svg"}
        alt="MercadoLibre"
        width={200}
        height={200}
        className="w-[80px] h-[80px}"
      />
      <div>
        <div className="flex flex-col items-center justify-center">
          <h1>Update Token for MercadoLibre</h1>
          <p className="text-xs mb-3">Token: {token}</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button onClick={handleRefreshToken} size={"sm"}>
            Update Token
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MercadoTokenUpdate;
