import React from "react";
import ImageLeftMotion from "../motions/ImageLeftMotion";
import TextLeftMotion from "../motions/TextLeftMotion";
import TextRightMotion from "../motions/TextRightMotion";
import ImageRightMotion from "../motions/ImageRightMotion";

const BonusHero = ({ lottery }: { lottery: any }) => {
  return (
    <div className=" my-40 maxsm:my-20">
      {/* NO Background Hero */}
      <div className="flex minmd:flex-row-reverse flex-col items-start justify-start">
        <div className="relative flex flex-col items-center justify-center minmd:min-w-[40vw] min-w-[100vw] h-[40vh] maxsm:h-[35vh] my-5">
          <div className="min-h-[100%] absolute z-10 max-w-full text-white flex flex-col justify-center  p-7 drop-shadow-md">
            <TextLeftMotion
              title={"Descubre el Lujo a Tu Manera:"}
              subtitle={
                "En OFERTAZOSMX, te ofrecemos una exquisita selección de productos de lujo de marcas renombradas como Chanel, Louis Vuitton, y Dior. Desde accesorios de moda hasta prendas icónicas, nuestro catálogo es una expresión de sofisticación y buen gusto."
              }
              className={""}
            />
          </div>
        </div>
        <div className="relative minmd:min-w-[50vw] min-w-[100vw] min-h-[40vh] ">
          {" "}
          <div className="col-right w-full h-full">
            <ImageLeftMotion
              imgSrc={"/images/stylish-high-heels.jpg"}
              imgWidth={800}
              imgHeight={800}
              className={"w-full grayscale"}
            />
          </div>
        </div>
      </div>
      <div className="flex minmd:flex-row  flex-col items-start justify-start mt-20 maxsm:mt-0">
        <div className="relative flex flex-col items-center justify-center minmd:min-w-[40vw] min-w-[100vw] h-[40vh] maxsm:h-[35vh] ">
          <div className="min-h-[100%] absolute z-10 max-w-full text-white top-0 left-0 flex flex-col justify-center  p-7 drop-shadow-md">
            <TextRightMotion
              title={"Experiencia de Compra Sin Igual:"}
              subtitle={
                "Experimenta la comodidad de comprar en línea con la confianza de recibir productos auténticos y de alta calidad. Nos enorgullece ofrecer una experiencia de compra segura y fácil, respaldada por nuestro compromiso de excelencia en cada detalle."
              }
              className={""}
            />
          </div>
        </div>
        <div className="relative minmd:min-w-[50vw] min-w-[100vw] min-h-[40vh] ">
          <div className="col-right w-full h-full">
            <ImageRightMotion
              imgSrc={
                "/images/stylish-black-dress-sunglasses-holds-black-handbag.jpg"
              }
              imgWidth={800}
              imgHeight={800}
              className={"w-full grayscale"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusHero;
