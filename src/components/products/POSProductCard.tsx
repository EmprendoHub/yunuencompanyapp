"use client";
import Image from "next/image";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { motion } from "framer-motion";
import Link from "next/link";
import { calculatePercentage } from "@/backend/helpers";
import { usePathname } from "next/navigation";

const POSProductCard = ({ item }: { item: any }) => {
  const getPathname = usePathname();
  let pathname;
  if (getPathname.includes("admin")) {
    pathname = "admin/pos";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  } else if (getPathname.includes("instagram")) {
    pathname = "instagram";
  }
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="border-[1px] rounded-sm max-w-[350px] maxmd:max-w-[100%] overflow-hidden relative"
    >
      <Link href={`/${pathname}/producto/${item.slug}`}>
        <div className="w-[300px] h-[300px] group overflow-hidden relative">
          <Image
            src={item?.images[0].url}
            alt="product image"
            className=" ease-in-out duration-500 w-full h-full object-cover group-hover:scale-110 rounded-t-sm"
            width={350}
            height={350}
          />

          {item?.sale_price && (
            <span className="absolute top-2 right-2  border-[1px] border-black font-medium text-xs py-1 px-3 rounded-sm bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
              Oferta
            </span>
          )}
          {item?.stock <= 0 && (
            <span className="absolute rotate-12 top-1/2 right-1/4  border-[1px] border-black font-medium text-xl py-1 px-3 rounded-sm bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
              SOLD OUT
            </span>
          )}
          {item?.sale_price ? (
            <div>
              <div className="absolute top-2 left-2  border-[1px] border-black w-fit py-1 px-4 rounded-sm text-xs bg-black text-slate-100 group-hover:bg-slate-100 group-hover:text-foreground duration-200">
                <p>
                  {calculatePercentage(
                    item?.variations[0].price,
                    item?.sale_price
                  )}
                  % menos
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Link>
      <div className=" px-4 py-4 flex flex-col bg-gray-100 rounded-b-sm">
        <div className="flex items-center justify-between gap-x-1">
          <p className="text-foreground tracking-widest text-lg">
            {item?.title.substring(0, 15) + "..."}
          </p>
        </div>

        <div className="pricing-class flex fle-row items-center gap-x-2">
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold text-foreground tracking-wider text-xl">
              {item?.sale_price > 0 ? (
                <FormattedPrice amount={item?.sale_price} />
              ) : item?.variations[0].price > 0 ? (
                <FormattedPrice amount={item?.variations[0].price} />
              ) : (
                ""
              )}
            </p>
          </div>
          {item?.sale_price ? (
            <div>
              <div className="flex items-center gap-x-2">
                <p className="line-through text-sm text-foreground ">
                  <FormattedPrice amount={item?.variations[0].price} />
                </p>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default POSProductCard;
