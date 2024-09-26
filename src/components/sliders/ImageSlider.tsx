"use client";

import React, { useEffect, useRef, useState } from "react";
import "./slideronestyle.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { motion } from "framer-motion";

function OverlaySlider() {
  const slideList = [
    {
      id: 0,
      image: "/images/shopout_about_us_cover.jpg",
      name: "LUNDEV 1",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      id: 1,
      image: "/images/fendi-palacio-cover.webp",
      name: "LUNDEV 2",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      id: 2,
      image: "/images/Hermosas_bolsas_de_marca_originales.jpeg",
      name: "LUNDEV 3",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      id: 3,
      image: "/images/Christian_Dior.webp",
      name: "LUNDEV 4",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      id: 4,
      image: "/images/stylish-high-heels.jpg",
      name: "LUNDEV 5",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      id: 5,
      image:
        "/images/ummer-fashion-style-dress-wearing-sunglasses-purse-silvers-sneakers.jpg",
      name: "LUNDEV 6",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
  ];
  const slideRef = useRef<HTMLDivElement | null>(null);
  const [slides, setSlides] = useState(slideList);

  useEffect(() => {
    const nextButton: any = slideRef.current?.querySelector("#next");
    const prevButton: any = slideRef.current?.querySelector("#prev");

    const moveNext = () => {
      setSlides((prevSlides) => {
        const updatedSlides = prevSlides.map((slide) => ({ ...slide }));
        const lastItem: any = updatedSlides.pop();
        updatedSlides.unshift(lastItem);

        return updatedSlides;
      });
    };

    const movePrev = () => {
      setSlides((prevSlides) => {
        const updatedSlides = prevSlides.map((slide) => ({ ...slide }));
        const firstItem: any = updatedSlides.shift();
        updatedSlides.push(firstItem);

        return updatedSlides;
      });
    };

    nextButton.addEventListener("click", moveNext);
    prevButton.addEventListener("click", movePrev);

    return () => {
      nextButton.removeEventListener("click", moveNext);
      prevButton.removeEventListener("click", movePrev);
    };
  }, [setSlides]);

  return (
    <div className="container" ref={slideRef}>
      <div id="slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="item"
            style={{
              backgroundImage: `url('${slides[index].image}')`,
            }}
          >
            <div className="overlay bg-black" />
            <div className="content">
              <div className="name">{slide.name}</div>
              <div className="des">{slide.description}</div>
              <button>See more</button>
            </div>
          </div>
        ))}
      </div>
      <div className="buttons flex flex-row items-center justify-center gap-3">
        <button id="prev" className=" flex items-center justify-center">
          <FaAngleLeft />
        </button>
        <button id="next" className=" flex items-center justify-center">
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}

export default OverlaySlider;
