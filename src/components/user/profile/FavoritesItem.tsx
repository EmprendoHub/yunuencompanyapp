"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  decreaseQuantity,
  deleteProduct,
  increaseQuantity,
} from "@/redux/shoppingSlice";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import Image from "next/image";

const CartItem = () => {
  const { productsData } = useSelector((state: any) => state?.compras);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-y-2">
      <div className="text-xs font-normal md:hidden inline-flex items-center justify-between   bg-gray-200 py-3 px-5">
        <p className="text-foreground w-1/4">Procedimiento</p>
        <p className="flex items-center justify-start w-1/4">
          Deposito Inicial
        </p>
        <p className="flex items-center justify-center w-1/4">Descripción</p>
        <p className="flex items-center justify-end w-1/4">Costo Total</p>
      </div>
      {/* Generate product */}
      <div className="flex flex-col gap-y-2">
        {productsData?.map((item: any) => (
          <div
            key={item?._id}
            className="w-full bg-gray-300 p-4 flex maxsm:flex-col flex-row items-center gap-4"
          >
            <div className="flex items-center gap-x-3 w-full ">
              <span
                onClick={() => dispatch(deleteProduct(item?._id))}
                className="text.lg hover:text-red-600 cursor-pointer duration-300"
              >
                <AiOutlineClose />
              </span>
              <Image
                src={item?.images[0].url}
                width={100}
                height={100}
                alt="Imagen de Procedimiento"
                className=" w-15 w-15  object-cover"
              />
            </div>
            {/* Model Value */}
            <div className="w-full flex  justify-start sm:pl-7 ">
              <p className="text-lg font-semibold">
                <FormattedPrice amount={item?.quantity * item.price} />
              </p>
            </div>
            {/* Title and description */}
            <div className="w-full flex  justify-start sm:pl-7">
              <div className="flex flex-col">
                <p className="text-lg font-semibold justify-start">
                  {`${item?.title.substring(0, 25)}...`}
                </p>
                <p className="text-md justify-start">
                  {`${item?.description.substring(0, 25)}...`}
                </p>
              </div>
            </div>
            <div className="flex gap-x-3 border-[1px] border-slate-300 py-2 px-7 w-auto sm:w-full">
              <p className="text-md ">
                <FormattedPrice amount={item?.price} />
              </p>
            </div>
            {/* quantity value */}
            <div className="flex  items-center justify-end gap-x-3 border-[1px] border-slate-300 py-2 px-4 w-auto">
              <p className="">Cant</p>
              <div className="flex items-center text-lg text-foreground  w-20 justify-between">
                <span
                  onClick={() => dispatch(decreaseQuantity(item))}
                  className="cursor-pointer"
                >
                  <FiChevronLeft />
                </span>
                <span>{item?.quantity}</span>
                <span
                  onClick={() => dispatch(increaseQuantity(item))}
                  className="cursor-pointer"
                >
                  <FiChevronRight />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartItem;
