import React from "react";
import Image from "next/image";
import Link from "next/link";
import ImageUpMotion from "../motions/ImageUpMotion";
import ImageOpacityMotion from "../motions/ImageOpacityMotion";
import TextOpacityMotion from "../motions/TextOpacityMotion";

const MainHeroComponent = () => {
  return (
    <div
      className={`min-w-full min-h-[900px] maxmd:min-h-[700px] maxsm:min-h-[500px] relative flex flex-col justify-center items-center `}
    >
      <div className="z-10 w-full">
        <TextOpacityMotion
          title={"Alta Moda"}
          subtitle={
            "¡Bienvenido a OFERTAZOSMX, tu destino exclusivo para el lujo y la moda de clase mundial!"
          }
          className={""}
        />
      </div>
      <ImageOpacityMotion
        imgSrc={"/images/main_stylish_model.png"}
        imgWidth={650}
        imgHeight={650}
        className={"grayscale absolute bottom-0 z-10"}
      />

      <div className="h-full flex flex-wrap bg-gray-300 w-1/2 absolute bottom-0 right-0 z-0" />
    </div>
  );
};

export default MainHeroComponent;
