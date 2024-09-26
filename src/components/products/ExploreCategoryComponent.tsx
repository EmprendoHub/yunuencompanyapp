import SectionTitle from "@/components/texts/SectionTitle";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ExploreCategoryComponent = () => {
  return (
    <div className="px-24 py-20 maxlg:px-1 maxmd:pt-1 mb-20">
      <div className="mx-auto">
        <SectionTitle
          className="pb-10 text-5xl maxmd:text-3xl text-center"
          title={
            "Categorías Destacadas para Prendas, Bolsas y Accesorios Exclusivos"
          }
          subtitle={
            "Desde prendas de alta costura hasta accesorios que complementan tu estilo único, sumérgete en un mundo de opciones premium que elevan tu experiencia de moda a nuevas alturas."
          }
        />
      </div>
      <div className="flex flex-row maxmd:flex-wrap items-center">
        <div className="flex flex-row maxsm:flex-col w-full">
          <Link
            href={`/tienda?keyword=Balenciaga`}
            className="colone p-4 cursor-pointer hover:scale-[105%] duration-300 ease-in-out w-full grayscale hover:grayscale-0 "
          >
            <div className="box relative mx-auto items-center justify-center flex ">
              <Image
                src={"/images/Balenciaga.jpg"}
                width={400}
                height={400}
                alt="Explora Balenciaga category"
                className="w-full min-h-[500px] max-h-[600px] object-cover "
              />
              <span className="absolute z-50 bg-background text-foreground uppercase py-2 px-5 maxsm:px-2 maxmd:text-xs top-1/2 font-playfair-display tracking-wide">
                {"Explora Balenciaga"}
              </span>
            </div>
          </Link>
          <Link
            href={`/tienda?keyword=Christian Dior`}
            className="coltwo p-4 cursor-pointer hover:scale-[105%] duration-300 ease-in-out  w-full grayscale hover:grayscale-0 "
          >
            <div className="box relative mx-auto items-center justify-center flex ">
              <Image
                src={"/images/Christian_Dior.webp"}
                width={400}
                height={400}
                alt="Explore Christian Dior category"
                className="w-full min-h-[500px] max-h-[600px] object-cover "
              />
              <span className="absolute z-50 bg-background text-foreground uppercase py-2 px-5 maxsm:px-2 maxmd:text-xs top-1/2 font-playfair-display tracking-wide">
                {"Explore Christian Dior"}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-row maxsm:flex-col w-full">
          <Link
            href={`/tienda?keyword=Fendi`}
            className="colthree p-4 cursor-pointer hover:scale-[105%] duration-300 ease-in-out  w-full grayscale hover:grayscale-0 "
          >
            <div className="box object-fit relative mx-auto items-center justify-center flex">
              <Image
                src={"/images/fendi-palacio-cover.webp"}
                width={400}
                height={400}
                alt="Explora Fendi category"
                className="w-full min-h-[500px] max-h-[600px] object-cover "
              />
              <span className="absolute z-50 bg-background text-foreground uppercase py-2 px-5 maxsm:px-2 maxmd:text-xs top-1/2 font-playfair-display tracking-wide">
                {"Explora Fendi"}
              </span>
            </div>
          </Link>
          <Link
            href={`/catalog?category=ballgown`}
            className="colfour p-4 cursor-pointer hover:scale-[105%] duration-300 ease-in-out  w-full grayscale hover:grayscale-0 "
          >
            <div className="box relative mx-auto items-center justify-center flex">
              <Image
                src={"/images/Gucci.webp?w=1080&q=75"}
                width={400}
                height={400}
                alt="Explora Gucci category"
                className="w-full min-h-[500px] max-h-[600px] object-cover "
              />
              <span className="absolute z-50 bg-background text-foreground uppercase py-2 px-5 maxsm:px-2 maxmd:text-xs top-1/2 font-playfair-display tracking-wide">
                {"Explora Gucci"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExploreCategoryComponent;
