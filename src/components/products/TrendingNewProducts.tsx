"use client";
import SectionTitle from "../texts/SectionTitle";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

function shuffleArray(array: any) {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

const TrendingNewProducts = ({ trendProducts }: { trendProducts: any }) => {
  const cat_title = [
    { id: 1, category: "Bolsas" },
    { id: 2, category: "Prendas" },
    { id: 3, category: "Accesorios" },
    { id: 4, category: "Belleza" },
    { id: 5, category: "Joyeria" },
  ];
  const [allProducts, setAllProducts] = useState(trendProducts);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const activatedTab = (category: any) => {
    setActiveTab(category);

    const productsArray = Object.values(allProducts);
    const randommized = shuffleArray(productsArray);

    const filteredProductData: any = productsArray.filter(
      (prod: any) => prod.category === category
    );
    if (category === "All") {
      setTrendingProducts(randommized);
    } else {
      setTrendingProducts(filteredProductData);
    }
  };

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     try {
  //       const URL_ALL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/productstrend`;
  //       const res_all = await fetch(URL_ALL, { cache: 'no-store' });
  //       const data_trending = await res_all.json();
  //       //let sliced_products = data_trending.products.slice(0, 50)
  //       let sliced_products = data_trending.products.map((product) => {
  //         return {
  //           _id: product._id,
  //           title: product.title,
  //           description: product.description,
  //           category: product.category,
  //           brand: product.brand,
  //           featured: product.featured,
  //           price: product.price,
  //           salesPrice: product.sale_price,
  //           images: product.images,
  //           sizes: product.sizes,
  //           rating: product.rating,
  //           quantity: product.quantity,
  //           sku: product.sku,
  //         };
  //       });
  //       setAllProducts(sliced_products);
  //       setTrendingProducts(sliced_products);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchDetails();
  // }, []);

  return (
    <div className="mx-auto flex flex-col justify-center items-center px-40 mb-20">
      <SectionTitle
        className="pb-10 text-5xl maxmd:text-3xl text-center"
        title={"Explora la Elegancia"}
        subtitle={
          "Descubre una selección excepcional de categorías cuidadosamente curadas que resaltan la sofisticación en cada detalle. Desde prendas de alta costura hasta accesorios que complementan tu estilo único, sumérgete en un mundo de opciones premium que elevan tu experiencia de moda a nuevas alturas."
        }
      />

      <ul className="grid grid-cols-4 gap-4 my-2 px-10 maxmd:gap-2 maxmd:px-2">
        {cat_title.map((item, index) => {
          return (
            <li
              key={index}
              className={`${
                activeTab == item.category
                  ? "active"
                  : "border-b border-gray-500"
              } cursor-pointer text-center  py-2 px-6 maxsm:px-2 text-sm text-foreground maxsm:text-xs uppercase font-playfair-display`}
              onClick={() => activatedTab(item.category)}
            >
              {item.category}
            </li>
          );
        })}
      </ul>
      <motion.div
        className="w-full  flex flex-row maxmd:flex-col gap-4 my-10 px-10 maxsm:px-2 mx-auto justify-center items-center object-fill"
        layout
      >
        {trendingProducts.slice(0, 4).map((product: any, index: number) => {
          return (
            <AnimatePresence key={index}>
              <motion.div
                className="w-full"
                key={product._id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard item={product} />
              </motion.div>
            </AnimatePresence>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TrendingNewProducts;
