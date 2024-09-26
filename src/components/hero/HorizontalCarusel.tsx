"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const cards = [
  {
    url: "/images/vw_GTI_2024.jpg",
    title: "1 BOLETO POR $150 (8 oportunidades)",
    id: 1,
  },
  {
    url: "/images/vw_GTI_2024.jpg",
    title: "2 BOLETOS POR $300 (16 oportunidades)",
    id: 2,
  },
  {
    url: "/images/vw_GTI_2024.jpg",
    title: "3 BOLETOS POR $450 (24 oportunidades)",
    id: 3,
  },
  {
    url: "/images/vw_GTI_2024.jpg",
    title: "5 BOLETOS POR $750 (40 oportunidades)",
    id: 4,
  },
  {
    url: "/images/vw_GTI_2024.jpg",
    title: "10 BOLETOS POR $1,480 (80 oportunidades)",
    id: 5,
  },
  {
    url: "/images/vw_GTI_2024.jpg",
    title: "20 BOLETOS POR $2,950 (160 oportunidades)",
    id: 6,
  },
  {
    url: "/images/vw_GTI_2024.jpg",
    title: "50 BOLETOS POR $7,250 (400 oportunidades)",
    id: 7,
  },
];

const HorizontalCarousel = ({ lottery }: { lottery: any }) => {
  return (
    <div className="text-center pt-20 ">
      <h2 className="text-4xl maxlg:text-2xl font-black uppercase pb-3 text-blue-600">
        Lista de Boletos
      </h2>
      <h3 className="text-base font-black uppercase text-slate-700">
        Incrementa tus posibilidades de ganar en la compra de cada boleto para
        el Sorteo Navidad 2023 de Sorteos BAC Motors.
      </h3>
      <h3 className="text-base font-black uppercase text-slate-700 pb-10">
        Hasta 8 oportunidades de ganar con cada boleto.
      </h3>

      <HorizontalScrollCarousel />
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["45%", "-95%"]);

  return (
    <section ref={targetRef} className="relative h-[50vh]">
      <div className="sticky top-0 flex h-[50vh] maxsm:h-[50vh] items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card, index) => {
            return <Card card={card} key={index} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }: { card: any }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[350px] w-[350px]  drop-shadow-md overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>

      <div className="items-center justify-center absolute inset-0 z-10 flex flex-col place-content-center  ease-in-out duration-300 bg-black  bg-opacity-30">
        <p className="text-white bg-gradient-to-br from-white/20 to-white/0 p-8 text-3xl font-black uppercase ">
          {card.title}
        </p>
        <button className="bg-blue-800 w-3/4 p-3 text-xl uppercase">
          Comprar Boletos
        </button>
      </div>
    </div>
  );
};

export default HorizontalCarousel;
