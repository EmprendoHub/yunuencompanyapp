"use client";
import React, { useEffect, useRef, useState } from "react";
import "./slideronestyle.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function OverlaySlider() {
  const slides = [
    {
      image: "/images/shopout_about_us_cover.jpg",
      name: "LUNDEV 6",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      image: "/images/fendi-palacio-cover.webp",
      name: "LUNDEV 1",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      image: "/images/Hermosas_bolsas_de_marca_originales.jpeg",
      name: "LUNDEV 2",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      image: "/images/Christian_Dior.webp",
      name: "LUNDEV 3",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      image: "/images/stylish-high-heels.jpg",
      name: "LUNDEV 4",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
    {
      image:
        "/images/ummer-fashion-style-dress-wearing-sunglasses-purse-silvers-sneakers.jpg",
      name: "LUNDEV 5",
      description:
        "Tinh ru anh di chay pho, chua kip chay pho thi anhchay mat tieu",
    },
  ];
  const slideRef = useRef<HTMLDivElement | null>(null);
  const [currentImage, setCurrentImage] = useState(slides[0].image);

  const moveNext = () => {
    const lists: any = slideRef.current?.querySelectorAll(".item");
    const lastItem = lists[lists.length - 1];

    slideRef.current?.prepend(lastItem);
    if (lists.length > 1) {
      slideRef.current?.prepend(lastItem.cloneNode(true));
      slideRef.current?.removeChild(lists[lists.length - 1]);
    }
  };
  const movePrev = () => {
    const lists: any = slideRef.current?.querySelectorAll(".item");
    const firstItem = lists[0];
    slideRef.current?.appendChild(firstItem);
    if (lists.length > 1) {
      slideRef.current?.appendChild(firstItem.cloneNode(true));
      slideRef.current?.removeChild(firstItem);
    }
  };

  return (
    <div className=" min-h-full ">
      <div className="container" ref={slideRef}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="item"
            style={{
              backgroundImage: `url('${slides[index].image}')`,
            }}
          >
            <div className="content">
              <div className="name">{slide.name}</div>
              <div className="des">{slide.description}</div>
              <button>See more</button>
            </div>
          </div>
        ))}
      </div>
      <div className="buttons justify-center items-center">
        <button id="prev" onClick={movePrev}>
          <FaAngleLeft />
        </button>
        <button id="next" onClick={moveNext}>
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
}

export default OverlaySlider;
