import React from "react";
import ScrapeSearchBar from "./_components/ScrapeSearchBar";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import ProductCarousel from "../product/_components/ProductCarousel";
import { getAllProducts } from "@/actions/scraper";
import ProductCard from "../product/_components/ProductCard";
import { BsAmazon } from "react-icons/bs";

const ScraperPage = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-card p-5 w-[95%] m-auto border-2 border-secondary rounded-[10px] mt-3">
        <p className="text-xs text-primary mb-5 flex gap-1 items-center justify-center">
          Smart shopping start here: <ArrowRight size={15} />
        </p>
        <h1 className="text-3xl font-bold flex flex-wrap items-end gap-2">
          Unleash the power of{" "}
          <Image alt="logo" src="/icons/logo.svg" width={150} height={150} />{" "}
          <p className="flex items-center">
            <BsAmazon />
            <span className="text-orange-500">Amazon </span>Scraper
          </p>
        </h1>
        <p className="mt-6 text-xs text-secondary">
          AI Powered, self-serve product and growth analytics to help you
          convert, engage, and retain more customers.
        </p>
        <ScrapeSearchBar />
        <div className="relative w-[95%]">
          {" "}
          <ProductCarousel products={allProducts} />
        </div>
      </div>
      <section className=" p-4 h-full">
        <h2 className="text-2xl font-bold mb-4">Trending</h2>
        <div className="flex flex-wrap gap-8">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default ScraperPage;
