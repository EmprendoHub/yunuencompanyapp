"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TiendaPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/tienda");
  }, []);

  return <></>;
};

export default TiendaPage;
