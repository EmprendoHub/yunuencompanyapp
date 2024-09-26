import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Templates from "@/app/(dashdata)/Templates";
import TemplateCard from "@/app/admin/aicontent/_components/TemplateCard";
import Image from "next/image";

export interface TEMPLATE {
  name: string;
  desc: string;
  icon: string;
  category: string;
  slug?: string;
  aiPromt?: string;
  form: FORM[];
}

export interface FORM {
  label: string;
  field: string;
  name: string;
  required?: boolean;
}

const ProductCarousel = ({ products }: { products: any }) => {
  return (
    <Carousel
      opts={{
        align: "end",
        loop: true,
      }}
    >
      <CarouselContent>
        {products.map((product: any) => (
          <CarouselItem
            key={product.title}
            className="pl-1 sm:basis-1 md:basis-1/2 lg:basis-1/3 flex flex-col items-center justify-center"
          >
            <Image
              alt="image"
              src={product.images[0].url}
              width={150}
              height={150}
              className="object-contain w-16 h-auto"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;
