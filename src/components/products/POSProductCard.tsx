"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToPOSCart, applyDiscount } from "@/redux/shoppingSlice";
import { toast } from "sonner";
import { useState } from "react";

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
  const getPathname = usePathname();
  const [discountRate, setDiscountRate] = useState<string>(""); // State for discount percentage
  const router = useRouter();
  let pathname: string;

  const [variation, setVariation] = useState<ProductVariation>({
    _id: product?.variations[0]?._id || "",
    size: product?.variations[0]?.size || "",
    color: product?.variations[0]?.color || "",
    price: product?.variations[0]?.price || 0,
    stock: product?.variations[0]?.stock || 0,
    image: product?.variations[0]?.image || "",
  });

  if (getPathname.includes("admin")) {
    pathname = "admin/pos";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  }

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
    toast(`${product?.title.substring(0, 15)}... se agregó al carrito`);
  };

  const handleDiscountChange = (e: any) => {
    const inputAmount = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setDiscountRate(inputAmount);
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="border-[1px] rounded-sm max-w-[150px] overflow-hidden relative"
    >
      <div
        className="w-full h-full group overflow-hidden relative cursor-pointer"
        onClick={handleClick}
      >
        <Image
          src={product?.images[0].url}
          alt="product image"
          className=" ease-in-out duration-500 w-full h-full object-cover group-hover:scale-110 rounded-t-sm"
          width={350}
          height={350}
        />
      </div>
      {/* <div className="pt-3">
        <input
          className="p-2 border-black border-b font-playfair-display appearance-none bg-white bg-opacity-0 text-xs w-full text-center"
          type="text"
          placeholder="Descuento %"
          value={discountRate}
          onChange={handleDiscountChange}
        />
      </div> */}
    </motion.div>
  );
};

export default POSProductCard;
