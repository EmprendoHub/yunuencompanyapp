import Image from "next/image";
import React from "react";

const NoBgHero = ({ lottery }: { lottery: any }) => {
  return (
    <div className="w-full mb-20">
      {/* NO Background Hero */}
      <div className="flex minmd:flex-row flex-col-reverse items-start justify-start bg-slate-400 bg-opacity-60">
        <div className="relative minmd:min-w-[50vw] min-w-[100vw] min-h-[40vh] ">
          <div className="relative z-[1] flex flex-col items-center justify-center text-white p-7 maxxsm:p-2">
            {" "}
            <Image
              src={"/images/GTI_2024_no_bg.png"}
              alt="main image"
              width={600}
              height={600}
            />
          </div>
          {/* Blue square background */}
          <div className="h-[80%] maxsm:h-[60%] absolute z-[0] text-white top-[15%] maxsm:top-[7%] maxsm:w-[97%] w-[97%] left-0 bg-gradient-to-tr from-blue-800 to-blue-950 p-7 drop-shadow-md rounded-md" />
        </div>
        <div className="relative flex flex-col items-center justify-center minmd:min-w-[40vw] min-w-[100vw] h-[50vh] maxsm:min-h-[40vh]">
          <div className="min-h-[100%] absolute z-10 max-w-full text-white top-0 left-0 flex flex-col justify-center  p-7 drop-shadow-md">
            <h2 className="text-4xl maxlg:text-4xl font-black uppercase pb-3 text-blue-600">
              Con $150 y suerte podrás ganar como 1° premio GTI 2024 0km
            </h2>
            <h3 className="text-base font-black uppercase pb-3 text-slate-700">
              Lo mejor del Sorteo Navidad 2023 de Sorteos BAC Motors es que con
              solo $150 pesos ya estás participando por grandes premios que
              cumplirán tus millones de sueños.
            </h3>
            <div className="text-3xl bg-blue-900 w-1/2 maxsm:w-3/4 p-3  font-base uppercase leading-none">
              GTI 2024 0km
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoBgHero;
