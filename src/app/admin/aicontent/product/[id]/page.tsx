import { getProductById, getSimilarProducts } from "@/actions/scraper";
import { formatNumber } from "@/lib/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import PriceInfoCard from "../_components/PriceInfoCard";
import { Button } from "@/components/ui/button";
import ProductCard from "../_components/ProductCard";

interface Props {
  params: {
    id: string;
  };
}

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);
  const similarProducts = await getSimilarProducts(id);

  if (!product) redirect("/icons/");

  return (
    <div className="product-container">
      <div className="flex gap-8 xl:flex-row flex-col">
        <div className="sm:max-w-[300px] max-w-full relative">
          <Image
            src={product.images[0].url}
            alt={product.title}
            width={800}
            height={800}
            className="mx-auto"
          />
          <div className=" relative flex flex-wrap  gap-1 mt-2">
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image.url}
                alt={product.title}
                width={150}
                height={150}
                className="w-12 h-12 "
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex flex-wrap justify-between items-start gap-5 pb-6">
            <div className="flex flex-col gap-3">
              <p className="text-xl font-bold">{product.title}</p>
              {product.domain?.includes("amazon") ? (
                <Link
                  href={product.url}
                  target="_blank"
                  className="text-base text-orange-500 flex items-center gap-1"
                >
                  <Image
                    src={"/icons/amazon-color-svgrepo-com.svg"}
                    alt="amazon"
                    width={20}
                    height={20}
                    className="inline"
                  />
                  Visit in Amazon
                </Link>
              ) : (
                <Link
                  href={product.url}
                  target="_blank"
                  className="text-base text-yellow-500 flex items-center gap-1"
                >
                  <Image
                    src={"/icons/mercadolibre-svgrepo-com.svg"}
                    alt="mercadoLibre"
                    width={20}
                    height={20}
                    className="inline"
                  />
                  Visit in Mercado Libre
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts ">
                <Image
                  src={"/icons/heart-svgrepo-com.svg"}
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-red-400">
                  {product.reviewCount}
                </p>
              </div>
              <p className="p-2 bg-card rounded-[10px] ">
                <Image
                  src={"/icons/bookmark-square-minimalistic-svgrepo-com.svg"}
                  alt="bookmark"
                  width={30}
                  height={30}
                  className="inline"
                />
              </p>
              <p className="p-2 bg-card rounded-[10px] ">
                <Image
                  src={"/icons/share-svgrepo-com.svg"}
                  alt="share"
                  width={30}
                  height={30}
                  className="inline"
                />
              </p>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-3xl text-secondary font-bold">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className="text-xl opacity-50 font-bold line-through">
                {product.currency} {formatNumber(product.originalPrice)}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="product-stars">
                  <Image
                    src={"/icons/star.svg"}
                    alt="star"
                    width={20}
                    height={20}
                  />
                  <p>{product.stars}</p>
                </div>

                <div className="product-reviews rounded-[20px] bg-card">
                  <Image
                    src={"/icons/comment.svg"}
                    alt="comment"
                    width={20}
                    height={20}
                  />
                  <p className="text-xs text-secondary font-semibold">
                    {product.reviewCount}
                  </p>
                </div>
              </div>

              <p className="text-sm opacity-50">
                <span className="text-primary font-semibold">93% </span> of
                buyers have recommended this
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc={`/icons/pricetag-sharp-svgrepo-com.svg`}
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
                borderColor="primary"
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc={`/icons/charts.svg`}
                value={`${product.currency} ${formatNumber(
                  product.currentPrice
                )}`}
                borderColor="primary"
              />
            </div>
          </div>
          Modal
        </div>
      </div>
      <div className="flex flex-col gap-16  border-l-primary">
        <div className="flex flex-col gap-5">
          <h3 className="ml-2 text-2xl font-semibold text-secondary">
            Description
          </h3>
          <div className="flex flex-col gap-4 p-2 text-xs">
            {product.description}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="ml-2 text-2xl font-semibold text-secondary">
            Especificaciones
          </h3>
          <div className="flex flex-col gap-4 p-2 text-xs">
            {product.details.map((detail, index) => (
              <div key={index}>
                <p className="flex items-center gap-2">
                  <span>{detail.key}:</span>
                  <span>{detail.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" className=" w-1/2 mx-auto">
          <Image
            src={"/icons/save-svgrepo-com.svg"}
            alt="save"
            width={20}
            height={20}
            className="inline"
          />
          <Link href={"/icons/"} className=" text-xs">
            Save
          </Link>
        </Button>
      </div>
      {similarProducts && similarProducts?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">Similar Products</p>
          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
