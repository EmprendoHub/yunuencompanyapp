"use client";
import Image from "next/image";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { motion } from "framer-motion";
import Link from "next/link";
import { calculatePercentage } from "@/backend/helpers";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToPOSCart } from "@/redux/shoppingSlice";
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
  } else if (getPathname.includes("socials")) {
    pathname = "socials";
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
    dispatch(addToPOSCart(updatedVariation));
    toast(`${product?.title.substring(0, 15)}... se agregó al carrito`);
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="border-[1px] rounded-sm max-w-[350px] maxmd:max-w-[100%] overflow-hidden relative cursor-pointer"
      onClick={handleClick}
    >
      <div className="w-[200px] h-[200px] group overflow-hidden relative">
        <Image
          src={product?.images[0].url}
          alt="product image"
          className=" ease-in-out duration-500 w-full h-full object-cover group-hover:scale-110 rounded-t-sm"
          width={350}
          height={350}
        />

        {product?.sale_price && (
          <span className="absolute top-2 right-2  border-[1px] border-black font-medium text-xs py-1 px-3 rounded-sm bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
            Oferta
          </span>
        )}
        {product?.stock <= 0 && (
          <span className="absolute rotate-12 top-1/2 right-1/4  border-[1px] border-black font-medium text-xl py-1 px-3 rounded-sm bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
            SOLD OUT
          </span>
        )}
        {product?.sale_price ? (
          <div>
            <div className="absolute top-2 left-2  border-[1px] border-black w-fit py-1 px-4 rounded-sm text-xs bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
              <p>
                {calculatePercentage(
                  product?.variations[0].price,
                  product?.sale_price
                )}
                % menos
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </motion.div>
  );
};

export default POSProductCard;
