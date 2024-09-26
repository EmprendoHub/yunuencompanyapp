"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const MultiDivHero = () => {
  return (
    <div className="flex flex-col items-start justify-start">
      <div className="flex minmd:flex-row flex-col items-start justify-start max-w-full">
        <div className="relative minmd:min-w-[60vw] min-w-[100vw] maxsm:max-w-full min-h-[60vh] bg-gray-100 ">
          <div className="mt-10 absolute z-10 text-foreground top-0 left-0 maxsm:left-9 w-full px-5">
            <motion.h2
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-5xl maxmd:text-2xl font-black font-EB_Garamond uppercase text-white drop-shadow-lg"
            >
              {"Luce Espectacular"}
            </motion.h2>
            <motion.h3
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className=" minlg:text-[8rem] maxmd:text-[4rem] maxlg:text-[5rem] maxxsm:text-[1.5rem] text-[3.5rem]  drop-shadow-lg text-gray-100 uppercase pb-3 leading-none"
            >
              {"Fashion Moda"}
            </motion.h3>
          </div>
          {/* overlay */}
          <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
          <div className=" absolute z-10 text-white bottom-0 right-4 p-7 maxxsm:p-2">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9 }}
              className="flex flex-col items-center justify-center gap-3"
            >
              <div className="p-1 border-white border-4 drop-shadow-md text-center">
                <h2 className="p-1 drop-shadow-md  text-xl font-black uppercase text-white ">
                  {"Modelos Únicos"}
                </h2>
                <h3 className="  drop-shadow-md  font-black uppercase pb-3 leading-none">
                  {"Completa Tu Closet"}
                </h3>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="  drop-shadow-md text-3xl font-black uppercase leading-none">
                  Marcas
                </h3>
                <h3 className=" text-white text-3xl drop-shadow-md  font-black uppercase pb-3 leading-none">
                  Reconocidas
                </h3>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative max-h-[60vh] maxsm:min-h-[80vh] w-full"
          >
            <Image
              src={
                "/images/ummer-fashion-style-dress-wearing-sunglasses-purse-silvers-sneakers.jpg"
              }
              width={1000}
              height={1000}
              alt="main image"
              className=" grayscale object-cover min-h-[60vh] w-full"
            />
          </motion.div>
        </div>
        <div className="relative minmd:min-w-[40vw] min-w-[100vw] min-h-[60vh] bg-gray-300">
          {/* overlay */}
          <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
          <div className="min-h-[40%] flex flex-col justify-center absolute z-10 max-w-[60%] maxmd:max-w-[70%] text-white top-0 left-0  p-7 ">
            <motion.h2
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="text-4xl maxlg:text-2xl font-black uppercase pb-3 text-white"
            >
              Looks Extraordinarios
            </motion.h2>
            <motion.h3
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-xl maxlg:text-base font-black uppercase pb-3"
            >
              {"Nuevos Modelos"}
            </motion.h3>
            <motion.p
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9 }}
              className="minlg:text-[2rem] maxmd:text-[3rem] maxlg:text-[1.5rem] maxxsm:text-[2rem] text-[3.5rem] font-black uppercase pb-3 leading-none"
            >
              {"Prendas Únicas"}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0.3 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative min-h-[60vh]"
          >
            <Image
              src={"/images/stylish-autumn-outfit-back-hat.jpg"}
              width={1300}
              height={1300}
              alt="main image"
              className=" grayscale object-cover  min-h-[60vh] w-full"
            />
          </motion.div>
        </div>
      </div>
      <div className="min-w-full flex minmd:flex-row flex-col-reverse items-start justify-start">
        <div className="relative flex minmd:flex-row maxlg:flex-row-reverse maxsm:flex-col minmd:min-w-[40vw] min-w-[100vw] min-h-[30vh]">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className=" minmd:w-[48%] maxlg:w-[45%] maxsm:w-[100%] text-white bg-gradient-to-tr from-black to-black p-7 drop-shadow-md"
          >
            <h2 className="text-3xl maxlg:text-2xl font-black uppercase pb-3 text-white">
              Elegancia & Estilo
            </h2>
            <h3 className="text-xl uppercase pb-3">
              Encuentra tu nuevo look, no esperes mas.
            </h3>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative w-full min-h-[30vh]"
          >
            {/* overlay */}
            <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
            <Image
              src={"/images/stylish-high-heels.jpg"}
              alt="main image"
              fill={true}
              objectFit="cover"
              className="grayscale"
            />
          </motion.div>
        </div>
        <div className="relative flex minsm:flex-row flex-col minmd:min-w-[60vw] min-w-[100vw] min-h-[30vh] ">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative minmd:w-[48%] maxlg:w-[48%] maxsm:w-[100%] text-foreground bg-gradient-to-tr from-black to-black p-7 drop-shadow-md"
          >
            <h2 className="text-3xl maxlg:text-2xl font-black uppercase pb-3 text-white">
              Estilo y Fashion
            </h2>
            <h3 className="text-xl text-white uppercase pb-3">
              Las mejores marcas hasta la puerta de tu casa
            </h3>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9 }}
            className="relative w-full min-h-[30vh]"
          >
            {/* overlay */}
            <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
            <Image
              src={"/images/Hermosas_bolsas_de_marca_originales.jpeg"}
              alt="main image"
              fill={true}
              objectFit="cover"
              className="grayscale"
            />
          </motion.div>
        </div>
      </div>
      <div className="min-w-full flex minmd:flex-row flex-col-reverse items-start justify-start">
        <div className="relative flex minmd:flex-row maxlg:flex-row-reverse maxsm:flex-col min-w-[100%] ">
          <motion.div
            initial={{ x: -350, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className=" w-[50%] maxsm:w-full flex flex-row items-center gap-5 text-foreground bg-gradient-to-tr from-gray-100 to-gray-300 px-7 py-4 drop-shadow-md"
          >
            <h2 className="text-3xl maxlg:text-2xl font-black uppercase pb-1 text-foreground">
              Calzado Espectacular:
            </h2>
            <h3 className="text-2xl maxlg:text-xl font-black uppercase pb-1">
              Dolce Cabanna
            </h3>
          </motion.div>
          <motion.div
            initial={{ x: 350, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className=" w-[50%] maxsm:w-full flex flex-row items-center gap-5 text-white bg-gradient-to-tr from-black to-black px-7 py-4 drop-shadow-md"
          >
            <h2 className="text-3xl maxlg:text-2xl font-black uppercase pb-1 text-white">
              Bolsas de Marca:
            </h2>
            <h3 className="text-2xl maxlg:text-xl font-black uppercase pb-1">
              Coco Chanel
            </h3>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MultiDivHero;
