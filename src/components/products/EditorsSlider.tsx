"use client";
import SectionTitle from "../texts/SectionTitle";
import React from "react";
import ProductCard from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const EditorsSlider = ({ editorsProducts }: { editorsProducts: any }) => {
  const settings = {
    dots: true,
    lazyLoad: true,
    centerMode: true,
    infinite: true,
    initialSlide: 0,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    arrows: false,
    className: "center mx-auto flex max-w-[100vw]",
    responsive: [
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "10px",
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="relative">
      <Carousel>
        <CarouselContent>
          {editorsProducts.slice(0, 12).map((product: any, index: number) => {
            return (
              <CarouselItem key={product._id}>
                <ProductCard item={product} key={index} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default EditorsSlider;
