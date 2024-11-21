"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToPOSCart, applyDiscount } from "@/redux/shoppingSlice";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { title } from "process";
import { runRevalidationTo } from "@/app/_actions";

// Define TypeScript interfaces
interface ProductVariation {
  _id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  image: string;
  colorHex?: string;
}

const POSProductCard = ({ product }: { product: any }) => {
  const [discountRate, setDiscountRate] = useState<string>(""); // State for discount percentage

  const [variation, setVariation] = useState<ProductVariation>({
    _id: product?.variations[0]?._id || "",
    size: product?.variations[0]?.size || "",
    color: product?.variations[0]?.color || "",
    price: product?.variations[0]?.price || 0,
    stock: product?.variations[0]?.stock || 0,
    image: product?.variations[0]?.image || "",
  });

  const dispatch = useDispatch();

  const handleClick = () => {
    const updatedVariation: any = {
      ...variation,
      product: product._id,
      variation: variation._id,
      title: product.title,
      images: [{ url: variation.image }],
      quantity: 1,
      brand: product.brand,
    };
    // Apply entered discount percentage
    if (discountRate !== "") {
      const discountedPrice =
        variation.price - (variation.price * Number(discountRate)) / 100;
      updatedVariation.price = discountedPrice;
      dispatch(
        applyDiscount({
          productId: product._id,
          discountRate: Number(discountRate),
        })
      );
    }
    setDiscountRate("");

    dispatch(addToPOSCart(updatedVariation));
    toast({
      title: `${product?.title} se agregó al carrito`,
      duration: 2000,
      style: {
        backgroundColor: "#3f7c49", // Customize background color here
        color: "#ffffff", // Customize text color here
      },
    });
    runRevalidationTo("/admin");
  };

  const handleDiscountChange = (e: any) => {
    const inputAmount = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setDiscountRate(inputAmount);
  };

  return (
    <div className="max-w-[130px] overflow-hidden relative ">
      <div
        className="w-full h-full group overflow-hidden relative cursor-pointer active:border-[10px] active:border-accent rounded-sm "
        onClick={handleClick}
      >
        <Image
          src={product?.images[0].url}
          alt="product image"
          className=" ease-in-out duration-200 w-full h-full object-cover group-hover:scale-110 rounded-t-sm"
          width={300}
          height={300}
        />
      </div>
      {product?.title === "1500" && (
        <div className="pt-3">
          <input
            className="p-2 border-black border-b font-playfair-display appearance-none bg-white text-red-700 bg-opacity-0 text-xs w-full text-center"
            type="text"
            placeholder="Descuento %"
            value={discountRate}
            onChange={handleDiscountChange}
          />
        </div>
      )}
    </div>
  );
};

export default POSProductCard;
