import Link from "next/link";
import React from "react";

const NoAutorizadoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className={
          "bg-background h-[80vh] flex items-center justify-center text-center mx-auto"
        }
      >
        <div>
          <h2 className="text-7xl font-EB_Garamond">No Autorizado</h2>
          <h3 className="font-bodyFont text-2xl mt-3">
            oh oh parece ser que no tienes permiso para continuar...
          </h3>
          <p className="text-lg">Explorando nuestros productos.</p>
        </div>
      </div>
    </div>
  );
};

export default NoAutorizadoPage;
